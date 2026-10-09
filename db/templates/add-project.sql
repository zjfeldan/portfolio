-- =====================================================================
-- add-project.sql: copy this into pgAdmin's Query Tool (portfolio_db)
-- to add ONE entry to a category's gallery.
--
-- 1. Save the image as public/images/projects/<category>/<name>.webp
--    (A4 portrait, about 1240 x 1754 px, under 400 KB)
-- 2. Change every value marked  <--
-- 3. Press F5, then restart `npm run dev` to see it on the page
--
-- Handy lookups (run these on their own to see the slugs you can use):
--   SELECT slug, name FROM project_categories ORDER BY sort_order;
--   SELECT slug, name FROM skills ORDER BY name;
-- =====================================================================

WITH new_project AS (
  INSERT INTO projects
    (category_id, slug, title, description, image_url, image_alt, project_url, completed_on)
  VALUES (
    (SELECT id FROM project_categories WHERE slug = 'graphic-design'),  -- <-- category slug
    'sample-poster',                                     -- <-- unique id: lowercase-with-dashes
    'Sample poster',                                     -- <-- title
    'What it was for, what you did and how it turned out.',  -- <-- description (or NULL)
    '/images/projects/graphic-design/sample-poster.webp',    -- <-- image path (starts with /images)
    'Poster for the 2026 university foundation week',    -- <-- what the image shows
    NULL,                                                -- <-- "See more" link in quotes, or NULL
    '2026-10-09'                                         -- <-- date finished, YYYY-MM-DD
  )
  RETURNING id
)
-- Tools used: skill slugs from the skills table
INSERT INTO project_skills (project_id, skill_id)
SELECT new_project.id, s.id
FROM new_project
JOIN skills s ON s.slug IN ('photoshop', 'illustrator');  -- <-- tools

-- A tool that isn't in your skills yet? Add it first. is_visible = false
-- keeps it out of the Skills row but still lets projects list it:
--   INSERT INTO skills (slug, name, category, proficiency, icon_key, is_visible)
--   VALUES ('procreate', 'Procreate', 'design', 4, 'pen', false);
