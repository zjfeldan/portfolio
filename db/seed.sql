-- =====================================================================
-- Starter content. Run AFTER schema.sql, in pgAdmin's Query Tool on
-- portfolio_db. Running it again WIPES these tables and re-inserts the
-- sample rows, so edit your real content in the tables afterwards
-- (or edit this file and re-run it).
-- Everything here is placeholder text for you to replace.
-- =====================================================================

BEGIN;

TRUNCATE profile, project_skills, projects, project_categories, skills, certificates,
         experiences, education, social_links
  RESTART IDENTITY CASCADE;

INSERT INTO profile (full_name, display_name, headline, bio, location, email, resume_url)
VALUES (
  'Zach Jacob T. Feldan',
  'Zach Jacob',
  'Multimedia | IT',
  'I handle multimedia for the Communications Bureau of UST General Santos and I''m a first-year MSIT student at Ateneo de Davao. I design, illustrate and animate, and I''m learning to build web-based apps.',
  'General Santos City, Philippines',
  'zachjacobtfeldan@gmail.com',
  '/files/Zach-Jacob-Feldan-CV.pdf'
);

-- proficiency: 1 Beginner, 2 Developing, 3 Intermediate, 4 Advanced, 5 Professional
INSERT INTO skills (slug, name, category, proficiency, icon_key, sort_order) VALUES
  ('html',          'HTML',              'web',      3, 'si:html5',        10),
  ('css',           'CSS',               'web',      3, 'si:css',          20),
  ('react',         'React',             'web',      1, 'si:react',        30),
  ('nextjs',        'Next.js',           'web',      1, 'si:nextjs',       40),
  ('photoshop',     'Photoshop',         'design',   5, 'text:Ps',         50),
  ('clip-studio',   'Clip Studio',       'design',   5, 'text:CSP',        60),
  ('procreate',     'Procreate',         'design',   5, 'text:Pc',         70),
  ('illustrator',   'Illustrator',       'design',   5, 'text:Ai',         80),
  ('inkscape',      'Inkscape',          'design',   5, 'si:inkscape',     90),
  ('indesign',      'InDesign',          'design',   3, 'text:Id',        100),
  ('after-effects', 'After Effects',     'motion',   1, 'text:Ae',        110),
  ('postgresql',    'PostgreSQL',        'database', 3, 'si:postgresql',  120);

-- Tools that appear on projects but not in the Skills row
INSERT INTO skills (slug, name, category, proficiency, icon_key, sort_order, is_visible) VALUES
  ('tailwind', 'Tailwind CSS', 'web',   1, 'code',  200, false),
  ('aws',      'AWS',          'cloud', 1, 'cloud', 210, false);

-- The cards in the portfolio stack
INSERT INTO project_categories (slug, name, icon_key, sort_order) VALUES
  ('digital-art-graphic-design', 'Digital Art and Graphic Design', 'palette', 10),
  ('web-development',            'Web Development',                'code',    20),
  ('motion-graphics',            'Motion Graphics',                'film',    30);

-- Web Development: this portfolio. Digital art comes from
-- scripts/import-art.mjs (db/imports/digital-art.sql); Motion Graphics is empty.
INSERT INTO projects (category_id, slug, title, description, image_url, image_alt, project_url, completed_on)
SELECT c.id, 'portfolio-website', 'This Portfolio',
       'My personal portfolio, designed and built from scratch. The front end uses Next.js and Tailwind CSS, and every project, skill and credential is stored in a PostgreSQL database and loaded in a single query. It includes a category stack, a Pinterest-style gallery with sorting, an image viewer that adapts to portrait and landscape work, and a script that converts and imports artwork automatically.',
       '/images/projects/web-development/portfolio-website.png',
       'Home page of my portfolio website',
       'https://github.com/zjfeldan',
       '2026-10-09'
FROM project_categories c WHERE c.slug = 'web-development';

INSERT INTO project_skills (project_id, skill_id)
SELECT p.id, s.id
FROM projects p
JOIN skills s ON s.slug IN ('nextjs', 'react', 'tailwind', 'postgresql', 'html', 'css')
WHERE p.slug = 'portfolio-website';

-- No certificates yet: the page shows a "on the way" card until you add rows.
-- Example for later:
-- INSERT INTO certificates (title, issuer, issued_on, image_url)
-- VALUES ('AWS Certified Cloud Practitioner', 'Amazon Web Services', '2027-03-15',
--         '/images/certificates/aws-cloud-practitioner.webp');

INSERT INTO experiences (role, organization, location, start_date, end_date, highlights, sort_order) VALUES
  ('Support Staff, Multimedia', 'Communications Bureau, UST General Santos', 'General Santos City',
   '2025-01-01', NULL,
   ARRAY[
     'Lead multimedia output for the institution',
     'Assist in public relations initiatives',
     'Coordinate coverage and documentation with the Bureau director',
     'Train student volunteers in design and media'
   ], 10),
  ('Visual Lead', 'MegaCat Studios', 'Pittsburgh, Pennsylvania (remote)',
   '2024-01-01', '2025-12-31',
   ARRAY[
     'Led the visual direction of a game development project across 2D, 3D, UI and special effects'
   ], 20);

INSERT INTO education (degree, school, start_year, end_year, status, details, sort_order) VALUES
  ('Master of Science in Information Technology', 'Ateneo de Davao University',
   2026, NULL, 'in_progress', NULL, 10),
  ('Bachelor of Science in Information Technology', 'MSU General Santos',
   NULL, 2024, 'completed', 'Major in Database · Cum Laude · DOST Scholar', 20);

INSERT INTO social_links (platform, label, url, icon_key, sort_order) VALUES
  ('github',   'GitHub',   'https://github.com/zjfeldan',               'si:github',   10),
  ('facebook', 'Facebook', 'https://www.facebook.com/zachjacob.feldan', 'si:facebook', 20);

COMMIT;

-- Check the result:
-- SELECT portfolio_payload();
