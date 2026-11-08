ALTER TABLE page_contents
  ADD COLUMN IF NOT EXISTS hero_image_fit text NOT NULL DEFAULT 'cover'
    CHECK (hero_image_fit IN ('cover', 'contain', 'fill')),
  ADD COLUMN IF NOT EXISTS hero_image_overlay text NOT NULL DEFAULT 'gradient'
    CHECK (hero_image_overlay IN ('none', 'gradient', 'solid')),
  ADD COLUMN IF NOT EXISTS hero_image_overlay_color text NOT NULL DEFAULT '#0a0a0f'
    CHECK (hero_image_overlay_color ~ '^#[0-9A-Fa-f]{6}$'),
  ADD COLUMN IF NOT EXISTS hero_image_overlay_opacity integer NOT NULL DEFAULT 35
    CHECK (hero_image_overlay_opacity BETWEEN 0 AND 80);
