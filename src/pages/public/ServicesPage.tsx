import { useState, useEffect } from 'react';
import { supabase, type Service } from '@/lib/supabase';
import { useTheme } from '@/lib/theme';
import { usePageContent } from '@/lib/pageContent';
import * as Icons from 'lucide-react';
import { Check, ArrowRight, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { useRouter } from '@/lib/router';

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
  const sectionImage = content?.section_services_image || '';

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

  return (
    <div style={{ backgroundColor: bg }}>
      {/* Full-Width Centered Banner Section Below Navbar */}
      <section className="relative pt-32 pb-20 overflow-hidden text-center">
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] rounded-full blur-[140px] opacity-25 pointer-events-none"
          style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}
        />
        <div className="relative w-full px-8 md:px-12 lg:px-20 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6">
            <Sparkles className="w-4 h-4" style={{ color: primary }} />
            <span className="text-sm text-gray-400">Professional Solutions</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6" style={{ fontFamily: hf }}>
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
          <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            {content?.subtitle || 'We offer a full spectrum of digital services to help your business thrive in the modern landscape.'}
          </p>
        </div>
      </section>

      {/* Animated Client Logo Marquee with Zoom & Glow Hover Effects */}
      <div className="marquee-track relative isolate py-6 overflow-hidden mb-16">
        <div className="marquee-content flex gap-12 animate-marquee whitespace-nowrap items-center">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500 flex items-center gap-12 transition-all duration-300 hover:scale-90 hover:text-white cursor-pointer"
              style={{
                textShadow: 'none',
              }}
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

      {/* Text and Image Container (Text on Left, Image on Right) */}
      <section className="w-full px-8 md:px-12 lg:px-20 mb-24">
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

          {/* Right Image Container */}
          <div className="relative group rounded-3xl p-[2px] overflow-hidden">
            <div
              className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-border-rotate pointer-events-none"
              style={{
                background: `linear-gradient(60deg, ${primary}, ${accent}, #a855f7, ${primary})`,
              }}
            />
            <div className="relative glass rounded-[22px] overflow-hidden aspect-[4/3] bg-gray-950/80 border border-white/10 shadow-2xl">
              {sectionImage ? (
                <img
                  src={sectionImage}
                  alt="Our services overview"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full items-center justify-center p-8 text-center text-gray-500 font-medium">
                  Professional Solutions Overview
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

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
                {/* Multi-color Rotating Border Background on Hover */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-border-rotate"
                  style={{
                    background: `linear-gradient(60deg, ${primary}, ${accent}, #a855f7, ${primary})`,
                  }}
                />

                {/* Inner Card Container */}
                <div className="relative glass rounded-[15px] overflow-hidden flex flex-col justify-end p-8 min-h-[34rem] bg-[#0a0a0f]/90 h-full">
                  {/* Background Image with Zoom Out on Hover */}
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

                  {/* Content Container */}
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