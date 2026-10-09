-- =====================================================================
-- 002_project_details.sql
-- Adds a type, a year and a longer description to projects, for the
-- project modal. Run once in pgAdmin's Query Tool on portfolio_db (F5).
-- Safe to run again; it never deletes or overwrites your content.
-- (Fresh installs don't need this: schema.sql already includes it.)
-- =====================================================================

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS description  text,
  ADD COLUMN IF NOT EXISTS project_type text,
  ADD COLUMN IF NOT EXISTS year         smallint CHECK (year BETWEEN 1990 AND 2100);

-- Same function as in schema.sql, now returning the three new fields
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

  'projects', COALESCE((
    SELECT json_agg(
      json_build_object(
        'id', pr.id,
        'slug', pr.slug,
        'title', pr.title,
        'summary', pr.summary,
        'description', pr.description,
        'category', pr.category,
        'projectType', pr.project_type,
        'year', pr.year,
        'coverUrl', pr.cover_url,
        'coverAlt', pr.cover_alt,
        'projectUrl', pr.project_url,
        'repoUrl', pr.repo_url,
        'isFeatured', pr.is_featured,
        'skills', COALESCE((
          SELECT json_agg(s.name ORDER BY s.sort_order, s.name)
          FROM project_skills ps
          JOIN skills s ON s.id = ps.skill_id
          WHERE ps.project_id = pr.id
        ), '[]'::json)
      )
      ORDER BY pr.is_featured DESC, pr.sort_order, pr.id
    )
    FROM projects pr
    WHERE pr.is_published
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

-- Starter types and years for the sample projects. Only fills empty
-- values, so anything you have already typed in is kept.
UPDATE projects AS p
SET project_type = COALESCE(p.project_type, v.project_type),
    year         = COALESCE(p.year, v.year)
FROM (VALUES
  ('portfolio-website',          'Web Development',      2026),
  ('davao-marketplace-pipeline', 'Data Engineering',     2026),
  ('undergrad-capstone',         'Software Development', 2024),
  ('paskuhan-opening-video',     'Motion Graphics',      2026),
  ('event-coverage',             'Photo & Video',        2025),
  ('game-art',                   'Game Art',             2024)
) AS v (slug, project_type, year)
WHERE p.slug = v.slug;
