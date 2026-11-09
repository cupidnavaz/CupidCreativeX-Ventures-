import { useState, useEffect } from 'react';
import { Link, useRouter } from '@/lib/router';
import { Menu, X, ArrowRight, ArrowUp } from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { Logo } from '@/components/Logo';
import { SocialLinks, SocialLinksProvider } from '@/components/public/SocialLinks';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { path, navigate } = useRouter();
  const { settings } = useTheme();

  const primary = settings?.color_primary || '#f97316';
  const accent = settings?.color_accent || '#06b6d4';
  const bg = settings?.color_bg || '#0a0a0f';
  const headingFont = settings?.font_heading || 'Space Grotesk';

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const headings = document.querySelectorAll(
      '.public-site main h1, .public-site main h2, .public-site main h3, .public-site main h4, .public-site main h5, .public-site main h6',
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('public-heading-in-view');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -24px 0px' },
    );
    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [path]);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Services', to: '/services' },
    { label: 'Portfolio', to: '/portfolio' },
    { label: 'About', to: '/about' },
    { label: 'Team', to: '/team' },
    { label: 'Blog', to: '/blog' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <div className="public-site min-h-screen text-gray-200" style={{ backgroundColor: bg }}>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4 md:px-12 lg:px-20 pt-4`}
      >
        <div 
          className={`relative glass rounded-2xl px-6 py-3.5 flex items-center justify-between transition-all duration-500 group overflow-hidden ${
            scrolled ? 'shadow-2xl' : ''
          }`}
          style={{
            borderColor: scrolled ? `${primary}40` : 'rgba(255, 255, 255, 0.1)',
            boxShadow: scrolled ? `0 10px 30px -5px ${primary}20` : undefined,
          }}
        >
          {/* Neon Border & Glow Effect on Hover/Scroll */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
            style={{
              boxShadow: `inset 0 0 20px ${primary}20, 0 10px 30px -5px ${primary}30`,
              border: `1px solid ${primary}50`,
            }}
          />

          {/* Ambient background glow on hover */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" 
            style={{ background: `radial-gradient(circle at center top, ${accent}15, transparent 75%)` }}
          />

          <Link to="/" className="relative z-20 group/logo">
            <div className="transition-transform duration-300 group-hover/logo:scale-105">
              <Logo size="md" />
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 relative z-20">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`public-nav-link px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300${path === link.to ? ' is-active' : ''}`}
                style={path === link.to ? { color: primary, background: `${primary}15` } : undefined}
              >
                <span className={path === link.to ? '' : 'text-gray-400 hover:text-white'}>{link.label}</span>
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3 relative z-20">
            <div className="relative group/btn rounded-xl p-[2px]">
              <div 
                className="absolute inset-0 rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 animate-border-rotate pointer-events-none"
              />
              <button
                onClick={() => navigate('/contact')}
                className="relative z-10 px-5 py-2.5 text-white text-sm font-semibold bg-[#f97316] hover:bg-transparent rounded-[10px] transition-all duration-500 flex items-center gap-2 cursor-pointer group-hover/btn:scale-95 shadow-lg"
                style={{ boxShadow: '0 10px 20px -5px rgba(249, 115, 22, 0.4)' }}
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  Get Started <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </span>
              </button>
            </div>
          </div>

          <button
            className="md:hidden text-white relative z-20 p-2 rounded-xl bg-white/5 border border-white/10"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden glass mt-3 rounded-2xl p-4 animate-fade-up relative z-50 border border-white/10" style={{ boxShadow: `0 20px 40px -10px ${primary}30` }}>
            <div className="space-y-1 mb-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`public-nav-link block px-4 py-3 text-sm font-medium rounded-xl transition-all${path === link.to ? ' is-active' : ''}`}
                  style={path === link.to ? { color: primary, background: `${primary}20` } : undefined}
                >
                  <span className={path === link.to ? '' : 'text-gray-400'}>{link.label}</span>
                </Link>
              ))}
            </div>
            <button
              onClick={() => { navigate('/contact'); setMobileOpen(false); }}
              className="w-full px-5 py-3 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg"
              style={{ background: `linear-gradient(110deg, ${primary}, ${accent})`, boxShadow: `0 10px 25px -5px ${primary}40` }}
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </header>

      <SocialLinksProvider>
        <main>
          <div key={path} className="public-page-enter">
            {children}
          </div>
        </main>

        <footer className="border-t border-white/5 mt-12 py-16 relative overflow-hidden">
          <div className="w-full px-8 md:px-12 lg:px-20">
            <div className="group relative glass rounded-3xl p-8 md:p-12 transition-all duration-500 hover:-translate-y-1.5 overflow-hidden">
              {/* Neon Border & Glow Effect on Hover */}
              <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
                style={{
                  boxShadow: `inset 0 0 25px ${primary}25, 0 15px 35px -5px ${primary}35`,
                  border: `1px solid ${primary}50`,
                }}
              />

              {/* Ambient background glow on hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" 
                style={{ background: `radial-gradient(circle at center top, ${accent}15, transparent 75%)` }}
              />

              <div className="relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="md:col-span-1">
                    <div className="mb-4">
                      <Logo size="md" />
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Building digital experiences that matter. From concept to launch, we bring your vision to life.
                    </p>
                    <SocialLinks className="mt-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-4 text-sm" style={{ fontFamily: `'${headingFont}', sans-serif` }}>Company</h4>
                    <ul className="space-y-2">
                      <li>
                        <Link 
                          to="/about" 
                          className="public-nav-link inline-block px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-300 text-gray-400 hover:text-white"
                          style={path === '/about' ? { color: primary, background: `${primary}15` } : undefined}
                        >
                          About Us
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/team" 
                          className="public-nav-link inline-block px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-300 text-gray-400 hover:text-white"
                          style={path === '/team' ? { color: primary, background: `${primary}15` } : undefined}
                        >
                          Our Team
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/portfolio" 
                          className="public-nav-link inline-block px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-300 text-gray-400 hover:text-white"
                          style={path === '/portfolio' ? { color: primary, background: `${primary}15` } : undefined}
                        >
                          Portfolio
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/blog" 
                          className="public-nav-link inline-block px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-300 text-gray-400 hover:text-white"
                          style={path === '/blog' ? { color: primary, background: `${primary}15` } : undefined}
                        >
                          Blog
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-4 text-sm" style={{ fontFamily: `'${headingFont}', sans-serif` }}>Services</h4>
                    <ul className="space-y-2">
                      <li>
                        <Link 
                          to="/services" 
                          className="public-nav-link inline-block px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-300 text-gray-400 hover:text-white"
                        >
                          Web Development
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/services" 
                          className="public-nav-link inline-block px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-300 text-gray-400 hover:text-white"
                        >
                          Mobile Apps
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/services" 
                          className="public-nav-link inline-block px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-300 text-gray-400 hover:text-white"
                        >
                          UI/UX Design
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/services" 
                          className="public-nav-link inline-block px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-300 text-gray-400 hover:text-white"
                        >
                          Digital Marketing
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-4 text-sm" style={{ fontFamily: `'${headingFont}', sans-serif` }}>Get in Touch</h4>
                    <ul className="space-y-2">
                      <li>
                        <Link 
                          to="/contact" 
                          className="public-nav-link inline-block px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-300 text-gray-400 hover:text-white"
                          style={path === '/contact' ? { color: primary, background: `${primary}15` } : undefined}
                        >
                          Contact Us
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/admin" 
                          className="public-nav-link inline-block px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-300 text-gray-400 hover:text-white"
                          style={path === '/admin' ? { color: primary, background: `${primary}15` } : undefined}
                        >
                          Admin Login
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-gray-400">© 2026 {settings?.brand_name || 'CupidCreativeX Ventures'}. All rights reserved.</p>
                  <p className="text-sm text-gray-400">Crafted with passion</p>
                </div>
              </div>
            </div>
          </div>
        </footer>

        {/* Floating Back to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="fixed bottom-6 right-6 z-50 p-3.5 glass rounded-2xl text-white transition-all duration-500 hover:-translate-y-1.5 shadow-2xl flex items-center justify-center group cursor-pointer animate-fade-up"
            style={{
              boxShadow: `0 10px 25px -5px ${primary}40`,
              borderColor: `${primary}60`,
              background: `linear-gradient(135deg, ${primary}30, ${accent}20)`,
            }}
          >
            <ArrowUp className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5" style={{ color: primary }} />
          </button>
        )}
      </SocialLinksProvider>
    </div>
  );
}