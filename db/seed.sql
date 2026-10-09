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

INSERT INTO profile (full_name, display_name, headline, bio, location, email)
VALUES (
  'Zach Jacob T. Feldan',
  'Zach Jacob',
  'Multimedia | IT',
  'I handle multimedia for the Communications Bureau of UST General Santos and I''m a first-year MSIT student at Ateneo de Davao. I design, illustrate and animate, and I''m learning to build web-based apps.',
  'General Santos City, Philippines',
  'you@example.com'
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

-- The five cards in the portfolio stack
INSERT INTO project_categories (slug, name, icon_key, sort_order) VALUES
  ('graphic-design',       'Graphic Design',       'palette', 10),
  ('web-development',      'Web Development',      'code',    20),
  ('digital-illustration', 'Digital Illustration', 'pen',     30),
  ('motion-graphics',      'Motion Graphics',      'film',    40),
  ('digital-assets',       'Digital Assets',       'layers',  50);

-- Sample entries (Digital Assets is left empty to show the empty state)
INSERT INTO projects (category_id, slug, title, description, completed_on)
SELECT c.id, v.slug, v.title, v.description, v.completed_on::date
FROM (VALUES
  ('web-development', 'portfolio-website', 'This portfolio',
   'Next.js, Tailwind CSS and PostgreSQL, built and documented from scratch.', '2026-10-01'),
  ('web-development', 'davao-marketplace-pipeline', 'Davao Digital Marketplace data pipeline',
   'S3 ingestion into Aurora PostgreSQL, then DynamoDB and Glue, built for MSIT Data Management.', '2026-09-20'),
  ('web-development', 'undergrad-capstone', 'Undergraduate capstone',
   'Replace this with the problem it solved and your role.', '2024-05-01'),
  ('motion-graphics', 'paskuhan-opening-video', 'Paskuhan opening video',
   'Animated opening for UST General Santos'' Paskuhan celebration.', '2026-09-30'),
  ('graphic-design', 'event-pubmats', 'Event publication materials',
   'Replace this with what the series was for and what you made.', '2025-11-15'),
  ('digital-illustration', 'game-art', 'Game art direction',
   'Visual lead work for a US-based game studio.', '2024-08-01')
) AS v (category_slug, slug, title, description, completed_on)
JOIN project_categories c ON c.slug = v.category_slug;

-- Link projects to skills by slug
INSERT INTO project_skills (project_id, skill_id)
SELECT p.id, s.id
FROM (VALUES
  ('portfolio-website',          'nextjs'),
  ('portfolio-website',          'postgresql'),
  ('portfolio-website',          'tailwind'),
  ('davao-marketplace-pipeline', 'aws'),
  ('davao-marketplace-pipeline', 'postgresql'),
  ('undergrad-capstone',         'postgresql'),
  ('paskuhan-opening-video',     'after-effects'),
  ('paskuhan-opening-video',     'illustrator'),
  ('event-pubmats',              'photoshop'),
  ('event-pubmats',              'illustrator'),
  ('game-art',                   'photoshop'),
  ('game-art',                   'illustrator')
) AS link (project_slug, skill_slug)
JOIN projects p ON p.slug = link.project_slug
JOIN skills   s ON s.slug = link.skill_slug;

-- No certificates yet: the page shows a "on the way" card until you add rows.
-- Example for later:
-- INSERT INTO certificates (title, issuer, issued_on, image_url)
-- VALUES ('AWS Certified Cloud Practitioner', 'Amazon Web Services', '2027-03-15',
--         '/images/certificates/aws-cloud-practitioner.webp');

INSERT INTO experiences (role, organization, location, start_date, end_date, highlights, sort_order) VALUES
  ('Support Staff, Multimedia', 'Communications Bureau, UST General Santos', 'General Santos City',
   '2025-01-01', NULL,
   ARRAY[
     'Lead multimedia output for institution-wide events',
     'Coordinate coverage and documentation with the Bureau director',
     'Train student volunteers in design and media'
   ], 10),
  ('Visual Lead', 'Game development studio (US, remote)', NULL,
   '2024-01-01', '2024-12-31',
   ARRAY[
     'Led visual direction for game art',
     'Worked with a remote team across time zones'
   ], 20);

INSERT INTO education (degree, school, start_year, end_year, status, details, sort_order) VALUES
  ('Master of Science in Information Technology', 'Ateneo de Davao University',
   2026, NULL, 'in_progress', NULL, 10),
  ('Your bachelor''s degree', 'Your university',
   NULL, 2024, 'completed', 'Major in databases', 20);

INSERT INTO social_links (platform, label, url, icon_key, sort_order) VALUES
  ('github',   'GitHub',   'https://github.com/your-username',          'github',   10),
  ('linkedin', 'LinkedIn', 'https://www.linkedin.com/in/your-username', 'linkedin', 20),
  ('behance',  'Behance',  'https://www.behance.net/your-username',     'behance',  30);

COMMIT;

-- Check the result:
-- SELECT portfolio_payload();
