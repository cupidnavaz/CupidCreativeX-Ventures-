import { useState, useEffect } from 'react';
import { supabase, type TeamMember } from '@/lib/supabase';
import { useTheme } from '@/lib/theme';
import { usePageContent } from '@/lib/pageContent';
import { Twitter, Linkedin, Github, Sparkles } from 'lucide-react';

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const { settings } = useTheme();
  const { content } = usePageContent('team');

  const primary = settings?.color_primary || '#f97316';
  const accent = settings?.color_accent || '#06b6d4';
  const bg = settings?.color_bg || '#0a0a0f';
  const headingFont = settings?.font_heading || 'Space Grotesk';
  const hf = `'${headingFont}', sans-serif`;

  useEffect(() => {
    supabase.from('team_members').select('*').eq('published', true).order('sort_order').then(({ data }) => setMembers(data || []));
  }, []);

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
                  <span className="text-sm text-gray-400">Our Experts</span>
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
                    Team
                  </span>
                </h1>
                <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                  {content?.subtitle || `Meet the talented people behind [CupidCreativeX Ventures](https://www.instagram.com/cupidcreativex/).`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members Section */}
      <div className="w-full px-8 md:px-12 lg:px-20 pb-20">
        {/* Full-Width Glass Heading Container with Orange Underline */}
        <div className="w-full relative mb-16 rounded-2xl glass px-8 py-8 text-center backdrop-blur-xl border border-white/10">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight pb-3 inline-block relative" style={{ fontFamily: hf }}>
            Our Team Of Experts
            <span 
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full"
              style={{ 
                background: primary,
                boxShadow: `0 0 12px ${primary}` 
              }}
            />
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <div key={member.id} className="glass glass-hover rounded-2xl overflow-hidden group">
              <div className="aspect-square overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                {member.photo_url ? (
                  <img
                    src={member.photo_url}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-gray-700">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: hf }}>
                  {member.name}
                </h3>
                <p className="text-sm font-medium mb-3" style={{ color: primary }}>{member.role}</p>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{member.bio}</p>
                <div className="flex gap-3">
                  {member.twitter && (
                    <a href={member.twitter} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg glass glass-hover flex items-center justify-center text-gray-400 transition-colors" style={{ ['--hover-color' as string]: primary }}>
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg glass glass-hover flex items-center justify-center text-gray-400 transition-colors" style={{ ['--hover-color' as string]: accent }}>
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {member.github && (
                    <a href={member.github} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg glass glass-hover flex items-center justify-center text-gray-400 hover:text-white">
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}