-- =====================================================================
-- 005_merge_art_categories.sql
-- Merges Graphic Design, Digital Illustration and Digital Assets into one
-- card: "Digital Art and Graphic Design". Every entry is kept; only its
-- category changes. Run once in pgAdmin's Query Tool on portfolio_db (F5),
-- then restart `npm run dev`. Safe to run again.
-- =====================================================================

BEGIN;

-- 1. Graphic Design becomes the umbrella card (keeps its id and cover image)
UPDATE project_categories
SET slug = 'digital-art-graphic-design',
    name = 'Digital Art and Graphic Design',
    icon_key = 'palette',
    sort_order = 10
WHERE slug = 'graphic-design';

-- (In case Graphic Design was already renamed or removed)
INSERT INTO project_categories (slug, name, icon_key, sort_order)
VALUES ('digital-art-graphic-design', 'Digital Art and Graphic Design', 'palette', 10)
ON CONFLICT (slug) DO NOTHING;

-- 2. Move every entry from the other two categories into it
UPDATE projects
SET category_id = (SELECT id FROM project_categories WHERE slug = 'digital-art-graphic-design')
WHERE category_id IN (
  SELECT id FROM project_categories WHERE slug IN ('graphic-design', 'digital-illustration', 'digital-assets')
);

-- 3. Remove the now-empty categories
DELETE FROM project_categories
WHERE slug IN ('graphic-design', 'digital-illustration', 'digital-assets');

-- 4. Card order: Digital Art and Graphic Design, Web Development, Motion Graphics
UPDATE project_categories SET sort_order = 20 WHERE slug = 'web-development';
UPDATE project_categories SET sort_order = 30 WHERE slug = 'motion-graphics';

COMMIT;
