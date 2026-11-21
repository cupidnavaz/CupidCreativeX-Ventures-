import { useTheme } from '../lib/theme';
import { usePageContent } from '../lib/pageContent';
import { getHeroImageOverlayStyle } from '../lib/heroImage';

export function PageHero({
  pageKey,
  defaultTitle,
  defaultSubtitle,
  gradientWord,
}) {
  const { settings } = useTheme();
  const { content, loading } = usePageContent(pageKey);

  const primary = settings?.color_primary || '#f97316';
  const accent = settings?.color_accent || '#06b6d4';
  const bg = settings?.color_bg || '#0a0a0f';
  const headingFont = settings?.font_heading || 'Space Grotesk';
  const hf = `'${headingFont}', sans-serif`;

  const heroImage = content?.hero_image_url || '';
  const heroImageWidth = content?.hero_image_width || 560;
  const heroImageHeight = content?.hero_image_height || 420;
  const heroImageFit = content?.hero_image_fit || 'cover';
  const heroImageOverlay = content?.hero_image_overlay || 'gradient';
  const heroImageOverlayColor = content?.hero_image_overlay_color || bg;
  const heroImageOverlayOpacity = content?.hero_image_overlay_opacity ?? 35;
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
    <section className="relative py-28 md:py-32 overflow-hidden" style={{ backgroundColor: 'transparent' }}>
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

              {/* Action Button with Solid Color & Sliding Effect */}
              <div className={`mt-8 ${heroImage ? '' : 'flex justify-center'}`}>
                <a 
                  href="#contact" 
                  className="relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white bg-indigo-600 rounded-xl overflow-hidden group shadow-lg"
                >
                  <span className="absolute inset-0 w-full h-full bg-indigo-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
                  <span className="relative flex items-center gap-2">
                    Start Your Project
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                    </svg>
                  </span>
                </a>
              </div>
            </>
          )}
        </div>

        {heroImage && (
          <div
            className="hero-image-shell relative mx-auto w-full min-w-0 lg:ml-auto"
            style={{ width: `min(100%, ${heroImageWidth}px)` }}
          >
            <div
              className="absolute -inset-4 rounded-[2rem] blur-2xl opacity-20"
              style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}
            />
            <div
              className="hero-image-frame relative overflow-hidden rounded-[1.75rem] border border-white/10 shadow-2xl"
              style={{ height: `min(${heroImageHeight}px, 70vh)` }}
            >
              <img
                src={heroImage}
                alt={`${title} page`}
                className="w-full h-full"
                style={{ objectFit: heroImageFit }}
                fetchPriority="high"
              />
              {heroImageOverlay !== 'none' && (
                <div
                  className="pointer-events-none absolute inset-0"
                  style={getHeroImageOverlayStyle(heroImageOverlay, heroImageOverlayColor, heroImageOverlayOpacity)}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}