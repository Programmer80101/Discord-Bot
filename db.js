// db.js
const {Pool} = require("pg");
const config = require("./config");

const pool = new Pool({
  connectionString: config.db.url,
  ssl: {rejectUnauthorized: false},
});

// Determine which schema to use
const schema = config.isDev ? "dev" : "prod";
const table = (name) => `"${schema}"."${name}"`;

async function initSchema() {
  // 1. Create the schema if it doesn't exist
  await pool.query(`CREATE SCHEMA IF NOT EXISTS "${schema}";`);

  // 2. Create the users table in that schema
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${table("users")} (
      user_id    TEXT   PRIMARY KEY,
      balance    BIGINT NOT NULL DEFAULT 0,
      last_daily BIGINT
    );
  `);
}

// Run migrations on startup
initSchema().catch((err) => {
  console.error("❌ Failed to init schema:", err);
  process.exit(1);
});

async function getBalance(userId) {
  const {rows} = await pool.query(
    `SELECT balance FROM ${table("users")} WHERE user_id = $1`,
    [userId]
  );
  return rows[0]?.balance ?? 0;
}

async function addBalance(userId, amount) {
  await pool.query(
    `
      INSERT INTO ${table("users")} (user_id, balance)
      VALUES ($1, $2)
      ON CONFLICT (user_id) DO UPDATE
      SET balance = ${table("users")}.balance + $2
    `,
    [userId, amount]
  );
}

async function getLastDaily(userId) {
  const {rows} = await pool.query(
    `SELECT last_daily FROM ${table("users")} WHERE user_id = $1`,
    [userId]
  );
  return rows[0]?.last_daily ?? null;
}

async function setLastDaily(userId, timestampMs) {
  await pool.query(
    `
      INSERT INTO ${table("users")} (user_id, last_daily)
      VALUES ($1, $2)
      ON CONFLICT (user_id) DO UPDATE
      SET last_daily = $2
    `,
    [userId, timestampMs]
  );
}

module.exports = {
  getBalance,
  addBalance,
  getLastDaily,
  setLastDaily,
};
