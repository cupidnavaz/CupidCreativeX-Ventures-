import { useState, useEffect } from 'react';
import { supabase, type SiteSettings } from '@/lib/supabase';
import { useTheme } from '@/lib/theme';
import { usePageContent } from '@/lib/pageContent';
import { SocialLinks } from '@/components/public/SocialLinks';
import { Mail, Phone, MapPin, Send, Check, MessageSquare, Sparkles } from 'lucide-react';

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

  const rawPhone = settings?.contact_phone || '+1 (555) 123-4567';
  const cleanPhone = rawPhone.replace(/[^\d+]/g, '');

  const contactInfo = [
    { 
      icon: Mail, 
      label: 'Email', 
      value: settings?.contact_email || 'hello@cupidcreativex.com', 
      href: `mailto:${settings?.contact_email || 'hello@cupidcreativex.com'}`,
      isWhatsApp: false
    },
    { 
      icon: Phone, 
      label: 'Phone', 
      value: rawPhone, 
      href: `tel:${cleanPhone}`,
      isWhatsApp: false
    },
    { 
      icon: MessageSquare, 
      label: 'WhatsApp', 
      value: rawPhone, 
      href: `https://wa.me/${cleanPhone.replace('+', '')}`,
      isWhatsApp: true
    },
    { 
      icon: MapPin, 
      label: 'Address', 
      value: settings?.contact_address || '123 Innovation Drive, Tech City', 
      href: null,
      isWhatsApp: false
    },
  ];

  return (
    <div style={{ backgroundColor: bg }}>
      {/* Full-Width Banner Section with Darker Brand-Blended Background & Zoom-Out on Hover */}
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

              <div className="relative z-20 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full mb-4 border border-white/5">
                  <Sparkles className="w-4 h-4" style={{ color: primary }} />
                  <span className="text-sm text-gray-400">Get in Touch</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4" style={{ fontFamily: hf }}>
                  Contact{' '}
                  <span
                    style={{
                      background: `linear-gradient(135deg, ${primary}, ${accent})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Us
                  </span>
                </h1>
                <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                  {content?.subtitle || "Have a project in mind? We'd love to hear about it. Reach out and let's create something extraordinary together."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                  <div 
                    key={i} 
                    className="group relative glass rounded-2xl p-6 flex items-center gap-4 transition-all duration-500 hover:-translate-y-1.5 overflow-hidden cursor-pointer"
                  >
                    {/* Neon Border & Glow Effect on Hover */}
                    <div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        boxShadow: `inset 0 0 20px ${primary}30, 0 10px 30px -5px ${primary}40`,
                        border: `1px solid ${primary}60`,
                      }}
                    />

                    {/* Ambient background glow on hover */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
                      style={{ background: `radial-gradient(circle at center top, ${primary}15, transparent 70%)` }}
                    />

                    <div className="relative z-10 flex items-center gap-4 w-full">
                      <div 
                        className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-md" 
                        style={{ background: `linear-gradient(135deg, ${primary}25, ${accent}15)` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: primary }} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm text-gray-400">{info.label}</div>
                        {info.href ? (
                          <a 
                            href={info.href} 
                            target={info.isWhatsApp ? '_blank' : undefined}
                            rel={info.isWhatsApp ? 'noopener noreferrer' : undefined}
                            className="text-white font-medium break-words transition-colors hover:text-white"
                          >
                            {info.value} {info.isWhatsApp && <span className="text-xs text-green-400 ml-1">(Chat)</span>}
                          </a>
                        ) : (
                          <div className="text-white font-medium break-words">{info.value}</div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <SocialLinks className="mt-8" />
          </div>

          <div className="group relative glass rounded-2xl p-8 transition-all duration-500 hover:-translate-y-1.5 overflow-hidden">
            {/* Form Card Neon Border & Glow Effect on Hover */}
            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                boxShadow: `inset 0 0 25px ${primary}25, 0 15px 35px -5px ${primary}35`,
                border: `1px solid ${primary}50`,
              }}
            />

            {/* Ambient background glow on hover */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
              style={{ background: `radial-gradient(circle at center top, ${accent}15, transparent 75%)` }}
            />

            <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none transition-all duration-300 hover:border-white/30"
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
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none transition-all duration-300 hover:border-white/30"
                  style={{ outlineColor: primary }}
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
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none transition-all duration-300 hover:border-white/30"
                  style={{ outlineColor: primary }}
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
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none transition-all duration-300 hover:border-white/30 resize-none"
                  style={{ outlineColor: primary }}
                  placeholder="Tell us about your project..."
                />
              </div>

              {/* Animated Submit Button with Rotating Multi-color Border & Zoom-out */}
              <div className="relative group/btn rounded-xl p-[2px]">
                <div 
                  className="absolute inset-0 rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 animate-border-rotate pointer-events-none"
                />
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="relative z-10 w-full px-6 py-4 font-semibold text-white bg-[#f97316] hover:bg-transparent rounded-[10px] transition-all duration-500 flex items-center justify-center gap-2 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer group-hover/btn:scale-95 shadow-lg"
                  style={{ boxShadow: '0 10px 25px -5px rgba(249, 115, 22, 0.4)' }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {status === 'sending' ? 'Sending...' : status === 'sent' ? (
                      <><Check className="w-5 h-5" /> Message Sent!</>
                    ) : (
                      <>Send Message <Send className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" /></>
                    )}
                  </span>
                </button>
              </div>

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