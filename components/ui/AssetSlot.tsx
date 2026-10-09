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
  quality,
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
  /** 1-100; must be listed in images.qualities in next.config.ts (default 75) */
  quality?: number;
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
          quality={quality}
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
