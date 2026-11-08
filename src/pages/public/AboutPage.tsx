import { useState, useEffect } from 'react';
import { supabase, type SiteSettings } from '@/lib/supabase';
import { useTheme } from '@/lib/theme';
import { usePageContent } from '@/lib/pageContent';
import { PageHero } from '@/components/PageHero';
import { ParallaxImage } from '@/components/public/ParallaxImage';
import { Award, Users, Sparkles, Clock, Target, Eye, Heart } from 'lucide-react';

export default function AboutPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const { settings: theme } = useTheme();
  const { content } = usePageContent('about');

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

  return (
    <div style={{ backgroundColor: bg }}>
      <PageHero pageKey="about" defaultTitle="About Us" defaultSubtitle={settings?.about_text || 'We are a team of passionate designers, developers, and strategists dedicated to helping businesses thrive in the digital age.'} />

      <div className="w-full px-8 md:px-12 lg:px-20 pb-20">
        {sectionImage && (
          <div className="relative rounded-2xl overflow-hidden h-64 md:h-80 mb-12">
            <ParallaxImage src={sectionImage} alt="About our company" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        )}

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

        <div className="glass rounded-3xl p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="text-center">
                  <div className="w-14 h-14 rounded-xl border border-white/10 flex items-center justify-center mx-auto mb-4" style={{ background: `linear-gradient(135deg, ${primary}20, ${accent}10)` }}>
                    <Icon className="w-7 h-7" style={{ color: primary }} />
                  </div>
                  <div className="text-4xl font-bold text-white mb-1" style={{ fontFamily: hf }}>
                    {stat.value}+
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
