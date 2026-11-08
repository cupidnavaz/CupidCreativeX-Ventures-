import { useState, useEffect } from 'react';
import { supabase, type TeamMember } from '@/lib/supabase';
import { useTheme } from '@/lib/theme';
import { PageHero } from '@/components/PageHero';
import { Twitter, Linkedin, Github } from 'lucide-react';

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const { settings } = useTheme();

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
      <PageHero pageKey="team" defaultTitle="Our Team" defaultSubtitle={`Meet the talented people behind ${settings?.brand_name || 'CupidCreativeX Ventures'}.`} gradientWord="Team" />

      <div className="w-full px-8 md:px-12 lg:px-20 pb-20">
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
