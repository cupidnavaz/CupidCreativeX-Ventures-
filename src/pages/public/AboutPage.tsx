import { useState, useEffect, useRef } from 'react';
import { supabase, type SiteSettings } from '@/lib/supabase';
import { useTheme } from '@/lib/theme';
import { usePageContent } from '@/lib/pageContent';
import { ParallaxImage } from '@/components/public/ParallaxImage';
import { Award, Users, Sparkles, Clock, Target, Eye, Heart, ChevronLeft, ChevronRight, Check, ArrowRight } from 'lucide-react';
import { useRouter } from '@/lib/router';
import { type HeroImageFit, type HeroImageOverlay } from '@/lib/heroImage';

export default function AboutPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const { settings: theme } = useTheme();
  const { content } = usePageContent('about');
  const { navigate } = useRouter();

  const primary = theme?.color_primary || '#f97316';
  const accent = theme?.color_accent || '#06b6d4';
  const bg = theme?.color_bg || '#0a0a0f';
  const headingFont = theme?.font_heading || 'Space Grotesk';
  const hf = `'${headingFont}', sans-serif`;
  const sectionImage = content?.section_about_image || '';

  useEffect(() => {
    supabase.from('site_settings').select('*').maybeSingle().then(({ data }) => setSettings(data as SiteSettings | null));
  }, []);

  const values = [
    { icon: Target, title: 'Our Mission', text: settings?.about_mission || 'To transform ideas into impactful digital solutions.' },
    { icon: Eye, title: 'Our Vision', text: 'To be the most trusted digital partner for businesses worldwide, known for innovation and excellence.' },
    { icon: Heart, title: 'Our Values', text: 'Integrity, creativity, and a relentless commitment to client success drive everything we do.' },
  ];

  const stats = settings ? [
    { value: settings.stat_projects, label: 'Projects Delivered', icon: Award },
    { value: settings.stat_clients, label: 'Happy Clients', icon: Users },
    { value: settings.stat_team, label: 'Team Members', icon: Sparkles },
    { value: settings.stat_years, label: 'Years Experience', icon: Clock },
  ] : [];

  const defaultAboutSlides = [
    ...(sectionImage ? [{ src: sectionImage, alt: 'About our company' }] : []),
    { src: 'https://adeorztimmxqhisvtzjj.supabase.co/storage/v1/object/public/media/home-hero-carousel-1794106107731-5vd274zfew9.png', alt: 'Company culture' },
  ];

  return (
    <div style={{ backgroundColor: bg }}>
      {/* Full-Width Banner Section with Darker Brand-Blended Background, Zoom-Out, & Steam Effect */}
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

              {/* Animated Smoke / Steaming Layers */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
                <div 
                  className="absolute -bottom-10 left-1/4 w-32 h-32 rounded-full blur-[45px] animate-steam-1" 
                  style={{ background: `radial-gradient(circle, ${primary}40, transparent 70%)` }}
                />
                <div 
                  className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-[55px] animate-steam-2" 
                  style={{ background: `radial-gradient(circle, ${accent}30, transparent 70%)` }}
                />
                <div 
                  className="absolute -bottom-10 right-1/4 w-36 h-36 rounded-full blur-[50px] animate-steam-3" 
                  style={{ background: `radial-gradient(circle, ${primary}35, transparent 70%)` }}
                />
              </div>

              <div className="relative z-20 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full mb-4 border border-white/5">
                  <Sparkles className="w-4 h-4" style={{ color: primary }} />
                  <span className="text-sm text-gray-400">Who We Are</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4" style={{ fontFamily: hf }}>
                  About{' '}
                  <span
                    style={{
                      background: `linear-gradient(135deg, ${primary}, ${accent})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Us
                  </span>
                </h1>
                <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                  {settings?.about_text || 'We are a team of passionate designers, developers, and strategists dedicated to helping businesses thrive in the digital age.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full px-8 md:px-12 lg:px-20 pb-12">
        {/* Full-Width Glass Heading Container with Orange Underline */}
        <div className="w-full relative rounded-2xl glass px-8 py-8 text-center backdrop-blur-xl border border-white/10">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight pb-3 inline-block relative" style={{ fontFamily: hf }}>
            Our Story & Vision
            <span 
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full"
              style={{ 
                background: primary,
                boxShadow: `0 0 12px ${primary}` 
              }}
            />
          </h2>
        </div>
      </div>

      {/* Text and Image Container */}
      <section className="w-full px-8 md:px-12 lg:px-20 mb-20 border-t-0 border-b-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Text Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full">
              <Sparkles className="w-4 h-4" style={{ color: primary }} />
              <span className="text-sm text-gray-400">Our Story & Expertise</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight" style={{ fontFamily: hf }}>
              Driven by Passion,{' '}
              <span
                style={{
                  background: `linear-gradient(135deg, ${primary}, ${accent})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Defined by Results
              </span>
            </h2>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed">
              Founded on the belief that technology should empower creativity, [CupidCreativeX Ventures](https://www.instagram.com/cupidcreativex/) brings together top-tier engineering and world-class design. We partner with forward-thinking brands to build robust digital solutions that scale.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${primary}20` }}>
                  <Check className="w-4 h-4" style={{ color: primary }} />
                </div>
                <span className="text-sm font-medium">Digital Transformation</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${accent}20` }}>
                  <Award className="w-4 h-4" style={{ color: accent }} />
                </div>
                <span className="text-sm font-medium">Award-Winning Quality</span>
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
                Let's Work Together
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
              slides={defaultAboutSlides}
              bg={bg}
              imageFit="cover"
              imageOverlay="none"
              imageOverlayColor={bg}
              imageOverlayOpacity={0}
              primary={primary}
              accent={accent}
            />
          </div>
        </div>
      </section>

      <div className="w-full px-8 md:px-12 lg:px-20 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div key={i} className="glass glass-hover rounded-2xl p-8 text-center">
                <div className="w-16 h-16 rounded-2xl border border-white/10 flex items-center justify-center mx-auto mb-6" style={{ background: `linear-gradient(135deg, ${primary}20, ${accent}10)` }}>
                  <Icon className="w-8 h-8" style={{ color: primary }} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: hf }}>{v.title}</h3>
                <p className="text-gray-400 leading-relaxed">{v.text}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div 
                key={i} 
                className="group relative glass rounded-2xl p-5 text-center transition-all duration-500 hover:-translate-y-1.5 overflow-hidden flex flex-col items-center justify-center"
              >
                {/* Neon Border & Glow Effect on Hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
                  style={{
                    boxShadow: `inset 0 0 20px ${primary}30, 0 10px 30px -5px ${primary}40`,
                    border: `1px solid ${primary}60`,
                  }}
                />

                {/* Ambient background glow on hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" 
                  style={{ background: `radial-gradient(circle at center top, ${primary}15, transparent 70%)` }}
                />

                <div className="relative z-20 flex items-center gap-4 sm:flex-col sm:gap-2">
                  <div 
                    className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-md" 
                    style={{ background: `linear-gradient(135deg, ${primary}25, ${accent}15)` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: primary }} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white mb-0.5 tabular-nums" style={{ fontFamily: hf }}>
                      {stat.value}+
                    </div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                  </div>
                </div>
              </div>
            );
          })}
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