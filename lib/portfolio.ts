import { cacheLife, cacheTag } from "next/cache";
import { pool } from "@/lib/db";
import { fallbackData } from "@/lib/fallback-data";
import type { PortfolioData } from "@/lib/types";

/**
 * Loads everything the home page needs in ONE database round trip.
 * The SQL lives in db/schema.sql as the function portfolio_payload(), which
 * returns a single JSON object. You can run `SELECT portfolio_payload();`
 * in pgAdmin to see exactly what the page receives.
 *
 * "use cache" stores the result, so most visits never touch the database.
 * After you edit data in pgAdmin, restart `npm run dev` to see the changes.
 */
async function loadFromDatabase(): Promise<PortfolioData> {
  "use cache";
  cacheLife("hours");
  cacheTag("portfolio");

  const { rows } = await pool.query<{ data: PortfolioData }>(
    "SELECT portfolio_payload() AS data",
  );
  const data = rows[0]?.data;
  if (!data) throw new Error("portfolio_payload() returned no data");

  return {
    ...data,
    // If the profile row hasn't been added yet, keep the page usable
    profile: data.profile ?? fallbackData.profile,
  };
}

export async function getPortfolio(): Promise<{
  data: PortfolioData;
  source: "database" | "fallback";
}> {
  // No database configured (e.g. a Vercel project before the Neon database is
  // connected): use the sample content instead of trying localhost, so the
  // build still succeeds.
  if (!process.env.DATABASE_URL && !process.env.DB_HOST) {
    console.warn("[portfolio] No database configured (DATABASE_URL or DB_HOST); using sample data.");
    return { data: fallbackData, source: "fallback" };
  }

  try {
    return { data: await loadFromDatabase(), source: "database" };
  } catch (error) {
    console.warn(
      "[portfolio] Using sample data, database query failed:",
      error instanceof Error ? error.message : error,
    );
    return { data: fallbackData, source: "fallback" };
  }
}
