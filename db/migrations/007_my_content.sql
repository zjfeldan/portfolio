-- =====================================================================
-- 007_my_content.sql
-- Your real content: contact details, CV link, Web Development entry,
-- Motion Graphics cleared, experience, education and social links.
-- Run once in pgAdmin's Query Tool on portfolio_db (F5), then restart
-- `npm run dev`. Safe to run again.
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- Contact email + CV (save the PDF as public/files/Zach-Jacob-Feldan-CV.pdf)
-- ---------------------------------------------------------------------
UPDATE profile
SET email      = 'zachjacobtfeldan@gmail.com',
    resume_url = '/files/Zach-Jacob-Feldan-CV.pdf'
WHERE id = 1;

-- ---------------------------------------------------------------------
-- Web Development: only this portfolio
-- (screenshot: public/images/projects/web-development/portfolio-website.png)
-- ---------------------------------------------------------------------
DELETE FROM projects
WHERE category_id = (SELECT id FROM project_categories WHERE slug = 'web-development')
  AND slug <> 'portfolio-website';

INSERT INTO projects (category_id, slug, title, description, image_url, image_alt, project_url, completed_on)
SELECT c.id,
       'portfolio-website',
       'This Portfolio',
       'My personal portfolio, designed and built from scratch. The front end uses Next.js and Tailwind CSS, and every project, skill and credential is stored in a PostgreSQL database and loaded in a single query. It includes a category stack, a Pinterest-style gallery with sorting, an image viewer that adapts to portrait and landscape work, and a script that converts and imports artwork automatically.',
       '/images/projects/web-development/portfolio-website.png',
       'Home page of my portfolio website',
       'https://github.com/zjfeldan',
       '2026-10-09'
FROM project_categories c
WHERE c.slug = 'web-development'
ON CONFLICT (slug) DO UPDATE SET
  category_id  = EXCLUDED.category_id,
  title        = EXCLUDED.title,
  description  = EXCLUDED.description,
  image_url    = EXCLUDED.image_url,
  image_alt    = EXCLUDED.image_alt,
  project_url  = EXCLUDED.project_url,
  completed_on = EXCLUDED.completed_on;

-- Tools used on it (from your skills table)
DELETE FROM project_skills
WHERE project_id = (SELECT id FROM projects WHERE slug = 'portfolio-website');

INSERT INTO project_skills (project_id, skill_id)
SELECT p.id, s.id
FROM projects p
JOIN skills s ON s.slug IN ('nextjs', 'react', 'tailwind', 'postgresql', 'html', 'css')
WHERE p.slug = 'portfolio-website';

-- ---------------------------------------------------------------------
-- Motion Graphics: no entries for now (the card shows "Nothing to show here")
-- ---------------------------------------------------------------------
DELETE FROM projects
WHERE category_id = (SELECT id FROM project_categories WHERE slug = 'motion-graphics');

-- ---------------------------------------------------------------------
-- Experience
-- ---------------------------------------------------------------------
UPDATE experiences
SET highlights = ARRAY[
      'Lead multimedia output for the institution',
      'Assist in public relations initiatives',
      'Coordinate coverage and documentation with the Bureau director',
      'Train student volunteers in design and media'
    ]
WHERE role ILIKE 'Support Staff%';

UPDATE experiences
SET organization = 'MegaCat Studios',
    location     = 'Pittsburgh, Pennsylvania (remote)',
    end_date     = '2025-12-31',
    highlights   = ARRAY[
      'Led the visual direction of a game development project across 2D, 3D, UI and special effects'
    ]
WHERE role = 'Visual Lead';

-- ---------------------------------------------------------------------
-- Education: your bachelor's degree (the row that isn't the master's)
-- ---------------------------------------------------------------------
UPDATE education
SET degree   = 'Bachelor of Science in Information Technology',
    school   = 'MSU General Santos',
    end_year = 2024,
    status   = 'completed',
    details  = 'Major in Database · Cum Laude · DOST Scholar'
WHERE degree NOT ILIKE 'Master%';

-- ---------------------------------------------------------------------
-- Contact links: GitHub and Facebook (LinkedIn and Behance removed)
-- ---------------------------------------------------------------------
DELETE FROM social_links WHERE platform IN ('linkedin', 'behance');

INSERT INTO social_links (platform, label, url, icon_key, sort_order) VALUES
  ('github',   'GitHub',   'https://github.com/zjfeldan',                'si:github',   10),
  ('facebook', 'Facebook', 'https://www.facebook.com/zachjacob.feldan',  'si:facebook', 20)
ON CONFLICT (platform) DO UPDATE SET
  label      = EXCLUDED.label,
  url        = EXCLUDED.url,
  icon_key   = EXCLUDED.icon_key,
  sort_order = EXCLUDED.sort_order,
  is_visible = true;

COMMIT;
