/*
# Add Branding & Appearance Columns to site_settings

Adds logo and visual customization fields to the single-row `site_settings` table
so the admin can control the site logo, brand colors, and fonts from the dashboard.

## New Columns on `site_settings`
- `logo_url` (text) — URL to a custom logo image. If empty, falls back to the icon-based logo.
- `logo_icon` (text, default 'Heart') — Lucide icon name used when no logo_url is set.
- `color_primary` (text, default '#f97316') — Primary brand color (orange).
- `color_accent` (text, default '#06b6d4') — Secondary accent color (cyan).
- `color_bg` (text, default '#0a0a0f') — Page background color.
- `font_heading` (text, default 'Space Grotesk') — Google Font for headings.
- `font_body` (text, default 'Inter') — Google Font for body text.

## Security
- No new tables. Existing `auth_update_site_settings` policy already covers UPDATE on this table.
- SELECT remains public (anon + authenticated).
*/

ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS logo_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS logo_icon text DEFAULT 'Heart',
  ADD COLUMN IF NOT EXISTS color_primary text DEFAULT '#f97316',
  ADD COLUMN IF NOT EXISTS color_accent text DEFAULT '#06b6d4',
  ADD COLUMN IF NOT EXISTS color_bg text DEFAULT '#0a0a0f',
  ADD COLUMN IF NOT EXISTS font_heading text DEFAULT 'Space Grotesk',
  ADD COLUMN IF NOT EXISTS font_body text DEFAULT 'Inter';
