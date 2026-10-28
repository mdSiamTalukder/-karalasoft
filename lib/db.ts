import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing from environment variables.");
}

const globalForPg = globalThis as typeof globalThis & {
  postgresPool?: Pool;
};

export const db =
  globalForPg.postgresPool ??
  new Pool({
    connectionString,
    connectionTimeoutMillis: 10_000,
    max: 5,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPg.postgresPool = db;
}
