import { useState, useEffect } from 'react';
import { supabase, type SiteSettings } from '@/lib/supabase';
import { useTheme } from '@/lib/theme';
import { usePageContent } from '@/lib/pageContent';
import { PageHero } from '@/components/PageHero';
import { SocialLinks } from '@/components/public/SocialLinks';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';

export default function ContactPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const { settings: theme } = useTheme();
  const { content } = usePageContent('contact');
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const primary = theme?.color_primary || '#f97316';
  const accent = theme?.color_accent || '#06b6d4';
  const bg = theme?.color_bg || '#0a0a0f';
  const headingFont = theme?.font_heading || 'Space Grotesk';
  const hf = `'${headingFont}', sans-serif`;
  const sectionImage = content?.section_contact_image || '';

  useEffect(() => {
    supabase.from('site_settings').select('*').maybeSingle().then(({ data }) => setSettings(data as SiteSettings | null));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    const { error } = await supabase.from('contact_messages').insert({
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
    });
    if (error) {
      setStatus('error');
    } else {
      setStatus('sent');
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: settings?.contact_email || 'hello@cupidcreativex.com' },
    { icon: Phone, label: 'Phone', value: settings?.contact_phone || '+1 (555) 123-4567' },
    { icon: MapPin, label: 'Address', value: settings?.contact_address || '123 Innovation Drive, Tech City' },
  ];

  return (
    <div style={{ backgroundColor: bg }}>
      <PageHero pageKey="contact" defaultTitle="Get in Touch" defaultSubtitle="Have a project in mind? We'd love to hear about it. Reach out and let's create something extraordinary together." gradientWord="Touch" />

      <div className="w-full px-8 md:px-12 lg:px-20 pb-20">
        {sectionImage && (
          <div className="rounded-2xl overflow-hidden h-64 md:h-80 mb-12">
            <img src={sectionImage} alt="Contact us" className="w-full h-full object-cover" loading="lazy" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: hf }}>
              Contact Information
            </h2>
            <div className="space-y-4">
              {contactInfo.map((info, i) => {
                const Icon = info.icon;
                return (
                  <div key={i} className="glass glass-hover rounded-2xl p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(135deg, ${primary}20, ${accent}10)` }}>
                      <Icon className="w-6 h-6" style={{ color: primary }} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{info.label}</div>
                      <div className="text-white font-medium">{info.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <SocialLinks className="mt-8" />
          </div>

          <div className="glass rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none transition-colors"
                  style={{ outlineColor: primary }}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none transition-colors"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Subject</label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none transition-colors"
                  placeholder="What's this about?"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none transition-colors resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full px-6 py-3.5 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ background: `linear-gradient(to right, ${primary}, ${primary}dd)` }}
              >
                {status === 'sending' ? 'Sending...' : status === 'sent' ? (
                  <><Check className="w-5 h-5" /> Message Sent!</>
                ) : (
                  <>Send Message <Send className="w-4 h-4" /></>
                )}
              </button>
              {status === 'error' && (
                <p className="text-red-400 text-sm text-center">Something went wrong. Please try again.</p>
              )}
              {status === 'sent' && (
                <p className="text-green-400 text-sm text-center">Thank you! We'll get back to you soon.</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
