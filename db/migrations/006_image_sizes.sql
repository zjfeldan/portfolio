-- =====================================================================
-- 006_image_sizes.sql
-- Stores each project image's width and height so the masonry gallery
-- can lay out cards before the images load (no jumping). The import
-- script fills these in for you. Run once in pgAdmin's Query Tool on
-- portfolio_db (F5). Safe to run again.
-- =====================================================================

BEGIN;

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS image_width  integer CHECK (image_width > 0),
  ADD COLUMN IF NOT EXISTS image_height integer CHECK (image_height > 0);

-- Same function as in schema.sql, now returning the image size too
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
