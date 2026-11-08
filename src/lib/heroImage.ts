import type { CSSProperties } from 'react';

export type HeroImageFit = 'cover' | 'contain' | 'fill';
export type HeroImageOverlay = 'none' | 'gradient' | 'solid';

export const HERO_IMAGE_FITS: { value: HeroImageFit; label: string }[] = [
  { value: 'cover', label: 'Cover container' },
  { value: 'contain', label: 'Fit image (contain)' },
  { value: 'fill', label: 'Stretch to fill' },
];

export const HERO_IMAGE_OVERLAYS: { value: HeroImageOverlay; label: string }[] = [
  { value: 'none', label: 'No overlay' },
  { value: 'gradient', label: 'Edge gradient' },
  { value: 'solid', label: 'Solid color' },
];

export function isHeroImageFit(value: string): value is HeroImageFit {
  return value === 'cover' || value === 'contain' || value === 'fill';
}

export function isHeroImageOverlay(value: string): value is HeroImageOverlay {
  return value === 'none' || value === 'gradient' || value === 'solid';
}

export function normalizeHeroImageColor(color: string | null | undefined): string {
  return color && /^#[\da-f]{6}$/i.test(color) ? color : '#0a0a0f';
}

export function getHeroImageOverlayStyle(
  overlay: HeroImageOverlay,
  color: string,
  opacity: number,
): CSSProperties | undefined {
  if (overlay === 'none') return undefined;

  const normalizedColor = normalizeHeroImageColor(color);
  const channels = normalizedColor.slice(1).match(/.{2}/g);
  if (!channels) return undefined;

  const [red, green, blue] = channels.map((channel) => Number.parseInt(channel, 16));
  const alpha = Math.min(80, Math.max(0, opacity)) / 100;
  const rgba = (opacityValue: number) => `rgba(${red}, ${green}, ${blue}, ${opacityValue})`;

  return {
    background:
      overlay === 'solid'
        ? rgba(alpha)
        : `linear-gradient(135deg, ${rgba(alpha * 0.65)}, transparent 55%, ${rgba(alpha)})`,
  };
}
