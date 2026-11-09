import { useState, useEffect } from 'react';
import { supabase, type Service } from '@/lib/supabase';
import { useTheme } from '@/lib/theme';
import { usePageContent } from '@/lib/pageContent';
import { PageHero } from '@/components/PageHero';
import * as Icons from 'lucide-react';
import { Check, ArrowRight } from 'lucide-react';
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

  return (
    <div style={{ backgroundColor: bg }}>
      <PageHero pageKey="services" defaultTitle="Our Services" defaultSubtitle="We offer a full spectrum of digital services to help your business thrive in the modern landscape." gradientWord="Services" />

      <div className="w-full px-8 md:px-12 lg:px-20 pb-20">
        {sectionImage && (
          <div className="rounded-2xl overflow-hidden h-64 md:h-80 mb-12">
            <img src={sectionImage} alt="Our services" className="w-full h-full object-cover" loading="lazy" />
          </div>
        )}

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
            className="group px-8 py-4 text-white font-semibold rounded-xl transition-all inline-flex items-center gap-2"
            style={{ background: `linear-gradient(to right, ${primary}, ${primary}dd)` }}
          >
            Start Your Project
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}