
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Pool } from 'pg';

function loadEnvFile() {
  const envPath = resolve(process.cwd(), '.env.local');
  const content = readFileSync(envPath, 'utf8');

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

const demoSlugs = [
  'flowdesk-demo',
  'shoppilot-demo',
  'stayzuno-demo',
  'printstudio-demo',
] as const;

async function main() {
  loadEnvFile();

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is missing from .env.local');
  }

  const pool = new Pool({
    connectionString,
    connectionTimeoutMillis: 10_000,
    max: 2,
  });

  try {
    await pool.query('BEGIN');

    const result = await pool.query(
      `DELETE FROM apps
       WHERE slug = ANY($1::text[])
       RETURNING slug, name`,
      [demoSlugs],
    );

    await pool.query('COMMIT');

    console.log('Specified demo apps removed successfully.');
    console.table(result.rows);

    if (result.rowCount === 0) {
      console.log('No matching demo apps were found in the database.');
    }
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Failed to remove demo apps:', error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error('Script failed:', error);
  process.exitCode = 1;
});
