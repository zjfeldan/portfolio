-- =====================================================================
-- Starter content. Run AFTER schema.sql, in pgAdmin's Query Tool on
-- portfolio_db. Running it again WIPES these tables and re-inserts the
-- sample rows, so edit your real content in the tables afterwards
-- (or edit this file and re-run it).
-- Everything here is placeholder text for you to replace.
-- =====================================================================

BEGIN;

TRUNCATE profile, project_skills, projects, skills, certificates,
         experiences, education, social_links
  RESTART IDENTITY CASCADE;

INSERT INTO profile (full_name, display_name, headline, bio, location, email)
VALUES (
  'Zach Jacob T. Feldan',
  'Zach Jacob',
  'Multimedia professional moving into IT',
  'I lead multimedia for institution-wide events at the Communications Bureau of UST General Santos, and I''m a first-year MSIT student at Ateneo de Davao. I design, illustrate and animate, and I''m now building database-backed web apps with PostgreSQL and the PERN stack.',
  'General Santos City, Philippines',
  'you@example.com'
);

-- proficiency: 1 Beginner, 2 Developing, 3 Intermediate, 4 Advanced, 5 Expert
INSERT INTO skills (slug, name, category, proficiency, icon_key, sort_order) VALUES
  ('postgresql',    'PostgreSQL',    'database', 3, 'database', 10),
  ('mysql',         'MySQL',         'database', 3, 'database', 20),
  ('react',         'React',         'web',      2, 'code',     30),
  ('nodejs',        'Node.js',       'web',      2, 'server',   40),
  ('nextjs',        'Next.js',       'web',      1, 'layers',   50),
  ('tailwind',      'Tailwind CSS',  'web',      1, 'code',     60),
  ('aws',           'AWS',           'cloud',    1, 'cloud',    70),
  ('photoshop',     'Photoshop',     'design',   4, 'image',    80),
  ('illustrator',   'Illustrator',   'design',   4, 'pen',      90),
  ('indesign',      'InDesign',      'design',   4, 'layers',  100),
  ('after-effects', 'After Effects', 'motion',   2, 'film',    110);

INSERT INTO projects (slug, title, summary, category, is_featured, sort_order) VALUES
  ('portfolio-website', 'This portfolio',
   'Next.js, Tailwind CSS and PostgreSQL, built and documented from scratch.',
   'it', true, 10),
  ('davao-marketplace-pipeline', 'Davao Digital Marketplace data pipeline',
   'S3 ingestion into Aurora PostgreSQL, then DynamoDB and Glue, built for MSIT Data Management.',
   'it', true, 20),
  ('undergrad-capstone', 'Undergraduate capstone',
   'A PostgreSQL-backed system. Replace this with the problem it solved and your role.',
   'it', false, 30),
  ('paskuhan-opening-video', 'Paskuhan opening video',
   'Animated opening for UST General Santos'' Paskuhan celebration.',
   'creative', false, 40),
  ('event-coverage', 'Institution-wide event coverage',
   'Photo and video documentation for the Communications Bureau.',
   'creative', false, 50),
  ('game-art', 'Game art direction',
   'Visual lead work for a US-based game studio.',
   'creative', false, 60);

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
  ('event-coverage',             'photoshop'),
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
