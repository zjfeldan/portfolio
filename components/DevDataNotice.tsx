/**
 * Development-only notice shown when the page falls back to the sample data
 * in lib/fallback-data.ts because PostgreSQL could not be reached.
 */
export function DevDataNotice() {
  return (
    <div
      role="status"
      className="fixed bottom-4 left-1/2 z-40 w-[min(92vw,560px)] -translate-x-1/2 rounded-2xl bg-ink px-4 py-3 text-sm text-night shadow-2xl"
    >
      <strong className="font-bold">Showing sample data.</strong> The database could not be
      reached. Check <code className="font-semibold">.env.local</code>, run{" "}
      <code className="font-semibold">db/schema.sql</code> and{" "}
      <code className="font-semibold">db/seed.sql</code> in pgAdmin, then restart{" "}
      <code className="font-semibold">npm run dev</code>.
    </div>
  );
}
