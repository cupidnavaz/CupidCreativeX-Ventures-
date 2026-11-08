import { useTheme } from '@/lib/theme';
import { usePageContent } from '@/lib/pageContent';

export function PageHero({
  pageKey,
  defaultTitle,
  defaultSubtitle,
  gradientWord,
}: {
  pageKey: string;
  defaultTitle: string;
  defaultSubtitle?: string;
  gradientWord?: string;
}) {
  const { settings } = useTheme();
  const { content, loading } = usePageContent(pageKey);

  const primary = settings?.color_primary || '#f97316';
  const accent = settings?.color_accent || '#06b6d4';
  const bg = settings?.color_bg || '#0a0a0f';
  const headingFont = settings?.font_heading || 'Space Grotesk';
  const hf = `'${headingFont}', sans-serif`;

  const heroImage = content?.hero_image_url || '';
  const title = content?.hero_title || defaultTitle;
  const subtitle = content?.hero_subtitle || defaultSubtitle || '';

  const titlePart = gradientWord
    ? title.replace(gradientWord, `__GRADIENT__${gradientWord}__END__`)
    : title;

  const renderTitle = () => {
    if (!gradientWord || !titlePart.includes('__GRADIENT__')) {
      return title;
    }
    const parts = titlePart.split(/__GRADIENT__(.*?)__END__/);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return (
          <span
            key={i}
            style={{
              background: `linear-gradient(135deg, ${primary}, ${accent})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <section className="relative py-28 md:py-32 overflow-hidden" style={{ backgroundColor: bg }}>
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full blur-[100px] animate-pulse-slow" style={{ background: `${primary}20` }} />
      <div className="absolute top-10 right-1/4 w-72 h-72 rounded-full blur-[100px] animate-pulse-slow" style={{ background: `${accent}20` }} />

      <div className={`relative w-full px-8 md:px-12 lg:px-20 grid grid-cols-1 ${heroImage ? 'lg:grid-cols-[1.05fr_0.95fr]' : ''} gap-12 items-center`}>
        <div className={heroImage ? '' : 'max-w-3xl mx-auto text-center'}>
          {loading ? (
            <div className={`w-7 h-7 border-2 rounded-full animate-spin ${heroImage ? '' : 'mx-auto'}`} style={{ borderColor: primary, borderTopColor: 'transparent' }} />
          ) : (
            <>
              <h1
                className="text-5xl md:text-6xl font-bold text-white mb-4 animate-fade-up"
                style={{ fontFamily: hf }}
              >
                {renderTitle()}
              </h1>
              {subtitle && (
                <p
                  className={`text-gray-400 text-lg max-w-2xl ${heroImage ? '' : 'mx-auto'} leading-relaxed animate-fade-up`}
                  style={{ animationDelay: '0.1s' }}
                >
                  {subtitle}
                </p>
              )}
            </>
          )}
        </div>

        {heroImage && (
          <div className="hero-image-shell relative mx-auto w-full max-w-xl lg:ml-auto">
            <div
              className="absolute -inset-4 rounded-[2rem] blur-2xl opacity-20"
              style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}
            />
            <div className="hero-image-frame relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-white/10 shadow-2xl">
              <img src={heroImage} alt={`${title} page`} className="w-full h-full object-cover" fetchPriority="high" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${bg}25, transparent 55%, ${bg}45)` }} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
