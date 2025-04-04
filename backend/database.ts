import { config } from "dotenv";
import pgPromise from "pg-promise";

config();

const pgp = pgPromise({});
const db = pgp(process.env.DATABASE_URL ?? "");
const { helpers } = pgp;

export { db, helpers };
