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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => {
            const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[service.icon] || Icons.Code;
            return (
              <div key={service.id} className="glass glass-hover rounded-2xl overflow-hidden group">
                {service.image_url && (
                  <div className="h-48 overflow-hidden bg-gray-800">
                    <img
                      src={service.image_url}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-8">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(135deg, ${primary}20, ${accent}10)` }}>
                      <Icon className="w-7 h-7" style={{ color: primary }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: hf }}>
                        {service.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed mb-4">{service.description}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {service.features.map((f, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                            <Check className="w-4 h-4 flex-shrink-0" style={{ color: accent }} />
                            {f}
                          </div>
                        ))}
                      </div>
                    </div>
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
