/*
# Add display image to services

1. Changes
- Adds `image_url` (text, nullable) to the `services` table so each service
  can optionally display a hero/cover image on the public site and admin list.
2. Security
- No new tables. Existing RLS policies on `services` already cover the new
  column (SELECT for anon+authenticated, INSERT/UPDATE/DELETE for
  authenticated), so no policy changes are needed.
3. Notes
- Nullable so existing services are unaffected; they simply show no image.
- The `media` storage bucket already permits authenticated uploads and public
  reads, so uploaded images are served via public URL stored in this column.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE services ADD COLUMN image_url text;
  END IF;
END
$$;
