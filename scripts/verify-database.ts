import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function main() {
  const { db } = await import("../lib/db");

  try {
    const result = await db.query(
      "SELECT current_database() AS database, NOW() AS connected_at"
    );

    console.log("Neon PostgreSQL connection successful!");
    console.log("Database:", result.rows[0].database);
    console.log("Connected at:", result.rows[0].connected_at);
  } catch (error) {
    console.error(
      "Database connection failed:",
      error instanceof Error ? error.message : "Unknown error"
    );
    process.exitCode = 1;
  } finally {
    await db.end();
  }
}

main().catch((error) => {
  console.error("Verification failed:", error);
  process.exitCode = 1;
});
