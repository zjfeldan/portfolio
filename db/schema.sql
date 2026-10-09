-- =====================================================================
-- Portfolio database schema (PostgreSQL 17+)
-- Run this once in pgAdmin's Query Tool, connected to portfolio_db.
-- It is safe to run again: it only creates what is missing and replaces
-- the functions.
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- Keep updated_at current on every UPDATE
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------
-- Profile: exactly one row (id is always 1)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profile (
  id            smallint    PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  full_name     text        NOT NULL,
  display_name  text        NOT NULL,
  headline      text        NOT NULL,
  bio           text        NOT NULL,
  portrait_url  text,
  location      text,
  email         text,
  resume_url    text,
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Skills (proficiency: 1 Beginner ... 5 Expert)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS skills (
  id           integer     GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug         text        NOT NULL UNIQUE,
  name         text        NOT NULL,
  category     text        NOT NULL
               CHECK (category IN ('database', 'web', 'cloud', 'design', 'motion', 'tool')),
  proficiency  smallint    NOT NULL CHECK (proficiency BETWEEN 1 AND 5),
  icon_key     text        NOT NULL DEFAULT 'sparkles',  -- key in lib/icons.ts
  icon_url     text,                                     -- your own SVG, overrides icon_key
  sort_order   integer     NOT NULL DEFAULT 0,
  is_visible   boolean     NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Project categories: one card each in the portfolio stack
-- ---------------------------------------------------------------------
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

-- ---------------------------------------------------------------------
-- Projects: the entries inside each category's gallery
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id            integer     GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  category_id   integer     NOT NULL REFERENCES project_categories (id) ON DELETE RESTRICT,
  slug          text        NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title         text        NOT NULL,
  description   text,
  image_url     text,                    -- e.g. /images/projects/graphic-design/poster.webp
  image_alt     text,                    -- describes the image for screen readers
  image_width   integer     CHECK (image_width > 0),   -- pixels; lets the gallery lay out
  image_height  integer     CHECK (image_height > 0),  -- cards before images load
  project_url   text,                    -- optional link, shown as "See more"
  completed_on  date        NOT NULL DEFAULT CURRENT_DATE,  -- used for Newest / Oldest
  is_published  boolean     NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Tools used on each project, taken from the skills table (many-to-many)
CREATE TABLE IF NOT EXISTS project_skills (
  project_id  integer NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
  skill_id    integer NOT NULL REFERENCES skills (id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, skill_id)
);

-- ---------------------------------------------------------------------
-- Certificates
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS certificates (
  id              integer     GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title           text        NOT NULL,
  issuer          text        NOT NULL,
  issued_on       date,
  credential_url  text,
  image_url       text,
  sort_order      integer     NOT NULL DEFAULT 0,
  is_visible      boolean     NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Work experience (end_date NULL = current role)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS experiences (
  id            integer     GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  role          text        NOT NULL,
  organization  text        NOT NULL,
  location      text,
  start_date    date        NOT NULL,
  end_date      date        CHECK (end_date IS NULL OR end_date >= start_date),
  summary       text,
  highlights    text[]      NOT NULL DEFAULT '{}',
  sort_order    integer     NOT NULL DEFAULT 0,
  is_visible    boolean     NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Education
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS education (
  id          integer     GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  degree      text        NOT NULL,
  school      text        NOT NULL,
  start_year  smallint,
  end_year    smallint    CHECK (end_year IS NULL OR start_year IS NULL OR end_year >= start_year),
  status      text        NOT NULL DEFAULT 'completed'
              CHECK (status IN ('in_progress', 'completed')),
  details     text,
  sort_order  integer     NOT NULL DEFAULT 0,
  is_visible  boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Social and contact links
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS social_links (
  id          integer     GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  platform    text        NOT NULL UNIQUE,
  label       text        NOT NULL,
  url         text        NOT NULL,
  icon_key    text        NOT NULL DEFAULT 'globe',
  sort_order  integer     NOT NULL DEFAULT 0,
  is_visible  boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- Indexes
-- Partial indexes cover only the rows the site shows, in display order.
-- With a handful of rows PostgreSQL may still scan the table (that is
-- faster at small sizes); these pay off as the tables grow.
-- ---------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS project_categories_visible_order_idx
  ON project_categories (sort_order, id) WHERE is_visible;
CREATE INDEX IF NOT EXISTS projects_category_date_idx
  ON projects (category_id, completed_on DESC, id DESC) WHERE is_published;
CREATE INDEX IF NOT EXISTS project_skills_skill_idx
  ON project_skills (skill_id);
CREATE INDEX IF NOT EXISTS skills_visible_order_idx
  ON skills (sort_order, id) WHERE is_visible;
CREATE INDEX IF NOT EXISTS certificates_visible_order_idx
  ON certificates (sort_order, issued_on DESC) WHERE is_visible;
CREATE INDEX IF NOT EXISTS experiences_visible_order_idx
  ON experiences (sort_order, start_date DESC) WHERE is_visible;
CREATE INDEX IF NOT EXISTS education_visible_order_idx
  ON education (sort_order, id) WHERE is_visible;
CREATE INDEX IF NOT EXISTS social_links_visible_order_idx
  ON social_links (sort_order, id) WHERE is_visible;

-- ---------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------
CREATE OR REPLACE TRIGGER profile_set_updated_at
  BEFORE UPDATE ON profile FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE OR REPLACE TRIGGER skills_set_updated_at
  BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE OR REPLACE TRIGGER project_categories_set_updated_at
  BEFORE UPDATE ON project_categories FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE OR REPLACE TRIGGER projects_set_updated_at
  BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE OR REPLACE TRIGGER certificates_set_updated_at
  BEFORE UPDATE ON certificates FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE OR REPLACE TRIGGER experiences_set_updated_at
  BEFORE UPDATE ON experiences FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE OR REPLACE TRIGGER education_set_updated_at
  BEFORE UPDATE ON education FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE OR REPLACE TRIGGER social_links_set_updated_at
  BEFORE UPDATE ON social_links FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------
-- portfolio_payload(): everything the home page needs, as one JSON object.
-- One query instead of seven keeps page loads fast.
-- Keys are camelCase to match lib/types.ts.
-- ---------------------------------------------------------------------
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
              'imageWidth', pr.image_width,
              'imageHeight', pr.image_height,
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
