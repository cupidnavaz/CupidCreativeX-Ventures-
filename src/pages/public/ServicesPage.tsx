import { useState, useEffect, useRef } from 'react';
import { supabase, type Service } from '@/lib/supabase';
import { useTheme } from '@/lib/theme';
import { usePageContent } from '@/lib/pageContent';
import * as Icons from 'lucide-react';
import { Check, ArrowRight, Sparkles, Zap, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from '@/lib/router';
import { getHeroImageOverlayStyle, type HeroImageFit, type HeroImageOverlay } from '@/lib/heroImage';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const { settings } = useTheme();
  const { content } = usePageContent('services');
  const { navigate } = useRouter();

  const primary = settings?.color_primary || '#f97316';
  const accent = settings?.color_accent || '#06b6d4';
  const bg = settings?.color_bg || '#0a0a0f';
  const headingFont = settings?.font_heading || 'Space Grotesk';
  const hf = `'${headingFont}', sans-serif`;

  useEffect(() => {
    supabase.from('services').select('*').eq('published', true).order('sort_order').then(({ data }) => setServices(data || []));
  }, []);

  const marqueeItems = [
    'Acme Corp',
    'Global Tech',
    'Vertex AI',
    'Nexus Media',
    'Quantum Labs',
    'Pioneer Digital',
    'Apex Studio',
    'Synergy Cloud',
  ];

  const serviceSlides = services
    .filter((s) => Boolean(s.image_url))
    .map((s) => ({ src: s.image_url as string, alt: s.title }));

  const defaultHeroSlides = [
    { src: 'https://adeorztimmxqhisvtzjj.supabase.co/storage/v1/object/public/media/home-hero-carousel-1794106107731-5vd274zfew9.png', alt: 'Services overview' },
    ...(content?.section_services_image ? [{ src: content.section_services_image, alt: 'Our services overview' }] : []),
  ];

  const heroSlides = serviceSlides.length > 0 ? serviceSlides : defaultHeroSlides;

  return (
    <div style={{ backgroundColor: bg }}>
      {/* Full-Width Banner Section with Darker Brand-Blended Background & Zoom-Out on Hover */}
      <section className="relative pt-28 pb-12 px-8 md:px-12 lg:px-20 overflow-hidden border-b-0">
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] rounded-full blur-[140px] opacity-25 pointer-events-none"
          style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}
        />
        
        <div className="relative max-w-5xl mx-auto">
          <div className="group relative rounded-3xl transition-transform duration-700 ease-out hover:scale-95">
            <div 
              className="relative rounded-3xl px-8 py-10 md:py-14 text-center overflow-hidden shadow-2xl z-20 transition-all duration-700"
              style={{
                background: `linear-gradient(135deg, #07070a 0%, ${bg} 60%, ${primary}20 100%)`,
                border: `1px solid ${primary}40`,
                boxShadow: `0 20px 50px -15px ${primary}20`,
              }}
            >
              <div 
                className="absolute inset-0 opacity-40 pointer-events-none z-0" 
                style={{ background: `radial-gradient(circle at center top, ${primary}25, transparent 75%)` }}
              />

              <div className="relative z-20 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full mb-4 border border-white/5">
                  <Sparkles className="w-4 h-4" style={{ color: primary }} />
                  <span className="text-sm text-gray-400">Professional Solutions</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4" style={{ fontFamily: hf }}>
                  Our{' '}
                  <span
                    style={{
                      background: `linear-gradient(135deg, ${primary}, ${accent})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Services
                  </span>
                </h1>
                <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                  {content?.subtitle || 'We offer a full spectrum of digital services to help your business thrive in the modern landscape.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Text and Image Container (Text on Left, Homepage Carousel on Right) */}
      <section className="w-full px-8 md:px-12 lg:px-20 mb-20 border-t-0 border-b-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Text Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full">
              <Zap className="w-4 h-4" style={{ color: primary }} />
              <span className="text-sm text-gray-400">Engineering Excellence</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight" style={{ fontFamily: hf }}>
              Crafting Digital Solutions That{' '}
              <span
                style={{
                  background: `linear-gradient(135deg, ${primary}, ${accent})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Drive Impact
              </span>
            </h2>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed">
              We combine strategy, design, and robust engineering to build solutions tailored specifically to your brand goals. From immersive UI/UX experiences to scalable cloud infrastructure, we empower your business for sustainable growth.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${primary}20` }}>
                  <Check className="w-4 h-4" style={{ color: primary }} />
                </div>
                <span className="text-sm font-medium">Tailored Architectures</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${accent}20` }}>
                  <ShieldCheck className="w-4 h-4" style={{ color: accent }} />
                </div>
                <span className="text-sm font-medium">Enterprise Security</span>
              </div>
            </div>
            <div className="pt-4">
              <button
                type="button"
                onClick={() => navigate('/contact')}
                className="group px-7 py-3.5 text-white font-semibold rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer shadow-lg"
                style={{ 
                  background: `linear-gradient(110deg, ${primary}, ${accent})`,
                  boxShadow: `0 10px 25px -5px ${primary}40`
                }}
              >
                Discuss Your Vision
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column: Homepage Hero Carousel Feature */}
          <div className="relative group rounded-3xl transition-all duration-500 hover:-translate-y-1.5 h-[420px]">
            <div
              className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20"
              style={{
                boxShadow: `inset 0 0 30px ${primary}25, 0 20px 40px -10px ${primary}35`,
                border: `1px solid ${primary}50`,
              }}
            />
            <HeroImageCarousel
              slides={heroSlides}
              bg={bg}
              imageFit="cover"
              imageOverlay="gradient"
              imageOverlayColor={bg}
              imageOverlayOpacity={35}
              primary={primary}
              accent={accent}
            />
          </div>
        </div>
      </section>

      {/* Animated Client Logo Marquee with Zoom & Glow Hover Effects */}
      <div className="marquee-track relative isolate py-6 overflow-hidden mb-20">
        <div className="marquee-content flex gap-12 animate-marquee whitespace-nowrap items-center">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500 flex items-center gap-12 transition-all duration-300 hover:scale-90 hover:text-white cursor-pointer"
              style={{ textShadow: 'none' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textShadow = `0 0 15px ${primary}80, 0 0 25px ${accent}60`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textShadow = 'none';
              }}
            >
              {item}
              <Sparkles className="w-3 h-3 transition-transform duration-300 hover:scale-125" style={{ color: primary }} />
            </span>
          ))}
        </div>
      </div>

      <div className="w-full px-8 md:px-12 lg:px-20 pb-20">
        {/* 3 items in a row grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[service.icon] || Icons.Code;
            return (
              <div 
                key={service.id} 
                className="relative group rounded-2xl p-[2px] transition-all duration-500 cursor-pointer"
              >
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-border-rotate"
                  style={{
                    background: `linear-gradient(60deg, ${primary}, ${accent}, #a855f7, ${primary})`,
                  }}
                />

                <div className="relative glass rounded-[15px] overflow-hidden flex flex-col justify-end p-8 min-h-[34rem] bg-[#0a0a0f]/90 h-full">
                  {service.image_url ? (
                    <div className="absolute inset-0 w-full h-full overflow-hidden bg-gray-950 z-0">
                      <img
                        src={service.image_url}
                        alt={service.title}
                        className="w-full h-full object-cover opacity-75 group-hover:opacity-40 group-hover:scale-85 transition-all duration-700 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-transparent transition-opacity duration-500 group-hover:bg-gray-950/90" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-gray-950/90 z-0" />
                  )}

                  <div className="relative z-10 flex flex-col justify-end h-full">
                    <div 
                      className="w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center flex-shrink-0 mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg" 
                      style={{ background: `linear-gradient(135deg, ${primary}20, ${accent}10)` }}
                    >
                      <Icon className="w-7 h-7" style={{ color: primary }} />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: hf }}>
                      {service.title}
                    </h3>
                    
                    <p className="text-gray-300 leading-relaxed mb-4 line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
                      {service.description}
                    </p>
                    
                    {service.features?.length > 0 && (
                      <div className="grid grid-cols-1 gap-2 max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                        {service.features.map((f, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                            <Check className="w-4 h-4 flex-shrink-0" style={{ color: accent }} />
                            {f}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <button
            type="button"
            onClick={() => navigate('/contact')}
            className="group px-8 py-4 text-white font-semibold rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer shadow-lg"
            style={{ 
              background: `linear-gradient(110deg, ${primary}, ${accent})`,
              boxShadow: `0 10px 25px -5px ${primary}40`
            }}
          >
            Start Your Project
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- */
/* Homepage Hero Image Carousel Component                            */
/* ----------------------------------------------------------------- */

function HeroImageCarousel({
  slides,
  bg,
  imageFit,
  imageOverlay,
  imageOverlayColor,
  imageOverlayOpacity,
  primary,
  accent,
}: {
  slides: { src: string; alt: string }[];
  bg: string;
  imageFit: HeroImageFit;
  imageOverlay: HeroImageOverlay;
  imageOverlayColor: string;
  imageOverlayOpacity: number;
  primary: string;
  accent: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = carouselRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => document.removeEventListener('visibilitychange', updateVisibility);
  }, []);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotion(query.matches);
    updatePreference();
    query.addEventListener('change', updatePreference);
    return () => query.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    if (!slides || slides.length < 2 || paused || !inView || !pageVisible || reducedMotion) return;
    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
      setSpinCount((c) => c + 1);
    }, 3000);
    return () => window.clearInterval(interval);
  }, [slides, paused, inView, pageVisible, reducedMotion]);

  useEffect(() => {
    if (slides && slides.length > 0) {
      setActiveIndex((index) => Math.min(index, Math.max(slides.length - 1, 0)));
    }
  }, [slides]);

  const goTo = (index: number) => {
    if (!slides || index === activeIndex) return;
    setActiveIndex((index + slides.length) % slides.length);
    setSpinCount((c) => c + 1);
  };

  if (!slides || slides.length === 0) return null;

  const total = slides.length;
  const angleStep = 360 / Math.max(total, 3);
  const currentAngle = -activeIndex * angleStep - (spinCount * 360);

  return (
    <div
      ref={carouselRef}
      role="region"
      aria-label="Featured work"
      aria-roledescription="carousel"
      className="hero-image-frame relative overflow-hidden rounded-[1.75rem] border border-white/15 shadow-2xl w-full h-full min-h-[420px]"
      style={{ 
        height: '100%',
        perspective: '1500px',
        background: `radial-gradient(circle at center, ${primary || '#f97316'}15, ${bg || '#0a0a0f'} 85%)`,
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={(event) => setPaused(event.currentTarget.contains(document.activeElement))}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => setPaused(event.currentTarget.matches(':hover'))}
    >
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          background: `conic-gradient(from ${spinCount * 360}deg at 50% 50%, ${primary || '#f97316'}40, ${accent || '#06b6d4'}40, #8b5cf640, ${primary || '#f97316'}40)`,
          transform: `rotate(${spinCount * 360}deg)`,
        }}
      />

      <div 
        className="absolute inset-0 w-full h-full flex items-center justify-center transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]" 
        style={{ 
          transformStyle: 'preserve-3d',
          transform: `translateZ(-450px) rotateY(${currentAngle}deg)`,
        }}
      >
        {slides.map((slide, index) => {
          const slideAngle = index * angleStep;
          const isActive = index === activeIndex;
          return (
            <div
              key={slide.src}
              className="absolute inset-0 w-full h-full rounded-[1.75rem] overflow-hidden backface-hidden shadow-2xl border border-white/10 flex items-center justify-center p-4"
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateY(${slideAngle}deg) translateZ(450px)`,
                backgroundColor: `${bg || '#0a0a0f'}dd`,
                opacity: isActive ? 1 : 0.3,
                transition: 'opacity 700ms ease-in-out',
              }}
            >
              <img
                src={slide.src}
                alt={slide.alt || 'Hero slide'}
                className={`hero-carousel-image absolute inset-0 h-full w-full ${imageFit === 'contain' ? 'object-contain p-6' : 'object-cover'}`}
              />
              {imageOverlay && imageOverlay !== 'none' && (
                <div
                  className="pointer-events-none absolute inset-0"
                  style={getHeroImageOverlayStyle(imageOverlay, imageOverlayColor || bg, imageOverlayOpacity)}
                />
              )}
            </div>
          );
        })}
      </div>

      {slides.length > 1 && (
        <div className="absolute inset-x-4 bottom-4 z-30 flex items-center justify-between gap-3">
          <div role="group" className="flex items-center gap-1.5" aria-label="Choose featured image">
            {slides.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                aria-label={`Show image ${index + 1} of ${slides.length}`}
                aria-pressed={index === activeIndex}
                onClick={() => goTo(index)}
                className={`h-2.5 rounded-full transition-[width,background-color] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer ${
                  index === activeIndex ? 'w-7 bg-white' : 'w-2.5 bg-white/55 hover:bg-white/85'
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous featured image"
              onClick={() => goTo(activeIndex - 1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white transition-colors hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next featured image"
              onClick={() => goTo(activeIndex + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white transition-colors hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}