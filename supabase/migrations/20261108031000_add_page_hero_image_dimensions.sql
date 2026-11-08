ALTER TABLE page_contents
  ADD COLUMN IF NOT EXISTS hero_image_width integer NOT NULL DEFAULT 560
    CHECK (hero_image_width BETWEEN 240 AND 1600),
  ADD COLUMN IF NOT EXISTS hero_image_height integer NOT NULL DEFAULT 420
    CHECK (hero_image_height BETWEEN 180 AND 1200);
