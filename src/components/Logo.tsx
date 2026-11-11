import * as Icons from 'lucide-react';
import { useTheme } from '@/lib/theme';

export function Logo({ size = 'md', showText = true }: { size?: 'sm' | 'md' | 'lg'; showText?: boolean }) {
  const { settings } = useTheme();

  const sizes = {
    sm: { box: 'w-8 h-8', icon: 'w-4 h-4', text: 'text-sm' },
    md: { box: 'w-9 h-9', icon: 'w-5 h-5', text: 'text-lg' },
    lg: { box: 'w-12 h-12', icon: 'w-6 h-6', text: 'text-xl' },
  };
  const s = sizes[size];

  const brandName = settings?.brand_name || 'CupidCreativeX';
  const logoUrl = settings?.logo_url || '';
  const logoIcon = settings?.logo_icon || 'Heart';
  const primary = settings?.color_primary || '#f97316';
  const accent = settings?.color_accent || '#06b6d4';
  const headingFont = settings?.font_heading || 'Space Grotesk';

  const IconComp = (Icons as unknown as Record<string, Icons.LucideIcon>)[logoIcon] || Icons.Heart;

  return (
    <div className="brand-lockup flex items-center gap-2.5">
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={brandName}
          className={`brand-logo-mark ${s.box} rounded-xl object-contain`}
          style={{ minWidth: sizes[size].box.split(' ')[0] }}
        />
      ) : (
        <div
          className={`brand-logo-mark ${s.box} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}
          style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}
        >
          <IconComp className={`${s.icon} text-white`} />
        </div>
      )}
      {showText && (
        <span
          className={`brand-name-glow font-bold ${s.text} text-white tracking-tight`}
          style={{ fontFamily: `'${headingFont}', sans-serif` }}
        >
          {brandName}
        </span>
      )}
    </div>
  );
}