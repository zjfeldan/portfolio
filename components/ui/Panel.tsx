/**
 * One scroll "landing area". Every top-level section of the page is a Panel,
 * so spacing, edges and scroll behaviour stay consistent.
 */
import { PortraitSlideshow } from "@/components/ui/PortraitSlideshow";
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
      className={`relative border border-line bg-surface p-4 shadow-[0_30px_60px_-36px_rgb(0_0_0/0.35)] sm:p-6 lg:p-8 ${className}`}
    >
      {children}
    </section>
  );
}

/** Section heading */
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
    <div className={`flex flex-col ${className}`}>
      <h2
        id={id}
        className="font-display text-lg font-extrabold uppercase leading-none tracking-tight text-ink sm:text-xl"
      >
        {children}
      </h2>
    </div>
  );
}

/** Framed inner area used for Skills, Certificates, Experience, Education */
export function Tray({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`border border-line bg-sunken p-3 sm:p-4 ${className}`}>
      {children}
    </div>
  );
}
