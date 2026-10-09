import { Pool } from "pg";

/**
 * One shared connection pool for the whole app. In development, Next.js
 * reloads modules often, so the pool is kept on globalThis to avoid opening
 * a new set of connections on every save.
 */
const globalForPg = globalThis as unknown as { pgPool?: Pool };

export const pool =
  globalForPg.pgPool ??
  new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 5, // a portfolio needs few connections
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000, // fail fast so the sample-data fallback kicks in
  });

if (process.env.NODE_ENV !== "production") globalForPg.pgPool = pool;
