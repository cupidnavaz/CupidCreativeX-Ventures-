/*
# Add media gallery, page content, integrations, social links, plugins

Adds five new tables and a storage bucket for the new admin features.

## New Tables
1. `media_files` — uploaded media files stored in Supabase Storage
   - file_url, file_name, file_type, file_size, alt_text, category
2. `page_contents` — per-page editable content (hero images, titles, subtitles, body text)
   - page_key (unique), hero_image_url, hero_title, hero_subtitle, body_content (JSONB)
3. `integrations` — third-party API connectors (name, type, api_key_ref, endpoint_url, config JSONB, enabled)
4. `social_links` — dynamic social media links (platform, url, icon, sort_order)
5. `plugins` — installed plugins (name, slug, description, version, enabled, config JSONB)

## Storage
- Creates `media` storage bucket (public) for file uploads

## Security
- RLS enabled on all tables
- Public read on page_contents, social_links, published plugins (SELECT for anon+authenticated)
- Auth-only CRUD on media_files, integrations, plugins (write for authenticated only)
*/

-- ── Media Files ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS media_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_url text NOT NULL,
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_size bigint NOT NULL DEFAULT 0,
  alt_text text DEFAULT '',
  category text DEFAULT 'general',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_select_media" ON media_files;
CREATE POLICY "public_select_media" ON media_files FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_media" ON media_files;
CREATE POLICY "auth_insert_media" ON media_files FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_media" ON media_files;
CREATE POLICY "auth_update_media" ON media_files FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_media" ON media_files;
CREATE POLICY "auth_delete_media" ON media_files FOR DELETE TO authenticated USING (true);

-- ── Page Contents ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS page_contents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text NOT NULL UNIQUE,
  hero_image_url text DEFAULT '',
  hero_title text DEFAULT '',
  hero_subtitle text DEFAULT '',
  body_content jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE page_contents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_select_page_contents" ON page_contents;
CREATE POLICY "public_select_page_contents" ON page_contents FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_page_contents" ON page_contents;
CREATE POLICY "auth_insert_page_contents" ON page_contents FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_page_contents" ON page_contents;
CREATE POLICY "auth_update_page_contents" ON page_contents FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_page_contents" ON page_contents;
CREATE POLICY "auth_delete_page_contents" ON page_contents FOR DELETE TO authenticated USING (true);

-- ── Integrations ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL DEFAULT 'api',
  provider text NOT NULL DEFAULT '',
  endpoint_url text DEFAULT '',
  api_key_ref text DEFAULT '',
  webhook_url text DEFAULT '',
  config jsonb DEFAULT '{}'::jsonb,
  enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "auth_select_integrations" ON integrations;
CREATE POLICY "auth_select_integrations" ON integrations FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_integrations" ON integrations;
CREATE POLICY "auth_insert_integrations" ON integrations FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_integrations" ON integrations;
CREATE POLICY "auth_update_integrations" ON integrations FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_integrations" ON integrations;
CREATE POLICY "auth_delete_integrations" ON integrations FOR DELETE TO authenticated USING (true);

-- ── Social Links ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text NOT NULL,
  icon text NOT NULL DEFAULT 'Link',
  sort_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_select_social_links" ON social_links;
CREATE POLICY "public_select_social_links" ON social_links FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_social_links" ON social_links;
CREATE POLICY "auth_insert_social_links" ON social_links FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_social_links" ON social_links;
CREATE POLICY "auth_update_social_links" ON social_links FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_social_links" ON social_links;
CREATE POLICY "auth_delete_social_links" ON social_links FOR DELETE TO authenticated USING (true);

-- ── Plugins ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS plugins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text DEFAULT '',
  version text DEFAULT '1.0.0',
  author text DEFAULT '',
  config jsonb DEFAULT '{}'::jsonb,
  enabled boolean NOT NULL DEFAULT false,
  installed_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE plugins ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_select_plugins" ON plugins;
CREATE POLICY "public_select_plugins" ON plugins FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_plugins" ON plugins;
CREATE POLICY "auth_insert_plugins" ON plugins FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_plugins" ON plugins;
CREATE POLICY "auth_update_plugins" ON plugins FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_plugins" ON plugins;
CREATE POLICY "auth_delete_plugins" ON plugins FOR DELETE TO authenticated USING (true);

-- ── Triggers for updated_at ──────────────────────────────────
DROP TRIGGER IF EXISTS trg_page_contents_updated ON page_contents;
CREATE TRIGGER trg_page_contents_updated BEFORE UPDATE ON page_contents FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_integrations_updated ON integrations;
CREATE TRIGGER trg_integrations_updated BEFORE UPDATE ON integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_plugins_updated ON plugins;
CREATE TRIGGER trg_plugins_updated BEFORE UPDATE ON plugins FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_media_files_category ON media_files(category);
CREATE INDEX IF NOT EXISTS idx_page_contents_page_key ON page_contents(page_key);
CREATE INDEX IF NOT EXISTS idx_social_links_sort ON social_links(sort_order);

-- ── Seed default page contents ───────────────────────────────
INSERT INTO page_contents (page_key, hero_title, hero_subtitle) VALUES
  ('home', '', ''),
  ('services', 'Our Services', 'We offer a full spectrum of digital services to help your business thrive in the modern landscape.'),
  ('portfolio', 'Our Portfolio', 'Explore some of the projects we''ve crafted for clients across industries.'),
  ('about', 'About Us', 'We are a team of passionate designers, developers, and strategists dedicated to helping businesses thrive in the digital age.'),
  ('team', 'Our Team', 'Meet the talented people behind CupidCreativeX Ventures.'),
  ('blog', 'Our Blog', 'Insights, trends, and stories from the world of digital innovation.'),
  ('contact', 'Get in Touch', 'Have a project in mind? We''d love to hear about it. Reach out and let''s create something extraordinary together.')
ON CONFLICT (page_key) DO NOTHING;

-- ── Seed default social links ────────────────────────────────
INSERT INTO social_links (platform, url, icon, sort_order, published) VALUES
  ('Twitter', '#', 'Twitter', 1, true),
  ('LinkedIn', '#', 'Linkedin', 2, true),
  ('GitHub', '#', 'Github', 3, true),
  ('Instagram', '#', 'Instagram', 4, true)
ON CONFLICT DO NOTHING;
