import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import * as Icons from 'lucide-react';
import { isSupabaseConfigured, supabase, type SocialLink } from '@/lib/supabase';

const SOCIAL_ICON_MAP: Record<string, Icons.LucideIcon> = {
  Twitter: Icons.Twitter,
  Facebook: Icons.Facebook,
  Instagram: Icons.Instagram,
  Linkedin: Icons.Linkedin,
  Github: Icons.Github,
  Youtube: Icons.Youtube,
  Music2: Icons.Music2,
  Dribbble: Icons.Dribbble,
  Figma: Icons.Figma,
  Image: Icons.Image,
  MessageCircle: Icons.MessageCircle,
  BookOpen: Icons.BookOpen,
};

const SocialLinksContext = createContext<SocialLink[]>([]);

export function SocialLinksProvider({ children }: { children: ReactNode }) {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase
      .from('social_links')
      .select('*')
      .eq('published', true)
      .order('sort_order')
      .then(({ data, error }) => {
        if (error) {
          console.error('Failed to load social links:', error);
          return;
        }
        setSocialLinks(data || []);
      });
  }, []);

  return (
    <SocialLinksContext.Provider value={socialLinks}>
      {children}
    </SocialLinksContext.Provider>
  );
}

export function useSocialLinks() {
  return useContext(SocialLinksContext);
}

export function SocialLinks({ className = '' }: { className?: string }) {
  const socialLinks = useSocialLinks();

  if (socialLinks.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <span className="text-sm text-gray-400">Follow us</span>
      <div className="flex items-center gap-2">
        {socialLinks.map((link) => {
          const Icon = SOCIAL_ICON_MAP[link.icon] || SOCIAL_ICON_MAP[link.platform] || Icons.Share2;
          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.platform}
              title={link.platform}
              className="w-10 h-10 rounded-full border border-white/10 text-gray-400 hover:text-[#f97316] hover:border-[#f97316]/50 flex items-center justify-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316]"
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
            </a>
          );
        })}
      </div>
    </div>
  );
}