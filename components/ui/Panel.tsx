/**
 * One scroll "landing area". Every top-level section of the page is a Panel,
 * so spacing, corners and scroll behaviour stay consistent.
 */
export function Panel({
  id,
  labelledBy,
  className = "",
  children,
}: {
  id: string;
  labelledBy?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-snap
      className={`relative rounded-[32px] bg-frame/70 p-4 ring-1 ring-line/60 sm:p-6 lg:p-8 ${className}`}
    >
      {children}
    </section>
  );
}

export function SectionTitle({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className={`font-display text-base font-bold uppercase tracking-[0.14em] text-ink sm:text-lg ${className}`}
    >
      {children}
    </h2>
  );
}

/** Rounded inner frame used for Skills, Certificates, Experience, Education */
export function Tray({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-[26px] bg-night/45 p-3 ring-2 ring-line/80 sm:p-4 ${className}`}>
      {children}
    </div>
  );
}
