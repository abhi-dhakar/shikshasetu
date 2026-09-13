import "dotenv/config";
import crypto from "node:crypto";
import { Client } from "pg";

const username = (process.env.ADMIN_USERNAME || "admin").trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!password) {
  throw new Error("ADMIN_PASSWORD is required");
}

const salt = crypto.randomBytes(18);
const derived = crypto.pbkdf2Sync(password, salt, 210000, 32, "sha256");
const passwordHash = `pbkdf2_sha256$210000$${salt.toString("base64url")}$${derived.toString("base64url")}`;
const client = new Client({ connectionString: process.env.DATABASE_URL });

try {
  await client.connect();
  const result = await client.query(
    `insert into admin_accounts (username, display_name, password_hash, active)
     values ($1, $2, $3, true)
     on conflict (username) do update set
       display_name = excluded.display_name,
       password_hash = excluded.password_hash,
       active = true,
       password_changed_at = now()
     returning username`,
    [username, "Temporary Administrator", passwordHash],
  );
  console.log(`Admin account ready: ${result.rows[0].username}`);
} finally {
  await client.end();
}
