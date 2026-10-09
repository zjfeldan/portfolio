-- =====================================================================
-- 003_project_categories.sql
-- Turns the portfolio into five categories (the stack cards), each with
-- its own gallery of entries. Run once in pgAdmin's Query Tool on
-- portfolio_db (F5). Safe to run again.
--
-- What it does to your existing projects (nothing is lost):
--   cover_url -> image_url, cover_alt -> image_alt
--   summary   -> copied into description when description is empty
--   year      -> completed_on (1 January of that year)
--   repo_url  -> copied into project_url when project_url is empty
--   project_type / it-creative -> a category
-- then removes the columns the new design no longer uses.
-- (Fresh installs don't need this: schema.sql already has the new shape.)
-- =====================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS project_categories (
  id          integer     GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug        text        NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name        text        NOT NULL,                  -- label shown on hover
  icon_key    text        NOT NULL DEFAULT 'grid',   -- placeholder icon (lib/icons.ts)
  cover_url   text,                                  -- image on the stack card
  sort_order  integer     NOT NULL DEFAULT 0,
  is_visible  boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

INSERT INTO project_categories (slug, name, icon_key, sort_order) VALUES
  ('graphic-design',       'Graphic Design',       'palette', 10),
  ('web-development',      'Web Development',      'code',    20),
  ('digital-illustration', 'Digital Illustration', 'pen',     30),
  ('motion-graphics',      'Motion Graphics',      'film',    40),
  ('digital-assets',       'Digital Assets',       'layers',  50)
ON CONFLICT (slug) DO NOTHING;

CREATE INDEX IF NOT EXISTS project_categories_visible_order_idx
  ON project_categories (sort_order, id) WHERE is_visible;
CREATE OR REPLACE TRIGGER project_categories_set_updated_at
  BEFORE UPDATE ON project_categories FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS category_id  integer REFERENCES project_categories (id) ON DELETE RESTRICT,
  ADD COLUMN IF NOT EXISTS completed_on date NOT NULL DEFAULT CURRENT_DATE;

-- Carry old values over. Each step runs only if the old column still exists.
DO $$
DECLARE
  has_col boolean;
BEGIN
  SELECT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_schema = current_schema() AND table_name = 'projects'
                   AND column_name = 'cover_url') INTO has_col;
  IF has_col THEN ALTER TABLE projects RENAME COLUMN cover_url TO image_url; END IF;

  SELECT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_schema = current_schema() AND table_name = 'projects'
                   AND column_name = 'cover_alt') INTO has_col;
  IF has_col THEN ALTER TABLE projects RENAME COLUMN cover_alt TO image_alt; END IF;

  SELECT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_schema = current_schema() AND table_name = 'projects'
                   AND column_name = 'summary') INTO has_col;
  IF has_col THEN
    UPDATE projects SET description = COALESCE(description, summary);
  END IF;

  SELECT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_schema = current_schema() AND table_name = 'projects'
                   AND column_name = 'year') INTO has_col;
  IF has_col THEN
    UPDATE projects SET completed_on = make_date(year, 1, 1) WHERE year IS NOT NULL;
  END IF;

  SELECT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_schema = current_schema() AND table_name = 'projects'
                   AND column_name = 'repo_url') INTO has_col;
  IF has_col THEN
    UPDATE projects SET project_url = COALESCE(project_url, repo_url);
  END IF;

  SELECT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_schema = current_schema() AND table_name = 'projects'
                   AND column_name = 'project_type') INTO has_col;
  IF has_col THEN
    UPDATE projects p SET category_id = c.id
    FROM project_categories c
    WHERE p.category_id IS NULL AND lower(p.project_type) = lower(c.name);
  END IF;

  SELECT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_schema = current_schema() AND table_name = 'projects'
                   AND column_name = 'category') INTO has_col;
  IF has_col THEN
    UPDATE projects p SET category_id = c.id
    FROM project_categories c
    WHERE p.category_id IS NULL
      AND c.slug = CASE p.category WHEN 'it' THEN 'web-development' ELSE 'graphic-design' END;
  END IF;
END $$;

-- Anything still without a category lands in Graphic Design (move it later if needed)
UPDATE projects
SET category_id = (SELECT id FROM project_categories WHERE slug = 'graphic-design')
WHERE category_id IS NULL;

ALTER TABLE projects ALTER COLUMN category_id SET NOT NULL;

-- Columns the new design doesn't use (their old index goes with them)
ALTER TABLE projects
  DROP COLUMN IF EXISTS summary,
  DROP COLUMN IF EXISTS category,
  DROP COLUMN IF EXISTS project_type,
  DROP COLUMN IF EXISTS year,
  DROP COLUMN IF EXISTS repo_url,
  DROP COLUMN IF EXISTS is_featured,
  DROP COLUMN IF EXISTS sort_order;

CREATE INDEX IF NOT EXISTS projects_category_date_idx
  ON projects (category_id, completed_on DESC, id DESC) WHERE is_published;

-- Same function as in schema.sql, now grouped by category
CREATE OR REPLACE FUNCTION portfolio_payload() RETURNS json
LANGUAGE sql STABLE AS $$
SELECT json_build_object(
  'profile', (
    SELECT json_build_object(
      'fullName', p.full_name,
      'displayName', p.display_name,
      'headline', p.headline,
      'bio', p.bio,
      'portraitUrl', p.portrait_url,
      'location', p.location,
      'email', p.email,
      'resumeUrl', p.resume_url
    )
    FROM profile p
    WHERE p.id = 1
  ),

  -- Each category with its projects (newest first) and each project's tools
  'categories', COALESCE((
    SELECT json_agg(
      json_build_object(
        'id', c.id,
        'slug', c.slug,
        'name', c.name,
        'iconKey', c.icon_key,
        'coverUrl', c.cover_url,
        'projects', COALESCE((
          SELECT json_agg(
            json_build_object(
              'id', pr.id,
              'slug', pr.slug,
              'title', pr.title,
              'description', pr.description,
              'imageUrl', pr.image_url,
              'imageAlt', pr.image_alt,
              'projectUrl', pr.project_url,
              'completedOn', pr.completed_on,
              'tools', COALESCE((
                SELECT json_agg(
                  json_build_object('name', s.name, 'iconKey', s.icon_key, 'iconUrl', s.icon_url)
                  ORDER BY s.sort_order, s.name
                )
                FROM project_skills ps
                JOIN skills s ON s.id = ps.skill_id
                WHERE ps.project_id = pr.id
              ), '[]'::json)
            )
            ORDER BY pr.completed_on DESC, pr.id DESC
          )
          FROM projects pr
          WHERE pr.category_id = c.id AND pr.is_published
        ), '[]'::json)
      )
      ORDER BY c.sort_order, c.id
    )
    FROM project_categories c
    WHERE c.is_visible
  ), '[]'::json),

  'skills', COALESCE((
    SELECT json_agg(
      json_build_object(
        'id', s.id,
        'slug', s.slug,
        'name', s.name,
        'category', s.category,
        'proficiency', s.proficiency,
        'iconKey', s.icon_key,
        'iconUrl', s.icon_url
      )
      ORDER BY s.sort_order, s.id
    )
    FROM skills s
    WHERE s.is_visible
  ), '[]'::json),

  'certificates', COALESCE((
    SELECT json_agg(
      json_build_object(
        'id', c.id,
        'title', c.title,
        'issuer', c.issuer,
        'issuedOn', to_char(c.issued_on, 'YYYY-MM-DD'),
        'credentialUrl', c.credential_url,
        'imageUrl', c.image_url
      )
      ORDER BY c.sort_order, c.issued_on DESC NULLS LAST
    )
    FROM certificates c
    WHERE c.is_visible
  ), '[]'::json),

  'experiences', COALESCE((
    SELECT json_agg(
      json_build_object(
        'id', e.id,
        'role', e.role,
        'organization', e.organization,
        'location', e.location,
        'startDate', to_char(e.start_date, 'YYYY-MM-DD'),
        'endDate', to_char(e.end_date, 'YYYY-MM-DD'),
        'summary', e.summary,
        'highlights', to_json(e.highlights)
      )
      ORDER BY e.sort_order, e.start_date DESC
    )
    FROM experiences e
    WHERE e.is_visible
  ), '[]'::json),

  'education', COALESCE((
    SELECT json_agg(
      json_build_object(
        'id', ed.id,
        'degree', ed.degree,
        'school', ed.school,
        'startYear', ed.start_year,
        'endYear', ed.end_year,
        'status', ed.status,
        'details', ed.details
      )
      ORDER BY ed.sort_order, ed.id
    )
    FROM education ed
    WHERE ed.is_visible
  ), '[]'::json),

  'socials', COALESCE((
    SELECT json_agg(
      json_build_object(
        'id', sl.id,
        'platform', sl.platform,
        'label', sl.label,
        'url', sl.url,
        'iconKey', sl.icon_key
      )
      ORDER BY sl.sort_order, sl.id
    )
    FROM social_links sl
    WHERE sl.is_visible
  ), '[]'::json)
);
$$;

COMMIT;
