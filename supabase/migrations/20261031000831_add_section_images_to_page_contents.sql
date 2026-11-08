/*
# Add section images to page_contents

1. Modified Tables
- `page_contents` — added 4 new nullable text columns:
  - `section_services_image` — image URL for the services section (used on home + services pages)
  - `section_about_image` — image URL for the about section (used on home + about pages)
  - `section_contact_image` — image URL for the contact section (used on contact page)
  - `section_hero_image` — image URL for the home page hero banner (distinct from per-page hero_image_url which covers inner page heroes)

2. Security
- No policy changes. Existing RLS policies on `page_contents` already allow public read and auth write. No new grants needed.

3. Notes
- All columns are nullable text, defaulting to empty string, so existing rows and queries continue to work.
- The admin Pages editor will allow uploading images for each of these sections.
*/

ALTER TABLE page_contents
  ADD COLUMN IF NOT EXISTS section_services_image text DEFAULT '',
  ADD COLUMN IF NOT EXISTS section_about_image text DEFAULT '',
  ADD COLUMN IF NOT EXISTS section_contact_image text DEFAULT '',
  ADD COLUMN IF NOT EXISTS section_hero_image text DEFAULT '';
