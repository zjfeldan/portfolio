// =====================================================================
// import-art.mjs
// Converts a folder of artwork (PNG, JPG or WebP) into small WebP files
// for the website, and writes the SQL that adds them all to the
// "Digital Art and Graphic Design" gallery.
//
// Run from the portfolio folder:
//   node scripts/import-art.mjs "C:\path\to\digital-art-and-graphic-design"
//
// What it does:
//   1. Converts every image to WebP (longest side max 2000 px, quality 90)
//      into public/images/projects/digital-art/  (originals are untouched)
//   2. Writes db/imports/digital-art.sql with one entry per image:
//      title = file name (edit before running), date = file's modified date
//   Run it again after adding new images: existing entries keep their
//   titles and dates; only new ones are added.
// =====================================================================
import sharp from "sharp";
import { mkdir, open, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

// ---- Settings you can change ----------------------------------------
const CATEGORY_SLUG = "digital-art-graphic-design"; // which stack card
const OUTPUT_FOLDER = "digital-art"; // public/images/projects/<this>
const SLUG_PREFIX = "art-"; // entry ids become art-a, art-a1, ...
const MAX_SIDE = 2000; // px, longest side
const QUALITY = 90; // 1-100 (90 keeps fine linework and gradients clean)
// ----------------------------------------------------------------------

const sourceDir = process.argv[2];
if (!sourceDir) {
  console.error('Usage: node scripts/import-art.mjs "C:\\path\\to\\your\\images"');
  process.exit(1);
}

const outputDir = path.join("public", "images", "projects", OUTPUT_FOLDER);
const sqlPath = path.join("db", "imports", "digital-art.sql");
await mkdir(outputDir, { recursive: true });
await mkdir(path.dirname(sqlPath), { recursive: true });

// A, A1, A2, B, B1 ... (numbers sort as numbers, so A10 comes after A9)
const files = (await readdir(sourceDir))
  .filter((file) => /\.(png|jpe?g|webp)$/i.test(file))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

if (files.length === 0) {
  console.error(`No PNG, JPG or WebP files found in ${sourceDir}`);
  process.exit(1);
}

const sqlText = (value) => `'${String(value).replace(/'/g, "''")}'`;

/** Looks at a file's first bytes to say what it really is, whatever its extension */
async function realFormat(file) {
  const handle = await open(file, "r");
  try {
    const { buffer, bytesRead } = await handle.read(Buffer.alloc(32), 0, 32, 0);
    if (bytesRead === 0) return "an empty file (0 bytes)";
    const head = buffer.subarray(0, bytesRead);
    const text = head.toString("latin1");
    if (head[0] === 0x89 && text.startsWith("PNG", 1)) return "PNG";
    if (head[0] === 0xff && head[1] === 0xd8) return "JPG";
    if (text.startsWith("RIFF") && text.slice(8, 12) === "WEBP") return "WebP (possibly damaged)";
    if (text.startsWith("GIF8")) return "GIF";
    if (text.slice(4, 8) === "ftyp") return `${text.slice(8, 12).trim().toUpperCase()} (HEIC/AVIF family)`;
    if (text.startsWith("8BPS")) return "a Photoshop PSD";
    if (/^\s*<(\?xml|svg)/i.test(text)) return "an SVG/XML file";
    return "an unknown or damaged file";
  } finally {
    await handle.close();
  }
}
const seen = new Set();
const rows = [];
const skipped = [];
let bytesIn = 0;
let bytesOut = 0;

for (const file of files) {
  const base = path.parse(file).name;
  const name = base.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  if (!name || seen.has(name)) {
    console.warn(`! Skipped ${file}: another file already uses the name "${name}"`);
    continue;
  }
  seen.add(name);

  const source = path.join(sourceDir, file);
  const output = path.join(outputDir, `${name}.webp`);
  const info = await stat(source);

  let result;
  try {
    result = await sharp(source, { limitInputPixels: false })
      .rotate() // respects phone-photo orientation
      .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: "inside", withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(output);
  } catch (error) {
    // One bad file shouldn't stop the rest
    const kind = await realFormat(source).catch(() => "unreadable");
    console.warn(`! Skipped ${file}: it is really ${kind} (${error.message})`);
    skipped.push(`${file}: really ${kind}`);
    seen.delete(name);
    continue;
  }

  bytesIn += info.size;
  bytesOut += result.size;
  // The file's last-modified date stands in for "when you made it"
  const made = info.mtime.toLocaleDateString("en-CA"); // YYYY-MM-DD

  rows.push(
    `  (${sqlText(SLUG_PREFIX + name)}, ${sqlText(base)}, ` +
      `${sqlText(`/images/projects/${OUTPUT_FOLDER}/${name}.webp`)}, ` +
      `${result.width}, ${result.height}, ${sqlText(made)})`,
  );
  console.log(`✓ ${file} -> ${output}  (${result.width}x${result.height}, ${(result.size / 1024).toFixed(0)} KB)`);
}

const sql = `-- =====================================================================
-- Generated by scripts/import-art.mjs on ${new Date().toLocaleString()}
-- ${rows.length} images for the "${CATEGORY_SLUG}" gallery.
--
-- Before running: change the titles (2nd value in each row) to the real
-- names of your works, and fix any dates (last value, YYYY-MM-DD) that
-- aren't when you made the piece. Then run in pgAdmin (F5) and restart
-- \`npm run dev\`.
--
-- Columns: (slug, title, image path, width, height, date made)
-- Safe to run again: existing entries only get their image refreshed;
-- titles and dates you've changed in the database are kept.
-- =====================================================================

BEGIN;

INSERT INTO projects
  (category_id, slug, title, image_url, image_alt, image_width, image_height, completed_on)
SELECT c.id, v.slug, v.title, v.image_url, v.title, v.width, v.height, v.made::date
FROM (VALUES
${rows.join(",\n")}
) AS v (slug, title, image_url, width, height, made)
JOIN project_categories c ON c.slug = ${sqlText(CATEGORY_SLUG)}
ON CONFLICT (slug) DO UPDATE SET
  image_url    = EXCLUDED.image_url,
  image_width  = EXCLUDED.image_width,
  image_height = EXCLUDED.image_height;

COMMIT;
`;
await writeFile(sqlPath, sql, "utf8");

const mb = (bytes) => (bytes / 1024 / 1024).toFixed(1);
console.log(`\nDone: ${rows.length} images, ${mb(bytesIn)} MB -> ${mb(bytesOut)} MB`);
console.log(`Images: ${outputDir}`);
console.log(`SQL:    ${sqlPath}  (edit the titles, then run it in pgAdmin)`);
if (skipped.length > 0) {
  console.log(`\n${skipped.length} file(s) skipped, not included in the SQL:`);
  for (const line of skipped) console.log(`  - ${line}`);
  console.log("Open each in Photoshop, export it again as PNG, then run this script again.");
}
