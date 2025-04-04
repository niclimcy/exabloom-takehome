import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { parentPort } from "node:worker_threads";
import { faker } from "@faker-js/faker";
import { db, helpers } from "../database";

// Ensure parentPort exists since this is a worker file
if (!parentPort) {
  throw new Error("This module must be run as a worker thread");
}

// Generate 100k fake unique contacts
function generateContacts(): Set<string> {
  parentPort?.postMessage("Generating contacts...");
  const contacts = new Set<string>();
  while (contacts.size < 100000) {
    contacts.add(faker.phone.number({ style: "international" }));
  }
  return contacts;
}

// Returns about 180k string messages
async function getMessageContent(): Promise<string[]> {
  const messages: string[] = [];
  parentPort?.postMessage("Loading message content...");

  const stream = fs.createReadStream(
    path.join(__dirname, "..", "data", "message_content.csv"),
  );
  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  for await (let line of rl) {
    // Sanitize line to remove quotes
    if (line[0] === '"') {
      line = line.slice(1);
    }
    if (line[line.length - 1] === '"') {
      line = line.slice(0, -1);
    }
    messages.push(line.trim());
  }

  return messages;
}

interface ContactResult {
  id: number;
  [key: string]: unknown;
}

async function populateDB(): Promise<void> {
  try {
    parentPort?.postMessage("Starting database population...");

    const contacts = generateContacts();
    const messages = await getMessageContent();

    const contactsArray = Array.from(contacts);
    const CHUNK_SIZE = 1000;
    const totalContacts = contactsArray.length;

    // Process contacts in chunks to avoid out of memory
    for (let i = 0; i < totalContacts; i += CHUNK_SIZE) {
      const contactsChunk = contactsArray
        .slice(i, i + CHUNK_SIZE)
        .map((contact) => ({ phone_number: contact }));
      const contactColumns = new helpers.ColumnSet(["phone_number"], {
        table: "contact",
      });

      const contactsQuery =
        helpers.insert(contactsChunk, contactColumns) + " RETURNING id";

      const contactsCreated = await db.many<ContactResult>(contactsQuery);

      // Insert 50 message for each contact
      const messagesToInsert = [];
      for (let j = 0; j < 50; j++) {
        const randomMessage =
          messages[Math.floor(Math.random() * messages.length)];
        const contactId = contactsCreated[j % contactsCreated.length].id;
        messagesToInsert.push({
          contact_id: contactId,
          content: randomMessage,
        });
      }
      const messageColumns = new helpers.ColumnSet(["contact_id", "content"], {
        table: "message",
      });

      const messagesQuery = helpers.insert(messagesToInsert, messageColumns);

      await db.none(messagesQuery);

      parentPort?.postMessage(
        `Processed ${Math.min(i + CHUNK_SIZE, totalContacts)} of ${totalContacts} contacts`,
      );
    }

    parentPort?.postMessage("Database population completed!");
    process.exit(0);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    parentPort?.postMessage(`Error populating database: ${errorMessage}`);
    process.exit(1);
  }
}

// Start the population process
populateDB();
