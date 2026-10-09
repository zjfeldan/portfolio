import { connection } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  await connection(); // run on every request, never cached at build time
  try {
    const { rows } = await pool.query("SELECT version()");
    return Response.json({ ok: true, database: rows[0].version });
  } catch (err) {
    return Response.json(
      { ok: false, error: (err as Error).message },
      { status: 500 },
    );
  }
}
