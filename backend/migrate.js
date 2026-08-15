const { Client } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const PROJECT_REF = process.env.PROJECT_REF;
const DATABASE_URL = process.env.DATABASE_URL;

function buildClient(poolerPort) {
  if (DATABASE_URL) {
    return new Client({
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: true },
      connectionTimeoutMillis: 10000,
    });
  }
  return new Client({
    user: `postgres.${PROJECT_REF}`,
    password: process.env.DATABASE_PASSWORD,
    host: "aws-0-ap-southeast-1.pooler.supabase.com",
    port: poolerPort,
    database: "postgres",
    ssl: { rejectUnauthorized: true },
    connectionTimeoutMillis: 10000,
  });
}

async function runMigration(client, label) {
  const sqlPath = path.join(__dirname, "migrations", "001_create_attendances.sql");
  const sql = fs.readFileSync(sqlPath, "utf8");
  await client.query(sql);
  console.log(`Migration 001_create_attendances.sql berhasil dijalankan (${label})!`);
}

async function migrate() {
    let client = buildClient(6543);
    let connected = false;

    try {
        await client.connect();
        connected = true;
        console.log("Connected to database via pooler");
        await runMigration(client, "pooler");
    } catch (error) {
        console.error("Migration error:", error.message);
        console.log("Mencoba koneksi langsung ke database...");
        try {
            const directClient = new Client({
                user: `postgres.${PROJECT_REF}`,
                password: process.env.DATABASE_PASSWORD,
                host: `db.${PROJECT_REF}.supabase.co`,
                port: 5432,
                database: "postgres",
                ssl: { rejectUnauthorized: true },
                connectionTimeoutMillis: 10000,
            });
            await directClient.connect();
            console.log("Connected to database directly");
            await runMigration(directClient, "direct");
            await directClient.end();
        } catch (directError) {
            console.error("Direct connection error:", directError.message);
        }
    } finally {
        if (connected) await client.end();
    }
}

migrate();
