import fs from "node:fs";
import path from "node:path";
import { Worker } from "node:worker_threads";
import { faker } from "@faker-js/faker";
import { Request, Response } from "express";
import { db } from "../database";

// Generate 100k fake unique contacts
function generateContacts() {
  const contacts = new Set();
  while (contacts.size < 100000) {
    contacts.add(faker.phone.number({ style: "international" }));
  }

  return contacts;
}

async function setUpDB(_: Request, response: Response) {
  try {
    await db.none("DROP TABLE IF EXISTS message");
    await db.none("DROP TABLE IF EXISTS contact");

    console.log("Dropped existing tables");

    // Import message table and contact table schema
    const contactSql = fs.readFileSync(
      path.join(__dirname, "..", "data", "contact.sql"),
      "utf8",
    );
    for (const query of contactSql.split(";")) {
      if (query.trim()) {
        await db.none(query);
      }
    }

    const messageSql = fs.readFileSync(
      path.join(__dirname, "..", "data", "message.sql"),
      "utf8",
    );
    for (const query of messageSql.split(";")) {
      if (query.trim()) {
        await db.none(query);
      }
    }

    // Return success response
    response.status(201).json({
      message: "Database setup complete",
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      response.status(500).json({
        message: "Error setting up database",
        error: error.message,
      });
    } else {
      response.status(500).json({
        message: "Error setting up database",
        error: "Unknown error",
      });
    }
  }
}

async function populateDB(_: Request, response: Response) {
  try {
    // Return success response immediately
    response.status(201).json({
      message:
        "Database population started in background. Check server console for progress.",
    });

    console.log("Starting database population in background...");

    // Start the database population in a worker thread
    const workerPath = path.join(__dirname, "..", "workers", "populate.worker.js");
    const worker = new Worker(workerPath);

    worker.on("message", (message) => {
      console.log(message);
    });

    worker.on("error", (err) => {
      console.error("Worker error:", err);
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        console.error(`Worker stopped with exit code ${code}`);
      } else {
        console.log("Database population completed successfully");
      }
    });
  } catch (error: unknown) {
    console.error(
      "Error starting database population:",
      error instanceof Error ? error.message : "Unknown error",
    );
  }
}

export { generateContacts, populateDB, setUpDB };
