import { useState, useEffect } from 'react';
import { supabase, type SiteSettings } from '@/lib/supabase';
import { useTheme } from '@/lib/theme';
import { Save, Check, Image, Palette, Type } from 'lucide-react';
import * as Icons from 'lucide-react';

const ICON_OPTIONS = ['Heart', 'Star', 'Zap', 'Code', 'Rocket', 'Globe', 'Sparkles', 'Award', 'Briefcase', 'PenTool', 'Camera', 'Music', 'Coffee', 'Flame', 'Sun', 'Moon', 'Cloud', 'Cpu'];

const FONT_OPTIONS = [
  'Inter', 'Space Grotesk', 'Poppins', 'Montserrat', 'Roboto', 'Open Sans', 'Lato',
  'Playfair Display', 'Merriweather', 'Source Code Pro', 'Raleway', 'Nunito',
  'DM Sans', 'Manrope', 'Outfit', 'Sora', 'Alice',
];

export default function AdminSettings() {
  const { reload } = useTheme();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const primary = settings?.color_primary || '#f97316';
  const accent = settings?.color_accent || '#06b6d4';
  const headingFont = settings?.font_heading || 'Space Grotesk';

  useEffect(() => {
    supabase.from('site_settings').select('*').maybeSingle().then(({ data }) => setSettings(data as SiteSettings | null));
  }, []);

  const update = (field: keyof SiteSettings, value: string | number) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    await supabase.from('site_settings').update({
      brand_name: settings.brand_name,
      hero_title: settings.hero_title,
      hero_subtitle: settings.hero_subtitle,
      about_title: settings.about_title,
      about_text: settings.about_text,
      about_mission: settings.about_mission,
      contact_email: settings.contact_email,
      contact_phone: settings.contact_phone,
      contact_address: settings.contact_address,
      twitter_url: settings.twitter_url,
      linkedin_url: settings.linkedin_url,
      github_url: settings.github_url,
      instagram_url: settings.instagram_url,
      stat_projects: settings.stat_projects,
      stat_clients: settings.stat_clients,
      stat_team: settings.stat_team,
      stat_years: settings.stat_years,
      logo_url: settings.logo_url,
      logo_icon: settings.logo_icon,
      color_primary: settings.color_primary,
      color_accent: settings.color_accent,
      color_bg: settings.color_bg,
      font_heading: settings.font_heading,
      font_body: settings.font_body,
    }).eq('id', 1);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    reload();
  };

  if (!settings) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  const hf = `'${headingFont}', sans-serif`;

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: hf }}>Site Settings</h2>

      <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
        {/* Branding & Appearance */}
        <div className="glass rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5" style={{ color: primary }} />
            <h3 className="text-lg font-bold text-white" style={{ fontFamily: hf }}>Branding & Appearance</h3>
          </div>

          {/* Logo */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1 flex items-center gap-1"><Image className="w-3 h-3" /> Logo Image URL</label>
              <input type="url" value={settings.logo_url || ''} onChange={(e) => update('logo_url', e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" placeholder="Leave empty to use icon logo" />
              <p className="text-xs text-gray-500 mt-1">Upload your logo image and paste the URL here. If empty, the icon below is used.</p>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Logo Icon (when no image is set)</label>
              <div className="grid grid-cols-6 md:grid-cols-9 gap-2">
                {ICON_OPTIONS.map((ic) => {
                  const IconComp = (Icons as unknown as Record<string, Icons.LucideIcon>)[ic] || Icons.Heart;
                  const selected = settings.logo_icon === ic;
                  return (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => update('logo_icon', ic)}
                      className={`aspect-square rounded-lg flex items-center justify-center transition-all ${selected ? 'border-2' : 'glass glass-hover'}`}
                      style={selected ? { borderColor: primary, background: `${primary}20` } : undefined}
                    >
                      <IconComp className="w-5 h-5" style={selected ? { color: primary } : { color: '#9ca3af' }} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Logo Preview */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Preview</label>
              <div className="glass rounded-lg p-4 flex items-center gap-3 border border-white/10">
                {settings.logo_url ? (
                  <img src={settings.logo_url} alt="Logo" className="w-10 h-10 rounded-xl object-contain" />
                ) : (
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md" style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}>
                    {(() => {
                      const IconComp = (Icons as unknown as Record<string, Icons.LucideIcon>)[settings.logo_icon || 'Heart'] || Icons.Heart;
                      return <IconComp className="w-5 h-5 text-white" />;
                    })()}
                  </div>
                )}
                <span className="font-bold text-lg text-white" style={{ fontFamily: hf }}>{settings.brand_name}</span>
              </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Primary Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={settings.color_primary} onChange={(e) => update('color_primary', e.target.value)} className="w-12 h-10 rounded-lg bg-transparent border border-white/10 cursor-pointer" />
                  <input type="text" value={settings.color_primary} onChange={(e) => update('color_primary', e.target.value)} className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500/50" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Accent Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={settings.color_accent} onChange={(e) => update('color_accent', e.target.value)} className="w-12 h-10 rounded-lg bg-transparent border border-white/10 cursor-pointer" />
                  <input type="text" value={settings.color_accent} onChange={(e) => update('color_accent', e.target.value)} className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500/50" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Background Color</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={settings.color_bg} onChange={(e) => update('color_bg', e.target.value)} className="w-12 h-10 rounded-lg bg-transparent border border-white/10 cursor-pointer" />
                  <input type="text" value={settings.color_bg} onChange={(e) => update('color_bg', e.target.value)} className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500/50" />
                </div>
              </div>
            </div>

            {/* Fonts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-sm text-gray-400 mb-1 flex items-center gap-1"><Type className="w-3 h-3" /> Heading Font</label>
                <select value={settings.font_heading} onChange={(e) => update('font_heading', e.target.value)} className="w-full px-4 py-2.5 bg-gray-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50">
                  {FONT_OPTIONS.map((f) => <option key={f} value={f} style={{ fontFamily: `'${f}', sans-serif`, background: '#1a1a2e' }}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1 flex items-center gap-1"><Type className="w-3 h-3" /> Body Font</label>
                <select value={settings.font_body} onChange={(e) => update('font_body', e.target.value)} className="w-full px-4 py-2.5 bg-gray-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50">
                  {FONT_OPTIONS.map((f) => <option key={f} value={f} style={{ fontFamily: `'${f}', sans-serif`, background: '#1a1a2e' }}>{f}</option>)}
                </select>
              </div>
            </div>

            {/* Font Preview */}
            <div className="glass rounded-lg p-4 border border-white/10">
              <div className="text-xl font-bold text-white mb-1" style={{ fontFamily: `'${settings.font_heading}', sans-serif` }}>Heading Preview — {settings.font_heading}</div>
              <div className="text-sm text-gray-400" style={{ fontFamily: `'${settings.font_body}', sans-serif` }}>Body text preview in {settings.font_body}. The quick brown fox jumps over the lazy dog.</div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="glass rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: hf }}>Hero Section</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Brand Name</label>
              <input type="text" value={settings.brand_name} onChange={(e) => update('brand_name', e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Hero Title</label>
              <input type="text" value={settings.hero_title} onChange={(e) => update('hero_title', e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Hero Subtitle</label>
              <textarea value={settings.hero_subtitle} onChange={(e) => update('hero_subtitle', e.target.value)} rows={2} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50 resize-none" />
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="glass rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: hf }}>About Section</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">About Title</label>
              <input type="text" value={settings.about_title} onChange={(e) => update('about_title', e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">About Text</label>
              <textarea value={settings.about_text} onChange={(e) => update('about_text', e.target.value)} rows={3} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50 resize-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Mission Statement</label>
              <textarea value={settings.about_mission} onChange={(e) => update('about_mission', e.target.value)} rows={2} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50 resize-none" />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="glass rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: hf }}>Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input type="email" value={settings.contact_email} onChange={(e) => update('contact_email', e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Phone</label>
              <input type="text" value={settings.contact_phone} onChange={(e) => update('contact_phone', e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">Address</label>
              <input type="text" value={settings.contact_address} onChange={(e) => update('contact_address', e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="glass rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: hf }}>Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Twitter</label>
              <input type="url" value={settings.twitter_url} onChange={(e) => update('twitter_url', e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">LinkedIn</label>
              <input type="url" value={settings.linkedin_url} onChange={(e) => update('linkedin_url', e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">GitHub</label>
              <input type="url" value={settings.github_url} onChange={(e) => update('github_url', e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Instagram</label>
              <input type="url" value={settings.instagram_url} onChange={(e) => update('instagram_url', e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="glass rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: hf }}>Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Projects</label>
              <input type="number" value={settings.stat_projects} onChange={(e) => update('stat_projects', Number(e.target.value))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Clients</label>
              <input type="number" value={settings.stat_clients} onChange={(e) => update('stat_clients', Number(e.target.value))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Team</label>
              <input type="number" value={settings.stat_team} onChange={(e) => update('stat_team', Number(e.target.value))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Years</label>
              <input type="number" value={settings.stat_years} onChange={(e) => update('stat_years', Number(e.target.value))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button type="submit" disabled={saving} className="px-6 py-3 text-white font-semibold rounded-lg flex items-center gap-2 disabled:opacity-50 transition-all shadow-lg shadow-orange-500/20 hover:brightness-110" style={{ background: `linear-gradient(to right, ${primary}, ${primary}dd)` }}>
            {saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Settings</>}
          </button>
          {saved && (
            <span className="text-green-400 text-sm flex items-center gap-1 font-medium">
              <Check className="w-4 h-4" /> Saved successfully
            </span>
          )}
        </div>
      </form>
    </div>
  );
}