import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from '@/lib/router';
import { supabase, type HeroCarouselImage, type Service, type Project, type Testimonial } from '@/lib/supabase';
import { useTheme } from '@/lib/theme';
import { usePageContent } from '@/lib/pageContent';
import { useReveal, useCountUp } from '@/lib/useReveal';
import { SocialLinks } from '@/components/public/SocialLinks';
import * as Icons from 'lucide-react';
import {
  ArrowRight,
  ArrowUpRight,
  Star,
  Check,
  Sparkles,
  TrendingUp,
  Users,
  Award,
  Clock,
  Quote,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Eye,
  Zap,
  Target,
  Rocket,
  Heart,
  Send,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
} from 'lucide-react';
import { ProjectOverviewModal } from '@/components/public/ProjectOverviewModal';
import { ParallaxImage } from '@/components/public/ParallaxImage';
import { getHeroImageOverlayStyle, type HeroImageFit, type HeroImageOverlay } from '@/lib/heroImage';
import { getLiveProjectUrl } from '@/lib/projectLinks';

export default function HomePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const { settings } = useTheme();
  const { content } = usePageContent('home');
  const { navigate } = useRouter();

  const primary = settings?.color_primary || '#f97316';
  const accent = settings?.color_accent || '#06b6d4';
  const bg = settings?.color_bg || '#0a0a0f';
  const headingFont = settings?.font_heading || 'Space Grotesk';
  const hf = `'${headingFont}', sans-serif`;

  const heroBanner = content?.section_hero_image || content?.hero_image_url || '';
  const configuredSlides = content?.body_content?.hero_carousel_images;
  const customHeroSlides = Array.isArray(configuredSlides)
    ? configuredSlides.filter(
        (slide): slide is HeroCarouselImage =>
          typeof slide === 'object' &&
          slide !== null &&
          'url' in slide &&
          typeof slide.url === 'string' &&
          'alt' in slide &&
          typeof slide.alt === 'string',
      )
    : [];
  const heroSlides = (customHeroSlides.length
    ? customHeroSlides.map(({ url, alt }) => ({ src: url, alt }))
    : [
        ...(heroBanner
          ? [{ src: heroBanner, alt: `${settings?.brand_name || 'CupidCreativeX'} creative work` }]
          : []),
        ...projects.flatMap((project) =>
          project.image_url ? [{ src: project.image_url, alt: `${project.title} project` }] : [],
        ),
      ]
  ).filter((slide, index, slides) => slides.findIndex((candidate) => candidate.src === slide.src) === index);
  const servicesImage = content?.section_services_image || '';
  const aboutImage = content?.section_about_image || '';

  useEffect(() => {
    (async () => {
      const [{ data: svc }, { data: proj }, { data: test }] = await Promise.all([
        supabase.from('services').select('*').eq('published', true).order('sort_order'),
        supabase.from('projects').select('*').eq('published', true).order('sort_order').limit(6),
        supabase.from('testimonials').select('*').eq('published', true).order('sort_order').limit(9),
      ]);
      setServices(svc || []);
      setProjects(proj || []);
      setTestimonials(test || []);
    })();
  }, []);

  const stats = settings
    ? [
        { value: settings.stat_projects, label: 'Projects Delivered', icon: Award, suffix: '+' },
        { value: settings.stat_clients, label: 'Happy Clients', icon: Users, suffix: '+' },
        { value: settings.stat_team, label: 'Team Members', icon: Sparkles, suffix: '' },
        { value: settings.stat_years, label: 'Years Experience', icon: Clock, suffix: '+' },
      ]
    : [];

  const marqueeItems = [
    'Web Development',
    'Brand Identity',
    'UI / UX Design',
    'Mobile Apps',
    'Digital Strategy',
    'Motion Design',
    'Cloud Infrastructure',
    'SEO & Growth',
  ];

  return (
    <div style={{ backgroundColor: 'transparent' }}>
      <Hero
        settings={settings}
        hf={hf}
        primary={primary}
        accent={accent}
        bg={bg}
        heroSlides={heroSlides}
        heroImageWidth={content?.hero_image_width || 520}
        heroImageHeight={content?.hero_image_height || 400}
        heroImageFit={content?.hero_image_fit || 'contain'}
        heroImageOverlay={content?.hero_image_overlay || 'transparent'}
        heroImageOverlayColor={content?.hero_image_overlay_color || bg}
        heroImageOverlayOpacity={content?.hero_image_overlay_opacity ?? 35}
        stats={stats}
        navigate={navigate}
      />

      <AboutPreview
        aboutImage={aboutImage}
        settings={settings}
        hf={hf}
        primary={primary}
        accent={accent}
        navigate={navigate}
      />

      {/* Marquee strip */}
      <div className="marquee-track relative isolate py-5 overflow-hidden">
        <div className="marquee-content flex gap-12 animate-marquee whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className="text-sm font-medium uppercase tracking-[0.2em] text-gray-600 flex items-center gap-12"
            >
              {item}
              <Sparkles className="w-3 h-3" style={{ color: primary }} />
            </span>
          ))}
        </div>
      </div>

      <ServicesSection
        services={services}
        servicesImage={servicesImage}
        hf={hf}
        primary={primary}
        accent={accent}
        navigate={navigate}
      />

      <ProcessSection hf={hf} primary={primary} accent={accent} />

      <ProjectsShowcase
        projects={projects}
        hf={hf}
        primary={primary}
        accent={accent}
        navigate={navigate}
      />

      <TestimonialsCarousel
        testimonials={testimonials}
        hf={hf}
        primary={primary}
        accent={accent}
      />

      <CtaSection hf={hf} primary={primary} accent={accent} navigate={navigate} />
      <HomeContactSection hf={hf} primary={primary} accent={accent} settings={settings} />
    </div>
  );
}

/* ----------------------------------------------------------------- */
/* Hero                                                               */
/* ----------------------------------------------------------------- */

function Hero({
  settings,
  hf,
  primary,
  accent,
  bg,
  heroSlides,
  heroImageWidth,
  heroImageHeight,
  heroImageFit,
  heroImageOverlay,
  heroImageOverlayColor,
  heroImageOverlayOpacity,
  stats,
  navigate,
}: {
  settings: ReturnType<typeof useTheme>['settings'];
  hf: string;
  primary: string;
  accent: string;
  bg: string;
  heroSlides: { src: string; alt: string }[];
  heroImageWidth: number;
  heroImageHeight: number;
  heroImageFit: HeroImageFit;
  heroImageOverlay: HeroImageOverlay;
  heroImageOverlayColor: string;
  heroImageOverlayOpacity: number;
  stats: { value: number; label: string; icon: typeof Award; suffix: string }[];
  navigate: (to: string) => void;
}) {
  return (
    <section className="relative min-h-screen flex flex-col items-center overflow-hidden lg:flex-row bg-transparent">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div
        className="absolute top-1/4 -left-32 w-[28rem] h-[28rem] rounded-full blur-[120px] animate-pulse-slow"
        style={{ background: `${primary}30` }}
      />
      <div
        className="absolute bottom-1/4 -right-32 w-[28rem] h-[28rem] rounded-full blur-[120px] animate-pulse-slow"
        style={{ background: `${accent}30`, animationDelay: '1s' }}
      />

      <div className={`relative w-full px-8 md:px-12 lg:px-20 pt-32 pb-12 lg:pb-48 ${heroSlides.length ? '' : 'min-h-screen flex items-center'}`}>
        <div className={`grid grid-cols-1 ${heroSlides.length ? 'lg:grid-cols-[1.05fr_0.95fr]' : ''} gap-12 items-center`}>
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6 animate-fade-up">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full bg-green-400 opacity-60 animate-ping" />
                <span className="relative inline-flex w-2 h-2 bg-green-400 rounded-full" />
              </span>
              <span className="text-sm text-gray-400">Available for new projects</span>
            </div>

            <h1
              className="text-5xl md:text-7xl font-bold text-white leading-[1.05] mb-6 animate-fade-up"
              style={{ fontFamily: hf, animationDelay: '0.1s' }}
            >
              {settings?.hero_title || 'We Build Digital Experiences That Matter'}
            </h1>

            <p
              className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed animate-fade-up"
              style={{ animationDelay: '0.2s' }}
            >
              {settings?.hero_subtitle ||
                'A full-service digital agency crafting websites, brands, and software that drive growth.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <button
                type="button"
                onClick={() => navigate('/contact')}
                className="relative inline-flex items-center justify-center px-8 py-4 font-semibold bg-[#f97316] text-white rounded-xl transition-all duration-300 group shadow-lg cursor-pointer hover:bg-transparent"
                style={{ 
                  background: `linear-gradient(110deg, ${primary}, ${accent})`,
                 boxShadow: '0 10px 20px -5px rgba(249, 115, 22, 0.4)'
                }}
              >
                <span className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-white/30 transition-colors duration-300 pointer-events-none" />
                <span className="relative z-10 flex items-center gap-2">
                  Start Your Project
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/portfolio')}
                className="px-8 py-4 glass glass-hover text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group hover:border-[#f97316] hover:text-[#f97316]"
              >
                View Our Work
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
            <SocialLinks className="mt-8 animate-fade-up" />
          </div>
          {heroSlides.length > 0 && (
            <div
              className="hero-image-shell relative mx-auto w-full min-w-0 lg:ml-auto h-full min-h-[480px]"
              style={{ width: `min(100%, ${heroImageWidth}px)` }}
            >
              <div
                className="absolute -inset-4 rounded-[2rem] blur-2xl opacity-30 animate-border-rotate"
                style={{ background: `linear-gradient(135deg, ${primary}, ${accent}, #8b5cf6, ${primary})` }}
              />
              <HeroImageCarousel
                slides={heroSlides}
                bg={bg}
                imageHeight={heroImageHeight}
                imageFit={heroImageFit}
                imageOverlay={heroImageOverlay}
                imageOverlayColor={heroImageOverlayColor}
                imageOverlayOpacity={heroImageOverlayOpacity}
                primary={primary}
                accent={accent}
              />
            </div>
          )}
        </div>
      </div>

      <div className="relative w-full border-t border-white/5 glass lg:absolute lg:bottom-0 lg:left-0 lg:right-0">
        <div className="w-full px-8 md:px-12 lg:px-20 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <StatCounter
              key={i}
              value={stat.value}
              label={stat.label}
              icon={stat.icon}
              suffix={stat.suffix}
              primary={primary}
              accent={accent}
              hf={hf}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCounter({
  value,
  label,
  icon: Icon,
  suffix,
  primary,
  accent,
  hf,
}: {
  value: number;
  label: string;
  icon: typeof Award;
  suffix: string;
  primary: string;
  accent: string;
  hf: string;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.4 });
  const count = useCountUp(value, 1800, visible);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} group relative glass rounded-2xl p-6 flex items-center gap-4 transition-all duration-500 hover:-translate-y-1.5 overflow-hidden`}
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
        style={{
          boxShadow: `inset 0 0 20px ${primary}30, 0 10px 30px -5px ${primary}40`,
          border: `1px solid ${primary}60`,
        }}
      />
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" 
        style={{ background: `radial-gradient(circle at center top, ${primary}15, transparent 70%)` }}
      />
      <div className="relative z-20 flex items-center gap-4 w-full">
        <div
          className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-md"
          style={{ background: `linear-gradient(135deg, ${primary}25, ${accent}15)` }}
        >
          <Icon className={`w-6 h-6 ${visible ? 'counter-icon-enter' : ''}`} style={{ color: primary }} />
        </div>
        <div className="min-w-0">
          <div
            className={`text-3xl font-bold text-white tabular-nums ${visible ? 'counter-value-enter' : ''}`}
            style={{ fontFamily: hf }}
          >
            {count}{suffix}
          </div>
          <div className="text-sm text-gray-400">{label}</div>
        </div>
      </div>
    </div>
  );
}

function HeroImageCarousel({
  slides,
  bg,
  imageHeight,
  imageFit,
  imageOverlay,
  imageOverlayColor,
  imageOverlayOpacity,
  primary,
  accent,
}: {
  slides: { src: string; alt: string }[];
  bg: string;
  imageHeight: number;
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
      className="hero-image-frame relative overflow-hidden rounded-[1.75rem] border border-white/15 shadow-2xl w-full h-full min-h-[500px]"
      style={{ 
        height: '100%',
        perspective: '1500px',
        background: 'transparent',
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={(event) => setPaused(event.currentTarget.contains(document.activeElement))}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => setPaused(event.currentTarget.matches(':hover'))}
    >
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          background: `radial-gradient(circle at center, ${primary || '#f97316'}20, transparent 70%)`,
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
              className="absolute inset-0 w-full h-full rounded-[1.75rem] overflow-hidden backface-hidden shadow-2xl border border-white/10 flex items-center justify-center bg-black/40 backdrop-blur-md"
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateY(${slideAngle}deg) translateZ(450px)`,
                opacity: isActive ? 1 : 0.3,
                transition: 'opacity 700ms ease-in-out',
              }}
            >
              <img
                src={slide.src}
                alt={slide.alt || 'Hero slide'}
                className="hero-carousel-image absolute inset-0 h-full w-full object-cover rounded-[1.75rem]"
              />
              {imageOverlay && imageOverlay !== 'none' && (
                <div
                  className="pointer-events-none absolute inset-0 rounded-[1.75rem]"
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

/* ----------------------------------------------------------------- */
/* Services                                                           */
/* ----------------------------------------------------------------- */

function ServicesSection({
  services,
  servicesImage,
  hf,
  primary,
  accent,
  navigate,
}: {
  services: Service[];
  servicesImage: string;
  hf: string;
  primary: string;
  accent: string;
  navigate: (to: string) => void;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section className="py-24 relative">
      <div className="w-full px-8 md:px-12 lg:px-20">
        <div
          ref={ref}
          className={`reveal ${visible ? 'is-visible' : ''} grid grid-cols-1 lg:grid-cols-3 gap-8 mb-14`}
        >
          <div className="lg:col-span-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-4">
              <Sparkles className="w-4 h-4" style={{ color: primary }} />
              <span className="text-sm text-gray-400">What We Do</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: hf }}>
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
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto lg:mx-0">
              Comprehensive digital solutions to help your business grow, innovate, and lead.
            </p>
          </div>
          {servicesImage && (
            <div className="rounded-2xl overflow-hidden h-48 lg:h-full border border-white/5 bg-gray-900/50 flex items-center justify-center p-4">
              <img src={servicesImage} alt="Our services" className="w-full h-full object-cover" loading="lazy" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[service.icon] || Icons.Code;
            return (
              <ServiceCard
                key={service.id}
                service={service}
                Icon={Icon}
                index={i}
                hf={hf}
                primary={primary}
                accent={accent}
                onClick={() => navigate('/services')}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  Icon,
  index,
  hf,
  primary,
  accent,
  onClick,
}: {
  service: Service;
  Icon: Icons.LucideIcon;
  index: number;
  hf: string;
  primary: string;
  accent: string;
  onClick: () => void;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.2 });
  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`reveal ${visible ? 'is-visible' : ''} relative group rounded-2xl p-[2px] transition-all duration-500 cursor-pointer`}
      style={{ transitionDelay: `${index * 0.08}s` }}
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-border-rotate" />
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
          <span
            className="inline-flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all mt-4"
            style={{ color: primary }}
          >
            Learn more <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- */
/* Process                                                            */
/* ----------------------------------------------------------------- */

function ProcessSection({
  hf,
  primary,
  accent,
}: {
  hf: string;
  primary: string;
  accent: string;
}) {
  const steps = [
    { icon: Target, title: 'Discover', desc: 'We dig into your goals, audience, and market to map the right strategy.' },
    { icon: Zap, title: 'Design', desc: 'Crafting interfaces and brand systems that feel inevitable and look unmistakable.' },
    { icon: Rocket, title: 'Develop', desc: 'Engineering fast, accessible, and scalable products with modern tooling.' },
    { icon: TrendingUp, title: 'Grow', desc: 'We measure, iterate, and optimize so your product keeps compounding results.' },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full blur-[140px] opacity-30 pointer-events-none"
        style={{ background: accent }}
      />
      <div className="w-full px-8 md:px-12 lg:px-20 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-4">
            <Zap className="w-4 h-4" style={{ color: accent }} />
            <span className="text-sm text-gray-400">How We Work</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: hf }}>
            A Process Built for{' '}
            <span
              style={{
                background: `linear-gradient(135deg, ${primary}, ${accent})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Momentum
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          {steps.map((step, i) => (
            <ProcessStep key={i} step={step} index={i} hf={hf} primary={primary} accent={accent} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessStep({
  step,
  index,
  hf,
  primary,
  accent,
}: {
  step: { icon: typeof Target; title: string; desc: string };
  index: number;
  hf: string;
  primary: string;
  accent: string;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>({ threshold: 0.3 });
  const Icon = step.icon;
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} group relative text-center glass glass-hover p-8 rounded-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden`}
      style={{ transitionDelay: `${index * 0.12}s` }}
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 20px ${primary}30, 0 10px 30px -5px ${primary}40`,
          border: `1px solid ${primary}60`,
        }}
      />
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
        style={{ background: `radial-gradient(circle at center top, ${primary}20, transparent 70%)` }}
      />
      <div className="relative inline-flex mb-6 z-10">
        <div
          className="w-20 h-20 rounded-2xl border border-white/10 flex items-center justify-center mx-auto transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg"
          style={{ 
            background: `linear-gradient(135deg, ${primary}25, ${accent}15)`,
            boxShadow: `0 0 15px ${primary}20`,
          }}
        >
          <Icon className="w-9 h-9 transition-transform duration-500 group-hover:scale-110" style={{ color: primary }} />
        </div>
        <span
          className="absolute -top-2 -right-2 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center text-white shadow-md transition-transform duration-500 group-hover:scale-125"
          style={{ background: primary, boxShadow: `0 0 10px ${primary}` }}
        >
          {index + 1}
        </span>
      </div>
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-white mb-2 transition-colors duration-300 group-hover:text-transparent group-hover:bg-clip-text" style={{ fontFamily: hf, backgroundImage: `linear-gradient(135deg, ${primary}, ${accent})` }}>
          {step.title}
        </h3>
        <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto group-hover:text-gray-300 transition-colors duration-300">
          {step.desc}
        </p>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- */
/* Projects Showcase                                                  */
/* ----------------------------------------------------------------- */

function ProjectsShowcase({
  projects,
  hf,
  primary,
  accent,
  navigate,
}: {
  projects: Project[];
  hf: string;
  primary: string;
  accent: string;
  navigate: (to: string) => void;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [visibleCount, setVisibleCount] = useState(3);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const updateVisibleCount = () => {
      setVisibleCount(window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3);
    };
    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  const slides: Project[][] = [];
  for (let i = 0; i < projects.length; i += visibleCount) {
    slides.push(projects.slice(i, i + visibleCount));
  }
  const activeSlide = Math.min(activeIndex, Math.max(slides.length - 1, 0));

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [paused, slides.length]);

  const showPrevious = () => setActiveIndex((index) => (index - 1 + slides.length) % slides.length);
  const showNext = () => setActiveIndex((index) => (index + 1) % slides.length);

  return (
    <section className="py-24 relative">
      <div 
        className="w-full px-8 md:px-12 lg:px-20"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          ref={ref}
          className={`reveal ${visible ? 'is-visible' : ''} flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4`}
        >
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-4">
              <TrendingUp className="w-4 h-4" style={{ color: accent }} />
              <span className="text-sm text-gray-400">Recent Work</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: hf }}>
              Featured{' '}
              <span
                style={{
                  background: `linear-gradient(135deg, ${primary}, ${accent})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Projects
              </span>
            </h2>
          </div>
          <div className="flex items-center gap-5">
            <button
              onClick={() => navigate('/portfolio')}
              className="font-medium text-sm flex items-center gap-2 group cursor-pointer"
              style={{ color: primary }}
            >
              View All Projects
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            {slides.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={showPrevious}
                  aria-label="Previous projects"
                  className="w-10 h-10 rounded-full border border-white/10 text-white flex items-center justify-center hover:border-white/35 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  aria-label="Next projects"
                  className="w-10 h-10 rounded-full border border-white/10 text-white flex items-center justify-center hover:border-white/35 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {projects.length === 0 ? (
          <p className="text-gray-500 text-center py-12">Projects coming soon.</p>
        ) : (
          <div>
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
              >
                {slides.map((slide, slideIndex) => (
                  <div
                    key={slideIndex}
                    className={`min-w-full grid ${visibleCount === 1 ? 'grid-cols-1' : visibleCount === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-6 px-1 py-2`}
                  >
                    {slide.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        hf={hf}
                        primary={primary}
                        onPreview={() => setSelectedProject(project)}
                        tabIndex={activeSlide === slideIndex ? 0 : -1}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            {slides.length > 1 && (
              <div className="mt-8 flex justify-center gap-2" role="group" aria-label="Choose project slide">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Go to project slide ${index + 1}`}
                    aria-current={activeSlide === index ? 'true' : undefined}
                    className="h-2.5 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer"
                    style={{
                      width: activeSlide === index ? '2rem' : '0.625rem',
                      backgroundColor: activeSlide === index ? primary : 'rgba(255,255,255,0.25)',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {selectedProject && (
        <ProjectOverviewModal
          project={selectedProject}
          headingFont={hf}
          primary={primary}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}

function ProjectCard({
  project,
  hf,
  primary,
  onPreview,
  tabIndex,
}: {
  project: Project;
  hf: string;
  primary: string;
  onPreview: () => void;
  tabIndex: number;
}) {
  const liveUrl = getLiveProjectUrl(project);

  return (
    <article className="group relative w-full overflow-hidden rounded-2xl glass card-tilt transition-all duration-500 hover:-translate-y-1.5">
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
        style={{
          boxShadow: `inset 0 0 25px ${primary}25, 0 15px 35px -5px ${primary}35`,
          border: `1px solid ${primary}50`,
        }}
      />
      <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 relative">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-lg font-semibold text-gray-400" style={{ fontFamily: hf }}>
            {project.title}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-4 left-4 right-4 hidden translate-y-2 flex-wrap gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:flex z-20">
          <button
            type="button"
            onClick={onPreview}
            tabIndex={tabIndex}
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-950 hover:bg-gray-200 cursor-pointer"
          >
            <Eye className="h-4 w-4" /> Preview project
          </button>
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={tabIndex}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/30 bg-black/40 px-4 py-2 text-sm font-semibold text-white hover:bg-black/70 cursor-pointer"
            >
              Live project <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
      <div className="p-6 relative z-20">
        <span className="text-xs font-medium uppercase tracking-wider" style={{ color: primary }}>
          {project.category}
        </span>
        <h3 className="text-lg font-bold text-white mt-2 mb-1" style={{ fontFamily: hf }}>
          {project.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>
      </div>
    </article>
  );
}

/* ----------------------------------------------------------------- */
/* About Preview                                                     */
/* ----------------------------------------------------------------- */

function AboutPreview({
  aboutImage,
  settings,
  hf,
  primary,
  accent,
  navigate,
}: {
  aboutImage: string;
  settings: ReturnType<typeof useTheme>['settings'];
  hf: string;
  primary: string;
  accent: string;
  navigate: (to: string) => void;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section className="py-24 relative">
      <div className="w-full px-8 md:px-12 lg:px-20">
        <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''}`}>
          <div className={`grid grid-cols-1 ${aboutImage ? 'md:grid-cols-2' : ''} gap-12 items-center`}>
            {aboutImage && (
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10">
                <ParallaxImage
                  src={aboutImage}
                  alt="[CupidCreativeX Ventures](https://www.instagram.com/CupidCreativeX) team and work"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              </div>
            )}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: hf }}>
                {settings?.about_title || 'About Us'}
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                {settings?.about_text || 'We are a team of passionate designers, developers, and strategists.'}
              </p>
              <button
                onClick={() => navigate('/about')}
                className="font-medium text-sm flex items-center gap-2 group cursor-pointer"
                style={{ color: primary }}
              >
                Learn More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- */
/* Testimonials Carousel                                              */
/* ----------------------------------------------------------------- */

function TestimonialsCarousel({
  testimonials,
  hf,
  primary,
  accent,
}: {
  testimonials: Testimonial[];
  hf: string;
  primary: string;
  accent: string;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [visibleCount, setVisibleCount] = useState(3);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const updateVisibleCount = () => {
      setVisibleCount(window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3);
    };
    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  const slides: Testimonial[][] = [];
  for (let i = 0; i < testimonials.length; i += visibleCount) {
    slides.push(testimonials.slice(i, i + visibleCount));
  }
  const slideCount = slides.length;
  const activeSlide = Math.min(activeIndex, Math.max(slideCount - 1, 0));

  const next = useCallback(() => setActiveIndex((p) => (p + 1) % Math.max(slideCount, 1)), [slideCount]);
  const prev = useCallback(() => setActiveIndex((p) => (p - 1 + slideCount) % Math.max(slideCount, 1)), [slideCount]);

  useEffect(() => {
    if (paused || slideCount <= 1) return;
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [paused, next, slideCount]);

  if (testimonials.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-[120px] pointer-events-none"
        style={{ background: `${primary}15` }}
      />
      <div 
        className="w-full px-8 md:px-12 lg:px-20 relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          ref={ref}
          className={`reveal ${visible ? 'is-visible' : ''} flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4`}
        >
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-4">
              <Star className="w-4 h-4" style={{ color: primary }} />
              <span className="text-sm text-gray-400">Client Love</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: hf }}>
              What Our{' '}
              <span
                style={{
                  background: `linear-gradient(135deg, ${primary}, ${accent})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Clients Say
              </span>
            </h2>
          </div>
          {slideCount > 1 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous testimonials"
                className="w-10 h-10 rounded-full border border-white/10 text-white flex items-center justify-center hover:border-white/35 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next testimonials"
                className="w-10 h-10 rounded-full border border-white/10 text-white flex items-center justify-center hover:border-white/35 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        <div>
          <div className="overflow-hidden" role="region" aria-live="polite" aria-label="Client testimonial slides">
            <div
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {slides.map((slide, slideIndex) => (
                <div
                  key={slideIndex}
                  className={`min-w-full grid ${visibleCount === 1 ? 'grid-cols-1' : visibleCount === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-6 px-1 py-2`}
                  aria-hidden={activeSlide !== slideIndex}
                >
                  {slide.map((t) => (
                    <div
                      key={t.id}
                      className="group relative glass rounded-3xl p-8 flex flex-col justify-between h-full transition-all duration-500 hover:-translate-y-1.5 overflow-hidden"
                    >
                      <div
                        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
                        style={{
                          boxShadow: `inset 0 0 25px ${primary}25, 0 15px 35px -5px ${primary}35`,
                          border: `1px solid ${primary}50`,
                        }}
                      />
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" 
                        style={{ background: `radial-gradient(circle at center top, ${accent}15, transparent 75%)` }}
                      />
                      <div className="relative z-20">
                        <Quote className="absolute top-0 right-0 w-10 h-10 opacity-10" style={{ color: primary }} />
                        <div className="flex gap-1 mb-4">
                          {Array.from({ length: t.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4" style={{ color: primary }} fill="currentColor" />
                          ))}
                        </div>
                        <p className="text-gray-200 text-base leading-relaxed mb-6">"{t.quote}"</p>
                      </div>
                      <div className="relative z-20 flex items-center gap-4 mt-auto pt-4 border-t border-white/10">
                        {t.avatar_url ? (
                          <img
                            src={t.avatar_url}
                            alt={t.client_name}
                            className="w-11 h-11 rounded-full object-cover shrink-0"
                            loading="lazy"
                          />
                        ) : (
                          <div
                            className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                            style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}
                          >
                            {t.client_name.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-semibold text-white truncate">{t.client_name}</div>
                          <div className="text-xs text-gray-400 truncate">{t.company}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {slideCount > 1 && (
            <div className="mt-8 flex justify-center gap-2" role="group" aria-label="Choose testimonial slide">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to testimonial slide ${index + 1}`}
                  aria-current={activeSlide === index ? 'true' : undefined}
                  className="h-2.5 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer"
                  style={{
                    width: activeSlide === index ? '2rem' : '0.625rem',
                    backgroundColor: activeSlide === index ? primary : 'rgba(255,255,255,0.25)',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- */
/* CTA Section                                                        */
/* ----------------------------------------------------------------- */

function CtaSection({
  hf,
  primary,
  accent,
  navigate,
}: {
  hf: string;
  primary: string;
  accent: string;
  navigate: (to: string) => void;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section className="py-24 relative">
      <div className="max-w-4xl mx-auto px-6">
        <div
          ref={ref}
          className={`reveal ${visible ? 'is-visible' : ''} group relative glass rounded-3xl p-12 md:p-16 text-center overflow-hidden transition-all duration-500 hover:-translate-y-1.5`}
        >
          <div
            className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
            style={{
              boxShadow: `inset 0 0 30px ${primary}25, 0 20px 40px -10px ${primary}35`,
              border: `1px solid ${primary}50`,
            }}
          />

          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" 
            style={{ background: `radial-gradient(circle at center, ${accent}15, transparent 75%)` }}
          />

          <div className="absolute top-0 left-0 w-64 h-64 rounded-full blur-[80px]" style={{ background: `${primary}30` }} />
          <div
            className="absolute bottom-0 right-0 w-64 h-64 rounded-full blur-[80px]"
            style={{ background: `${accent}30` }}
          />

          <div className="relative z-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: hf }}>
              Ready to Build Something{' '}
              <span
                style={{
                  background: `linear-gradient(135deg, ${primary}, ${accent})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Amazing?
              </span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
              Let's turn your vision into reality. Our team is ready to help you create digital experiences that stand out.
            </p>
            <button
              onClick={() => navigate('/contact')}
              className="px-8 py-4 font-semibold text-white bg-[#f97316] rounded-xl hover:bg-transparent transition-all duration-300 cursor-pointer shadow-lg"
              style={{ boxShadow: '0 10px 25px -5px rgba(249, 115, 22, 0.4)' }}
            >
              Get in Touch
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- */
/* Contact & Testimonial Review Form Section                        */
/* ----------------------------------------------------------------- */

function HomeContactSection({
  hf,
  primary,
  accent,
  settings,
}: {
  hf: string;
  primary: string;
  accent: string;
  settings: ReturnType<typeof useTheme>['settings'];
}) {
  const [formType, setFormType] = useState<'contact' | 'review'>('contact');
  
  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: 'Project inquiry',
    message: '',
  });
  const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  // Review Form State
  const [reviewForm, setReviewForm] = useState({
    client_name: '',
    company: '',
    quote: '',
    rating: 5,
  });
  const [reviewStatus, setReviewStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const contactDetails: { icon: typeof Mail; label: string; value: string; href: string | null }[] = [];
  const email = settings?.contact_email?.trim();
  const phone = settings?.contact_phone?.trim();
  const address = settings?.contact_address?.trim();

  if (email) contactDetails.push({ icon: Mail, label: 'Email', value: email, href: `mailto:${email}` });
  if (phone) {
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    contactDetails.push({
      icon: Phone,
      label: 'Phone',
      value: phone,
      href: `tel:${cleanPhone}`,
    });
    // WhatsApp Contact Item
    contactDetails.push({
      icon: MessageSquare,
      label: 'WhatsApp',
      value: phone,
      href: `https://wa.me/${cleanPhone.replace('+', '')}`,
    });
  }
  if (address) contactDetails.push({ icon: MapPin, label: 'Address', value: address, href: null });

  const handleContactSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setContactStatus('sending');
    const { error } = await supabase.from('contact_messages').insert(contactForm);

    if (error) {
      console.error('Failed to send contact message:', error);
      setContactStatus('error');
      return;
    }

    setContactForm({ name: '', email: '', subject: 'Project inquiry', message: '' });
    setContactStatus('sent');
  };

  const handleReviewSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setReviewStatus('sending');
    const { error } = await supabase.from('testimonials').insert({
      client_name: reviewForm.client_name,
      company: reviewForm.company,
      quote: reviewForm.quote,
      rating: reviewForm.rating,
      published: true,
      sort_order: 99,
    });

    if (error) {
      console.error('Failed to submit review:', error);
      setReviewStatus('error');
      return;
    }

    setReviewForm({ client_name: '', company: '', quote: '', rating: 5 });
    setReviewStatus('sent');
  };

  return (
    <section className="py-24 relative" aria-labelledby="home-contact-heading">
      <div className="w-full px-8 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 items-start">
          
          {/* Left Info Column */}
          <div className="flex flex-col gap-6">
            <div>
              <h2 id="home-contact-heading" className="text-4xl md:text-5xl font-bold text-white mb-5" style={{ fontFamily: hf }}>
                {formType === 'contact' ? 'Contact Us' : 'Leave a Review'}
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
                {formType === 'contact'
                  ? "Have a project in mind or feedback to share? Send us a message and our team will be in touch."
                  : "Loved working with us? Share your experience and get featured on our client testimonials wall!"}
              </p>
            </div>

            {contactDetails.length > 0 && (
              <address className="group relative glass rounded-2xl p-6 md:p-8 transition-all duration-500 hover:-translate-y-1.5 not-italic overflow-hidden">
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    boxShadow: `inset 0 0 20px ${primary}30, 0 10px 30px -5px ${primary}40`,
                    border: `1px solid ${primary}60`,
                  }}
                />
                <div className="relative z-10">
                  <h3 className="text-sm font-semibold mb-5 tracking-wide uppercase" style={{ color: primary }}>
                    Company Contact Details
                  </h3>
                  <ul className="space-y-4">
                    {contactDetails.map(({ icon: Icon, label, value, href }) => (
                      <li key={label} className="flex items-start gap-4 text-sm group/item">
                        <div
                          className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover/item:scale-110 shadow-md"
                          style={{ background: `linear-gradient(135deg, ${primary}25, ${accent}15)` }}
                        >
                          <Icon className="h-4 w-4" style={{ color: primary }} aria-hidden="true" />
                        </div>
                        <div className="min-w-0 pt-1">
                          <span className="block text-xs text-gray-400">{label}</span>
                          {href ? (
                            <a
                              href={href}
                              target={label === 'WhatsApp' ? '_blank' : undefined}
                              rel={label === 'WhatsApp' ? 'noopener noreferrer' : undefined}
                              className="break-words text-gray-200 font-medium transition-colors hover:text-white"
                            >
                              {value} {label === 'WhatsApp' && <span className="text-xs text-green-400 ml-1">(Chat)</span>}
                            </a>
                          ) : (
                            <span className="text-gray-200 font-medium">{value}</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </address>
            )}
            <SocialLinks className="mt-2" />
          </div>

          {/* Right Column: Toggle + Forms */}
          <div className="group relative glass rounded-2xl p-6 md:p-8 transition-all duration-500 hover:-translate-y-1.5 overflow-hidden">
            
            {/* Form Type Switcher Toggle */}
            <div className="relative z-10 flex p-1.5 bg-black/40 rounded-xl border border-white/10 mb-6">
              <button
                type="button"
                onClick={() => setFormType('contact')}
                className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  formType === 'contact' ? 'text-white shadow-lg' : 'text-gray-400 hover:text-white'
                }`}
                style={{ background: formType === 'contact' ? `linear-gradient(135deg, ${primary}, ${accent})` : 'transparent' }}
              >
                <MessageSquare className="w-4 h-4" /> Send Message
              </button>
              <button
                type="button"
                onClick={() => setFormType('review')}
                className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  formType === 'review' ? 'text-white shadow-lg' : 'text-gray-400 hover:text-white'
                }`}
                style={{ background: formType === 'review' ? `linear-gradient(135deg, ${primary}, ${accent})` : 'transparent' }}
              >
                <Star className="w-4 h-4" /> Submit Review
              </button>
            </div>

            {/* Contact Form */}
            {formType === 'contact' ? (
              <form onSubmit={handleContactSubmit} className="relative z-10 space-y-5 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="home-contact-name" className="block text-sm text-gray-400 mb-2">Name</label>
                    <input
                      id="home-contact-name"
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus-visible:ring-2"
                      style={{ outlineColor: primary }}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="home-contact-email" className="block text-sm text-gray-400 mb-2">Email</label>
                    <input
                      id="home-contact-email"
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus-visible:ring-2"
                      style={{ outlineColor: primary }}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="home-contact-message" className="block text-sm text-gray-400 mb-2">Message</label>
                  <textarea
                    id="home-contact-message"
                    required
                    rows={5}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus-visible:ring-2"
                    style={{ outlineColor: primary }}
                    placeholder="Write your message..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={contactStatus === 'sending'}
                  className="w-full px-6 py-4 font-semibold text-white rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}
                >
                  {contactStatus === 'sending' ? 'Sending...' : contactStatus === 'sent' ? 'Message sent' : 'Send message'}
                  <Send className="w-4 h-4" />
                </button>
                {contactStatus === 'sent' && <p className="text-green-400 text-sm text-center">Message sent successfully!</p>}
              </form>
            ) : (
              /* Testimonial Review Form */
              <form onSubmit={handleReviewSubmit} className="relative z-10 space-y-5 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="review-name" className="block text-sm text-gray-400 mb-2">Your Name</label>
                    <input
                      id="review-name"
                      type="text"
                      required
                      value={reviewForm.client_name}
                      onChange={(e) => setReviewForm({ ...reviewForm, client_name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus-visible:ring-2"
                      style={{ outlineColor: primary }}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="review-company" className="block text-sm text-gray-400 mb-2">Company / Title</label>
                    <input
                      id="review-company"
                      type="text"
                      value={reviewForm.company}
                      onChange={(e) => setReviewForm({ ...reviewForm, company: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus-visible:ring-2"
                      style={{ outlineColor: primary }}
                      placeholder="Acme Inc."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="p-1 cursor-pointer focus:outline-none"
                      >
                        <Star
                          className="w-6 h-6 transition-colors"
                          style={{ color: star <= reviewForm.rating ? primary : 'rgba(255,255,255,0.2)' }}
                          fill={star <= reviewForm.rating ? 'currentColor' : 'none'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="review-quote" className="block text-sm text-gray-400 mb-2">Your Review</label>
                  <textarea
                    id="review-quote"
                    required
                    rows={4}
                    value={reviewForm.quote}
                    onChange={(e) => setReviewForm({ ...reviewForm, quote: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus-visible:ring-2"
                    style={{ outlineColor: primary }}
                    placeholder="Describe your experience working with us..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={reviewStatus === 'sending'}
                  className="w-full px-6 py-4 font-semibold text-white rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}
                >
                  {reviewStatus === 'sending' ? 'Submitting...' : reviewStatus === 'sent' ? 'Review Submitted!' : 'Submit Review'}
                  <Star className="w-4 h-4" />
                </button>
                {reviewStatus === 'sent' && <p className="text-green-400 text-sm text-center">Thank you for your feedback!</p>}
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}