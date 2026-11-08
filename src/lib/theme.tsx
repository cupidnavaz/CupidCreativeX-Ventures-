import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { isSupabaseConfigured, supabase, type SiteSettings } from './supabase';

type ThemeContextType = {
  settings: SiteSettings | null;
  loading: boolean;
  reload: () => Promise<void>;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const DEFAULT_SETTINGS: Partial<SiteSettings> = {
  logo_url: '',
  logo_icon: 'Heart',
  color_primary: '#f97316',
  color_accent: '#06b6d4',
  color_bg: '#0a0a0f',
  font_heading: 'Space Grotesk',
  font_body: 'Inter',
  brand_name: 'CupidCreativeX',
};

function applyTheme(s: SiteSettings | null) {
  const merged = { ...DEFAULT_SETTINGS, ...(s || {}) } as SiteSettings;
  const root = document.documentElement;

  root.style.setProperty('--color-primary', merged.color_primary);
  root.style.setProperty('--color-accent', merged.color_accent);
  root.style.setProperty('--color-bg', merged.color_bg);

  root.style.setProperty('--font-heading', merged.font_heading);
  root.style.setProperty('--font-body', merged.font_body);

  root.style.setProperty('background-color', merged.color_bg);

  const bodyFont = merged.font_body;
  const headingFont = merged.font_heading;
  document.body.style.fontFamily = `'${bodyFont}', system-ui, sans-serif`;

  const headingEls = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headingEls.forEach((el) => {
    (el as HTMLElement).style.fontFamily = `'${headingFont}', sans-serif`;
  });

  const linkId = 'google-fonts-link';
  let link = document.getElementById(linkId) as HTMLLinkElement | null;
  const families = [bodyFont, headingFont]
    .filter((f, i, arr) => arr.indexOf(f) === i)
    .map((f) => f.replace(/ /g, '+'))
    .join('&family=');
  const href = `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
  if (!link) {
    link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  link.href = href;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!isSupabaseConfigured) {
      setSettings(null);
      setLoading(false);
      return;
    }

    const { data } = await supabase.from('site_settings').select('*').maybeSingle();
    setSettings(data as SiteSettings | null);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    applyTheme(settings);
  }, [settings]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a0f' }}>
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: '#f97316', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ settings, loading, reload: load }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
