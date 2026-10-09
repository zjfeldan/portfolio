-- =====================================================================
-- 004_update_skills.sql
-- Your updated skills list, with logos. Run once in pgAdmin's Query Tool
-- on portfolio_db (F5), then restart `npm run dev`. Safe to run again.
--
-- Levels: 1 Beginner, 3 Intermediate, 5 Professional (2 and 4 also exist:
-- Developing and Advanced).
-- Icons:  'si:...'   a brand logo (needs `npm install react-icons`)
--         'text:..'  a letter badge, for brands with no free logo
--         set icon_url to your own logo file to override either one.
-- Skills not in this list are hidden, not deleted, so projects that list
-- them as tools (e.g. AWS) keep showing them.
-- =====================================================================

BEGIN;

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
  ('postgresql',    'PostgreSQL',        'database', 3, 'si:postgresql',  120)
ON CONFLICT (slug) DO UPDATE SET
  name        = EXCLUDED.name,
  category    = EXCLUDED.category,
  proficiency = EXCLUDED.proficiency,
  icon_key    = EXCLUDED.icon_key,
  sort_order  = EXCLUDED.sort_order,
  is_visible  = true;

-- Hide everything else from the Skills row (still usable as project tools)
UPDATE skills
SET is_visible = false
WHERE slug NOT IN ('html', 'css', 'react', 'nextjs', 'photoshop', 'clip-studio', 'procreate', 'illustrator', 'inkscape', 'indesign', 'after-effects', 'postgresql');

COMMIT;
