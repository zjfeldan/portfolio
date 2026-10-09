import { Pool } from "pg";

/**
 * One shared connection pool for the whole app.
 *
 * - Online (Vercel + Neon): uses DATABASE_URL, which the Neon integration
 *   adds to your Vercel project automatically. The URL already asks for a
 *   secure (SSL) connection.
 * - On your computer: uses the DB_* values in .env.local (your local
 *   PostgreSQL from pgAdmin).
 *
 * In development, Next.js reloads modules often, so the pool is kept on
 * globalThis to avoid opening a new set of connections on every save.
 */
const globalForPg = globalThis as unknown as { pgPool?: Pool };

const shared = {
  max: 5, // a portfolio needs few connections
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000, // fail fast so the sample-data fallback kicks in
};

export const pool =
  globalForPg.pgPool ??
  new Pool(
    process.env.DATABASE_URL
      ? { connectionString: process.env.DATABASE_URL, ...shared }
      : {
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT ?? 5432),
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          ...shared,
        },
  );

if (process.env.NODE_ENV !== "production") globalForPg.pgPool = pool;
