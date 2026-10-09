import Image from "next/image";

/**
 * Shows an optimized image when `src` is set, otherwise the placeholder you
 * pass as children. Drop your file in /public, save its path in the database
 * (or lib/site.ts), and the placeholder disappears.
 */
export function AssetSlot({
  src,
  alt,
  sizes,
  className = "",
  imageClassName = "object-cover",
  eager = false,
  children,
}: {
  src: string | null | undefined;
  alt: string;
  /** How wide the image renders, so the browser downloads the right size */
  sizes: string;
  className?: string;
  imageClassName?: string;
  /** true only for the first thing visitors see (the portrait) */
  eager?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : undefined}
          className={imageClassName}
        />
      ) : (
        children
      )}
    </div>
  );
}

/** Small label inside a placeholder telling you which file goes there */
export function AssetHint({
  position = "bottom",
  children,
}: {
  position?: "top" | "bottom";
  children: React.ReactNode;
}) {
  return (
    <span
      className={`pointer-events-none absolute left-1/2 max-w-[90%] -translate-x-1/2 truncate rounded-full bg-night/75 px-3 py-1 text-[11px] font-medium text-mist ring-1 ring-line/60 ${
        position === "top" ? "top-3" : "bottom-3"
      }`}
    >
      {children}
    </span>
  );
}
