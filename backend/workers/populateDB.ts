import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { parentPort } from "node:worker_threads";
import { faker } from "@faker-js/faker";
import { db } from "../database";

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

async function populateDatabase(): Promise<void> {
  try {
    parentPort?.postMessage("Starting database population...");

    const contacts = generateContacts();
    const messages = await getMessageContent();

    const contactsArray = Array.from(contacts);
    const CHUNK_SIZE = 1000; // Process 1000 contacts at a time
    const totalContacts = contactsArray.length;

    // Process contacts in chunks to avoid memory issues
    for (let i = 0; i < totalContacts; i += CHUNK_SIZE) {
      const contactChunk = contactsArray.slice(i, i + CHUNK_SIZE);

      await db.tx(async (t) => {
        // Batch insert contacts for this chunk
        const contactQueries = contactChunk.map((contact) =>
          t.one<ContactResult>(
            "INSERT INTO contact (phone_number) VALUES ($1) RETURNING id",
            [contact],
          ),
        );

        const contactResults = await t.batch(contactQueries);

        // Process messages in smaller batches for each contact
        for (const contactResult of contactResults) {
          const contactId = contactResult.id;
          // Generate random messages for this contact
          const contactMessages: string[] = [];
          for (let j = 0; j < 50; j++) {
            const randomIndex = Math.floor(Math.random() * messages.length);
            contactMessages.push(messages[randomIndex]);
          }

          // Insert messages in batches of 100
          const MESSAGE_BATCH_SIZE = 100;
          for (let k = 0; k < contactMessages.length; k += MESSAGE_BATCH_SIZE) {
            const messageBatch = contactMessages.slice(
              k,
              k + MESSAGE_BATCH_SIZE,
            );

            const messageQueries = messageBatch.map((message) =>
              t.none(
                "INSERT INTO message (contact_id, content) VALUES ($1, $2)",
                [contactId, message],
              ),
            );

            await t.batch(messageQueries);
          }
        }
      });

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
populateDatabase();
