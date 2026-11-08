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
} from 'lucide-react';
import { ProjectOverviewModal } from '@/components/public/ProjectOverviewModal';
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
        supabase.from('testimonials').select('*').eq('published', true).order('sort_order').limit(5),
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
    <div style={{ backgroundColor: bg }}>
      <Hero
        settings={settings}
        hf={hf}
        primary={primary}
        accent={accent}
        bg={bg}
        heroSlides={heroSlides}
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
  stats,
  navigate,
}: {
  settings: ReturnType<typeof useTheme>['settings'];
  hf: string;
  primary: string;
  accent: string;
  bg: string;
  heroSlides: { src: string; alt: string }[];
  stats: { value: number; label: string; icon: typeof Award; suffix: string }[];
  navigate: (to: string) => void;
}) {
  return (
    <section className="relative min-h-screen flex flex-col items-center overflow-hidden lg:flex-row">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div
        className="absolute top-1/4 -left-32 w-[28rem] h-[28rem] rounded-full blur-[120px] animate-pulse-slow"
        style={{ background: `${primary}30` }}
      />
      <div
        className="absolute bottom-1/4 -right-32 w-[28rem] h-[28rem] rounded-full blur-[120px] animate-pulse-slow"
        style={{ background: `${accent}30`, animationDelay: '1s' }}
      />

      <div className={`relative w-full px-8 md:px-12 lg:px-20 pt-32 pb-12 lg:pb-40 ${heroSlides.length ? '' : 'min-h-screen flex items-center'}`}>
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
                onClick={() => navigate('/contact')}
                className="group relative px-8 py-4 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 overflow-hidden animate-gradient-x"
                style={{ background: `linear-gradient(110deg, ${primary}, ${accent}, ${primary})` }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Your Project
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="absolute inset-0 animate-shimmer" />
              </button>
              <button
                onClick={() => navigate('/portfolio')}
                className="px-8 py-4 glass glass-hover text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                View Our Work
                <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>
            <SocialLinks className="mt-8 animate-fade-up" />
          </div>
          {heroSlides.length > 0 && (
            <div className="hero-image-shell relative mx-auto w-full max-w-xl lg:ml-auto">
              <div
                className="absolute -inset-4 rounded-[2rem] blur-2xl opacity-20"
                style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}
              />
              <HeroImageCarousel slides={heroSlides} bg={bg} />
            </div>
          )}
        </div>
      </div>

      {/* Stats bar with animated counters */}
      <div className="relative w-full border-t border-white/5 glass lg:absolute lg:bottom-0 lg:left-0 lg:right-0">
        <div className="w-full px-8 md:px-12 lg:px-20 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
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
    <div ref={ref} className="flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center flex-shrink-0"
        style={{ background: `linear-gradient(135deg, ${primary}20, ${accent}10)` }}
      >
        <Icon className={`w-6 h-6 ${visible ? 'counter-icon-enter' : ''}`} style={{ color: primary }} />
      </div>
      <div>
        <div
          className={`text-3xl font-bold text-white tabular-nums ${visible ? 'counter-value-enter' : ''}`}
          style={{ fontFamily: hf }}
        >
          {count}{suffix}
        </div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
    </div>
  );
}

function HeroImageCarousel({
  slides,
  bg,
}: {
  slides: { src: string; alt: string }[];
  bg: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const [reducedMotion, setReducedMotion] = useState(false);
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
    if (slides.length < 2 || paused || !inView || !pageVisible || reducedMotion) return;
    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(interval);
  }, [slides.length, paused, inView, pageVisible, reducedMotion]);

  useEffect(() => {
    setActiveIndex((index) => Math.min(index, Math.max(slides.length - 1, 0)));
  }, [slides.length]);

  const goTo = (index: number) => setActiveIndex((index + slides.length) % slides.length);
  const activeSlide = slides[activeIndex];
  const parallaxActive = !paused && inView && pageVisible && !reducedMotion;
  if (!activeSlide) return null;

  return (
    <div
      ref={carouselRef}
      role="region"
      aria-label="Featured work"
      aria-roledescription="carousel"
      className="hero-image-frame relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-white/10 shadow-2xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={(event) => setPaused(event.currentTarget.contains(document.activeElement))}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => setPaused(event.currentTarget.matches(':hover'))}
    >
      <img
        key={activeSlide.src}
        src={activeSlide.src}
        alt={activeSlide.alt}
        className={`hero-carousel-image absolute inset-0 h-full w-full object-cover ${parallaxActive ? 'is-playing' : ''}`}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: `linear-gradient(135deg, ${bg}25, transparent 55%, ${bg}55)` }}
      />
      {slides.length > 1 && (
        <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3">
          <div role="group" className="flex items-center gap-1.5" aria-label="Choose featured image">
            {slides.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                aria-label={`Show image ${index + 1} of ${slides.length}`}
                aria-pressed={index === activeIndex}
                onClick={() => goTo(index)}
                className={`h-2.5 rounded-full transition-[width,background-color] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
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
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white transition-colors hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next featured image"
              onClick={() => goTo(activeIndex + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white transition-colors hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
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
            <div className="rounded-2xl overflow-hidden h-48 lg:h-full border border-white/5">
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
      className={`reveal ${visible ? 'is-visible' : ''} card-tilt glass glass-hover rounded-2xl group cursor-pointer relative overflow-hidden`}
      style={{ transitionDelay: `${index * 0.08}s` }}
    >
      {/* hover glow */}
      <div
        className="absolute -top-16 -right-16 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `${primary}40` }}
      />
      {service.image_url && (
        <div className="h-40 overflow-hidden bg-gray-800">
          <img
            src={service.image_url}
            alt={service.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
        </div>
      )}
      <div className="relative p-8">
        <div
          className="w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500"
          style={{ background: `linear-gradient(135deg, ${primary}20, ${accent}10)` }}
        >
          <Icon className="w-7 h-7" style={{ color: primary }} />
        </div>
        <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: hf }}>
          {service.title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">{service.description}</p>
        <ul className="space-y-2 mb-6">
          {service.features.slice(0, 3).map((f, idx) => (
            <li key={idx} className="flex items-center gap-2 text-sm text-gray-500">
              <Check className="w-4 h-4 flex-shrink-0" style={{ color: accent }} />
              {f}
            </li>
          ))}
        </ul>
        <span
          className="inline-flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all"
          style={{ color: primary }}
        >
          Learn more <ArrowRight className="w-4 h-4" />
        </span>
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
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full blur-[140px] opacity-30"
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
          {/* connecting line */}
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
      className={`reveal ${visible ? 'is-visible' : ''} relative text-center`}
      style={{ transitionDelay: `${index * 0.12}s` }}
    >
      <div className="relative inline-flex mb-6">
        <div
          className="w-20 h-20 rounded-2xl border border-white/10 flex items-center justify-center mx-auto transition-transform duration-500 hover:scale-110"
          style={{ background: `linear-gradient(135deg, ${primary}25, ${accent}15)` }}
        >
          <Icon className="w-9 h-9" style={{ color: primary }} />
        </div>
        <span
          className="absolute -top-2 -right-2 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center text-white"
          style={{ background: accent }}
        >
          {index + 1}
        </span>
      </div>
      <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: hf }}>
        {step.title}
      </h3>
      <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
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
  const showPrevious = () => setActiveIndex((index) => (index - 1 + slides.length) % slides.length);
  const showNext = () => setActiveIndex((index) => (index + 1) % slides.length);

  return (
    <section className="py-24 relative">
      <div className="w-full px-8 md:px-12 lg:px-20">
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
              className="font-medium text-sm flex items-center gap-2 group"
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
                  className="w-10 h-10 rounded-full border border-white/10 text-white flex items-center justify-center hover:border-white/30 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  aria-label="Next projects"
                  className="w-10 h-10 rounded-full border border-white/10 text-white flex items-center justify-center hover:border-white/30 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
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
            <div className="overflow-hidden" role="region" aria-live="polite" aria-label="Featured project slides">
              <div
                className="flex transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
              >
                {slides.map((slide, slideIndex) => (
                  <div
                    key={slideIndex}
                    className={`min-w-full grid ${visibleCount === 1 ? 'grid-cols-1' : visibleCount === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-6 px-1 py-2`}
                    aria-hidden={activeSlide !== slideIndex}
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
                    className="h-2.5 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
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
    <article className="group relative w-full overflow-hidden rounded-2xl glass card-tilt">
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
        <div className="absolute bottom-4 left-4 right-4 hidden translate-y-2 flex-wrap gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 sm:flex">
          <button
            type="button"
            onClick={onPreview}
            tabIndex={tabIndex}
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-950 hover:bg-gray-200"
            aria-label={`Preview ${project.title}`}
          >
            <Eye className="h-4 w-4" /> Preview project
          </button>
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={tabIndex}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/30 bg-black/40 px-4 py-2 text-sm font-semibold text-white hover:bg-black/70"
              aria-label={`View ${project.title} live project`}
            >
              Live project <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
      <div className="p-6">
        <span className="text-xs font-medium uppercase tracking-wider" style={{ color: primary }}>
          {project.category}
        </span>
        <h3 className="text-lg font-bold text-white mt-2 mb-1" style={{ fontFamily: hf }}>
          {project.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>
        {project.tools_used?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4" aria-label="Tools used">
            {project.tools_used.map((tool) => (
              <span key={tool} className="px-2.5 py-1 rounded-full border border-white/10 text-xs text-gray-400">
                {tool}
              </span>
            ))}
          </div>
        )}
        <div className="mt-5 flex flex-wrap gap-3 sm:hidden">
          <button
            type="button"
            onClick={onPreview}
            tabIndex={tabIndex}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm font-semibold text-white"
            aria-label={`Preview ${project.title}`}
          >
            <Eye className="h-4 w-4" /> Preview project
          </button>
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={tabIndex}
              className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"
              style={{ color: primary }}
              aria-label={`View ${project.title} live project`}
            >
              Live project <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/* ----------------------------------------------------------------- */
/* About Preview                                                      */
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
  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      text: settings?.about_mission || 'To transform ideas into impactful digital solutions.',
    },
    {
      icon: Eye,
      title: 'Our Vision',
      text: 'To be the most trusted digital partner for businesses worldwide, known for innovation and excellence.',
    },
    {
      icon: Heart,
      title: 'Our Values',
      text: 'Integrity, creativity, and a relentless commitment to client success drive everything we do.',
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="w-full px-8 md:px-12 lg:px-20">
        <div
          ref={ref}
          className={`reveal ${visible ? 'is-visible' : ''}`}
        >
          <div className={`grid grid-cols-1 ${aboutImage ? 'md:grid-cols-2' : ''} gap-12 items-center`}>
            {aboutImage && (
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10">
                <img src={aboutImage} alt={`${settings?.brand_name || 'CupidCreativeX'} team and work`} className="w-full h-full object-cover" loading="lazy" />
                <div
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(135deg, ${primary}15, transparent 55%, ${accent}20)` }}
                />
              </div>
            )}
            <div className={aboutImage ? '' : 'max-w-3xl mx-auto'}>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: hf }}>
                {settings?.about_title || 'About Us'}
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                {settings?.about_text ||
                  'We are a team of passionate designers, developers, and strategists dedicated to helping businesses thrive in the digital age.'}
              </p>
              <button
                onClick={() => navigate('/about')}
                className="font-medium text-sm flex items-center gap-2 group"
                style={{ color: primary }}
              >
                Learn More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {values.map(({ icon: Icon, title, text }) => (
              <article key={title} className="glass glass-hover rounded-2xl p-8">
                <div
                  className="w-14 h-14 rounded-xl border border-white/10 flex items-center justify-center mb-6"
                  style={{ background: `linear-gradient(135deg, ${primary}20, ${accent}10)` }}
                >
                  <Icon className="w-7 h-7" style={{ color: primary }} aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: hf }}>{title}</h3>
                <p className="text-gray-400 leading-relaxed">{text}</p>
              </article>
            ))}
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
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const count = testimonials.length;
  const next = useCallback(() => setActive((p) => (p + 1) % Math.max(count, 1)), [count]);
  const prev = useCallback(() => setActive((p) => (p - 1 + count) % Math.max(count, 1)), [count]);

  useEffect(() => {
    if (paused || count <= 1) return;
    const id = setInterval(next, 5500);
    return () => clearInterval(id);
  }, [paused, next, count]);

  if (count === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-[120px]"
        style={{ background: `${primary}15` }}
      />
      <div className="max-w-5xl mx-auto px-6 relative">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-4">
            <Star className="w-4 h-4" style={{ color: primary }} />
            <span className="text-sm text-gray-400">Client Love</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: hf }}>
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

        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Track */}
          <div ref={trackRef} className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ transform: `translateX(-${active * 100}%)` }}
            >
              {testimonials.map((t) => (
                <div key={t.id} className="w-full flex-shrink-0 px-1">
                  <div className="glass glass-hover rounded-3xl p-8 md:p-12 relative">
                    <Quote className="absolute top-6 right-6 w-12 h-12 opacity-10" style={{ color: primary }} />
                    <div className="flex gap-1 mb-5">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="w-5 h-5" style={{ color: primary }} fill="currentColor" />
                      ))}
                    </div>
                    <p className="text-gray-200 text-lg md:text-xl leading-relaxed mb-8">"{t.quote}"</p>
                    <div className="flex items-center gap-4">
                      {t.avatar_url ? (
                        <img
                          src={t.avatar_url}
                          alt={t.client_name}
                          className="w-12 h-12 rounded-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}
                        >
                          {t.client_name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-white">{t.client_name}</div>
                        <div className="text-sm text-gray-500">{t.company}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          {count > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                onClick={prev}
                aria-label="Previous testimonial"
                className="w-11 h-11 rounded-full glass glass-hover flex items-center justify-center text-white transition-transform hover:scale-110"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: i === active ? 28 : 8,
                      background: i === active ? primary : 'rgba(255,255,255,0.15)',
                    }}
                  />
                ))}
              </div>
              <button
                onClick={next}
                aria-label="Next testimonial"
                className="w-11 h-11 rounded-full glass glass-hover flex items-center justify-center text-white transition-transform hover:scale-110"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- */
/* CTA                                                                */
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
          className={`reveal ${visible ? 'is-visible' : ''} relative glass rounded-3xl p-12 md:p-16 text-center overflow-hidden`}
        >
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full blur-[80px]" style={{ background: `${primary}30` }} />
          <div
            className="absolute bottom-0 right-0 w-64 h-64 rounded-full blur-[80px]"
            style={{ background: `${accent}30` }}
          />
          <div className="relative">
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
              Let's turn your vision into reality. Our team is ready to help you create digital experiences that stand
              out.
            </p>
            <button
              onClick={() => navigate('/contact')}
              className="group relative px-8 py-4 text-white font-semibold rounded-xl transition-all inline-flex items-center gap-2 overflow-hidden animate-gradient-x"
              style={{ background: `linear-gradient(110deg, ${primary}, ${accent}, ${primary})` }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Get in Touch
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="absolute inset-0 animate-shimmer" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

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
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'Project inquiry',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const contactDetails: { icon: typeof Mail; label: string; value: string; href: string | null }[] = [];
  const email = settings?.contact_email?.trim();
  const phone = settings?.contact_phone?.trim();
  const address = settings?.contact_address?.trim();

  if (email) contactDetails.push({ icon: Mail, label: 'Email', value: email, href: `mailto:${email}` });
  if (phone) {
    contactDetails.push({
      icon: Phone,
      label: 'Phone',
      value: phone,
      href: `tel:${phone.replace(/[^\d+]/g, '')}`,
    });
  }
  if (address) contactDetails.push({ icon: MapPin, label: 'Address', value: address, href: null });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('sending');
    const { error } = await supabase.from('contact_messages').insert(form);

    if (error) {
      console.error('Failed to send homepage contact message:', error);
      setStatus('error');
      return;
    }

    setForm({ name: '', email: '', subject: 'Project inquiry', message: '' });
    setStatus('sent');
  };

  return (
    <section className="py-24 relative" aria-labelledby="home-contact-heading">
      <div className="w-full px-8 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 items-start">
          <div>
            <h2 id="home-contact-heading" className="text-4xl md:text-5xl font-bold text-white mb-5" style={{ fontFamily: hf }}>
              Contact Us
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
              Have a project in mind or feedback to share? Send us a message and our team will be in touch.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Reviews and comments are sent privately to our team.
            </p>
            {contactDetails.length > 0 && (
              <address className="mt-8 not-italic">
                <h3 className="text-sm font-semibold text-white mb-4">Company contact details</h3>
                <ul className="space-y-4">
                  {contactDetails.map(({ icon: Icon, label, value, href }) => (
                    <li key={label} className="flex items-start gap-3 text-sm">
                      <Icon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: primary }} aria-hidden="true" />
                      <div className="min-w-0">
                        <span className="block text-xs text-gray-500">{label}</span>
                        {href ? (
                          <a href={href} className="break-words text-gray-300 transition-colors hover:text-white">
                            {value}
                          </a>
                        ) : (
                          <span className="text-gray-300">{value}</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </address>
            )}
            <SocialLinks className="mt-6" />
          </div>

          <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 md:p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="home-contact-name" className="block text-sm text-gray-400 mb-2">Name</label>
                <input
                  id="home-contact-name"
                  type="text"
                  autoComplete="name"
                  required
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
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
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus-visible:ring-2"
                  style={{ outlineColor: primary }}
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="home-contact-subject" className="block text-sm text-gray-400 mb-2">What would you like to share?</label>
              <select
                id="home-contact-subject"
                value={form.subject}
                onChange={(event) => setForm({ ...form, subject: event.target.value })}
                className="w-full px-4 py-3 bg-gray-950 border border-white/10 rounded-xl text-white focus:outline-none focus-visible:ring-2"
                style={{ outlineColor: primary }}
              >
                <option value="Project inquiry">Project inquiry</option>
                <option value="General question">General question</option>
                <option value="Review or comment">Review or comment</option>
              </select>
            </div>
            <div>
              <label htmlFor="home-contact-message" className="block text-sm text-gray-400 mb-2">Message</label>
              <textarea
                id="home-contact-message"
                required
                rows={5}
                value={form.message}
                onChange={(event) => setForm({ ...form, message: event.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus-visible:ring-2 resize-y"
                style={{ outlineColor: primary }}
                placeholder="Write your message, review, or comment..."
              />
            </div>
            <button
              type="submit"
              disabled={status === 'sending'}
              className="px-6 py-3.5 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              style={{ background: `linear-gradient(110deg, ${primary}, ${accent})` }}
            >
              {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Message sent' : 'Send message'}
              {status === 'sent' ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            </button>
            <div aria-live="polite">
              {status === 'error' && (
                <p className="text-red-400 text-sm">Your message could not be sent. Please try again.</p>
              )}
              {status === 'sent' && (
                <p className="text-green-400 text-sm">Thanks for reaching out. Your message has been received.</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
