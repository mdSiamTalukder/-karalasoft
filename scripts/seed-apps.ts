
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

const apps = [
  {
    slug: 'flowdesk-demo',
    name: 'FlowDesk',
    category: 'Productivity',
    shortDescription:
      'A smarter workspace concept for organizing tasks, tracking progress, and keeping teams focused.',
    description:
      'FlowDesk is a demo concept for a modern productivity application. It demonstrates how tasks, workflows, and progress insights could come together in one organized workspace.',
    features: [
      'Task and workflow organization',
      'Progress tracking dashboard',
      'Clean and responsive workspace',
      'Designed for focused productivity',
    ],
  },
  {
    slug: 'shoppilot-demo',
    name: 'ShopPilot',
    category: 'E-commerce',
    shortDescription:
      'An e-commerce management concept for organizing products, orders, and store operations.',
    description:
      'ShopPilot is a demo concept that showcases a streamlined interface for managing an online store. The idea focuses on making everyday store operations easier to understand and manage.',
    features: [
      'Product catalog management concept',
      'Order overview interface',
      'Store performance insights concept',
      'Responsive management experience',
    ],
  },
  {
    slug: 'stayzuno-demo',
    name: 'StayZuno',
    category: 'Hospitality',
    shortDescription:
      'A hospitality platform concept designed to make discovering and managing stays feel effortless.',
    description:
      'StayZuno is presented here as a demo listing to preview the KaralaSoft Apps experience. Its description and feature list are sample content for layout testing, not a verified specification of a live product.',
    features: [
      'Stay discovery concept',
      'Accommodation information layout',
      'Guest-friendly browsing experience',
      'Responsive interface concept',
    ],
  },
  {
    slug: 'printstudio-demo',
    name: 'PrintStudio',
    category: 'Business Tools',
    shortDescription:
      'A print business tool concept for presenting services, organizing requests, and simplifying workflows.',
    description:
      'PrintStudio is a sample application concept for exploring how a print-focused business tool could be presented on KaralaSoft. All information on this page is illustrative demo content.',
    features: [
      'Print service catalog concept',
      'Customer request organization',
      'Order workflow overview',
      'Business-focused responsive layout',
    ],
  },
];

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

    for (const [index, app] of apps.entries()) {
      await pool.query(
        `INSERT INTO apps (
           slug,
           name,
           category,
           short_description,
           description,
           features,
           status,
           is_published,
           order_index
         )
         VALUES ($1, $2, $3, $4, $5, $6::jsonb, 'Demo', TRUE, $7)
         ON CONFLICT (slug) DO NOTHING`,
        [
          app.slug,
          app.name,
          app.category,
          app.shortDescription,
          app.description,
          JSON.stringify(app.features),
          index,
        ],
      );
    }

    await pool.query('COMMIT');

    const result = await pool.query(
      `SELECT slug, name, is_published
       FROM apps
       ORDER BY order_index ASC, created_at DESC`,
    );

    console.log('Demo apps seed completed.');
    console.table(result.rows);
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Failed to seed demo apps:', error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
