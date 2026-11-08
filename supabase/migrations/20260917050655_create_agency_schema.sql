/*
# CupidCreativeX Ventures — Agency Website Schema

Creates the full content-management schema for a digital/IT agency website
with an admin dashboard. The public site reads content; authenticated admins
have full CRUD over every content table.

## New Tables
- `services` — service offerings (title, slug, description, icon, features, sort_order, published)
- `projects` — portfolio/case studies (title, slug, client, category, description, image_url, project_url, sort_order, published)
- `team_members` — staff (name, role, bio, photo_url, twitter, linkedin, github, sort_order, published)
- `testimonials` — client reviews (client_name, company, quote, rating, avatar_url, sort_order, published)
- `blog_posts` — blog articles (title, slug, excerpt, content, cover_image_url, author, published, published_at)
- `contact_messages` — contact form submissions (name, email, subject, message, is_read, created_at)
- `site_settings` — single-row site-wide config (brand_name, hero_title, hero_subtitle, about_text, contact_email, phone, address, social links, stats)

## Security
- RLS enabled on every table.
- Public content tables: SELECT for anon+authenticated (public website reads them).
- Admin tables: INSERT/UPDATE/DELETE for authenticated only.
- Contact messages: INSERT for anon+authenticated (public form), SELECT/UPDATE/DELETE for authenticated only.
- Site settings: SELECT for anon+authenticated, UPDATE for authenticated only.
*/

-- ── Services ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'Code',
  features text[] NOT NULL DEFAULT '{}',
  sort_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_select_services" ON services;
CREATE POLICY "public_select_services" ON services FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_services" ON services;
CREATE POLICY "auth_insert_services" ON services FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_services" ON services;
CREATE POLICY "auth_update_services" ON services FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_services" ON services;
CREATE POLICY "auth_delete_services" ON services FOR DELETE TO authenticated USING (true);

-- ── Projects ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  client text,
  category text NOT NULL DEFAULT 'Web Development',
  description text NOT NULL,
  image_url text,
  project_url text,
  sort_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_select_projects" ON projects;
CREATE POLICY "public_select_projects" ON projects FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_projects" ON projects;
CREATE POLICY "auth_insert_projects" ON projects FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_projects" ON projects;
CREATE POLICY "auth_update_projects" ON projects FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_projects" ON projects;
CREATE POLICY "auth_delete_projects" ON projects FOR DELETE TO authenticated USING (true);

-- ── Team Members ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  bio text,
  photo_url text,
  twitter text,
  linkedin text,
  github text,
  sort_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_select_team_members" ON team_members;
CREATE POLICY "public_select_team_members" ON team_members FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_team_members" ON team_members;
CREATE POLICY "auth_insert_team_members" ON team_members FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_team_members" ON team_members;
CREATE POLICY "auth_update_team_members" ON team_members FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_team_members" ON team_members;
CREATE POLICY "auth_delete_team_members" ON team_members FOR DELETE TO authenticated USING (true);

-- ── Testimonials ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  company text,
  quote text NOT NULL,
  rating int NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  avatar_url text,
  sort_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_select_testimonials" ON testimonials;
CREATE POLICY "public_select_testimonials" ON testimonials FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_testimonials" ON testimonials;
CREATE POLICY "auth_insert_testimonials" ON testimonials FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_testimonials" ON testimonials;
CREATE POLICY "auth_update_testimonials" ON testimonials FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_testimonials" ON testimonials;
CREATE POLICY "auth_delete_testimonials" ON testimonials FOR DELETE TO authenticated USING (true);

-- ── Blog Posts ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text NOT NULL,
  content text NOT NULL,
  cover_image_url text,
  author text NOT NULL DEFAULT 'CupidCreativeX Team',
  published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_select_blog_posts" ON blog_posts;
CREATE POLICY "public_select_blog_posts" ON blog_posts FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_blog_posts" ON blog_posts;
CREATE POLICY "auth_insert_blog_posts" ON blog_posts FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_blog_posts" ON blog_posts;
CREATE POLICY "auth_update_blog_posts" ON blog_posts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_blog_posts" ON blog_posts;
CREATE POLICY "auth_delete_blog_posts" ON blog_posts FOR DELETE TO authenticated USING (true);

-- ── Contact Messages ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_insert_contact_messages" ON contact_messages;
CREATE POLICY "public_insert_contact_messages" ON contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_select_contact_messages" ON contact_messages;
CREATE POLICY "auth_select_contact_messages" ON contact_messages FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_update_contact_messages" ON contact_messages;
CREATE POLICY "auth_update_contact_messages" ON contact_messages FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_contact_messages" ON contact_messages;
CREATE POLICY "auth_delete_contact_messages" ON contact_messages FOR DELETE TO authenticated USING (true);

-- ── Site Settings (single-row) ────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  brand_name text NOT NULL DEFAULT 'CupidCreativeX Ventures',
  hero_title text NOT NULL DEFAULT 'We Build Digital Experiences That Matter',
  hero_subtitle text NOT NULL DEFAULT 'A full-service digital agency crafting websites, brands, and software that drive growth.',
  about_title text NOT NULL DEFAULT 'About CupidCreativeX Ventures',
  about_text text NOT NULL DEFAULT 'We are a team of passionate designers, developers, and strategists dedicated to helping businesses thrive in the digital age.',
  about_mission text NOT NULL DEFAULT 'Our mission is to transform ideas into impactful digital solutions that elevate brands and connect them with their audiences.',
  contact_email text NOT NULL DEFAULT 'hello@cupidcreativex.com',
  contact_phone text NOT NULL DEFAULT '+1 (555) 123-4567',
  contact_address text NOT NULL DEFAULT '123 Innovation Drive, Tech City, TC 12345',
  twitter_url text DEFAULT '',
  linkedin_url text DEFAULT '',
  github_url text DEFAULT '',
  instagram_url text DEFAULT '',
  stat_projects int NOT NULL DEFAULT 250,
  stat_clients int NOT NULL DEFAULT 180,
  stat_team int NOT NULL DEFAULT 45,
  stat_years int NOT NULL DEFAULT 12,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
-- Insert default row
INSERT INTO site_settings (id) VALUES (1) ON CONFLICT DO NOTHING;
DROP POLICY IF EXISTS "public_select_site_settings" ON site_settings;
CREATE POLICY "public_select_site_settings" ON site_settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_update_site_settings" ON site_settings;
CREATE POLICY "auth_update_site_settings" ON site_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- ── Indexes ───────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_services_sort ON services(sort_order);
CREATE INDEX IF NOT EXISTS idx_projects_sort ON projects(sort_order);
CREATE INDEX IF NOT EXISTS idx_team_members_sort ON team_members(sort_order);
CREATE INDEX IF NOT EXISTS idx_testimonials_sort ON testimonials(sort_order);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published, published_at);
CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON contact_messages(is_read, created_at);

-- ── updated_at triggers ───────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_services_updated ON services;
CREATE TRIGGER trg_services_updated BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_projects_updated ON projects;
CREATE TRIGGER trg_projects_updated BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_team_members_updated ON team_members;
CREATE TRIGGER trg_team_members_updated BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_testimonials_updated ON testimonials;
CREATE TRIGGER trg_testimonials_updated BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_blog_posts_updated ON blog_posts;
CREATE TRIGGER trg_blog_posts_updated BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_site_settings_updated ON site_settings;
CREATE TRIGGER trg_site_settings_updated BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
