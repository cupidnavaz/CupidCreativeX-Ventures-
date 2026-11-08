import { useState, useEffect } from 'react';
import { Link, useRouter } from '@/lib/router';
import { Menu, X } from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { Logo } from '@/components/Logo';
import { SocialLinks, SocialLinksProvider } from '@/components/public/SocialLinks';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { path, navigate } = useRouter();
  const { settings } = useTheme();

  const primary = settings?.color_primary || '#f97316';
  const bg = settings?.color_bg || '#0a0a0f';
  const headingFont = settings?.font_heading || 'Space Grotesk';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass py-3' : 'py-5 bg-transparent'
        }`}
      >
        <div className="w-full px-8 md:px-12 lg:px-20 flex items-center justify-between">
          <Link to="/" className="group">
            <div className="group-hover:scale-105 transition-transform">
              <Logo size="md" />
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`public-nav-link px-4 py-2 text-sm font-medium rounded-lg${path === link.to ? ' is-active' : ''}`}
                style={path === link.to ? { color: primary } : undefined}
              >
                <span className={path === link.to ? '' : 'text-gray-400 hover:text-white'}>{link.label}</span>
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate('/contact')}
              className="px-5 py-2.5 text-white text-sm font-semibold rounded-lg transition-all"
              style={{ background: `linear-gradient(to right, ${primary}, ${primary}dd)` }}
            >
              Get Started
            </button>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden glass mt-3 mx-4 rounded-2xl p-4 animate-fade-up">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`public-nav-link block px-4 py-3 text-sm font-medium rounded-lg${path === link.to ? ' is-active' : ''}`}
                style={path === link.to ? { color: primary, background: 'rgba(255,255,255,0.05)' } : undefined}
              >
                <span className={path === link.to ? '' : 'text-gray-400'}>{link.label}</span>
              </Link>
            ))}
            <button
              onClick={() => { navigate('/contact'); setMobileOpen(false); }}
              className="w-full mt-2 px-5 py-3 text-white text-sm font-semibold rounded-lg"
              style={{ background: `linear-gradient(to right, ${primary}, ${primary}dd)` }}
            >
              Get Started
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

        <footer className="border-t border-white/5 mt-12">
          <div className="w-full px-8 md:px-12 lg:px-20 py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-1">
                <div className="mb-4">
                  <Logo size="md" />
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Building digital experiences that matter. From concept to launch, we bring your vision to life.
                </p>
                <SocialLinks className="mt-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4 text-sm" style={{ fontFamily: `'${headingFont}', sans-serif` }}>Company</h4>
                <ul className="space-y-2">
                  <li><Link to="/about" className="text-sm text-gray-500 hover:text-white transition-colors">About Us</Link></li>
                  <li><Link to="/team" className="text-sm text-gray-500 hover:text-white transition-colors">Our Team</Link></li>
                  <li><Link to="/portfolio" className="text-sm text-gray-500 hover:text-white transition-colors">Portfolio</Link></li>
                  <li><Link to="/blog" className="text-sm text-gray-500 hover:text-white transition-colors">Blog</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4 text-sm" style={{ fontFamily: `'${headingFont}', sans-serif` }}>Services</h4>
                <ul className="space-y-2">
                  <li><Link to="/services" className="text-sm text-gray-500 hover:text-white transition-colors">Web Development</Link></li>
                  <li><Link to="/services" className="text-sm text-gray-500 hover:text-white transition-colors">Mobile Apps</Link></li>
                  <li><Link to="/services" className="text-sm text-gray-500 hover:text-white transition-colors">UI/UX Design</Link></li>
                  <li><Link to="/services" className="text-sm text-gray-500 hover:text-white transition-colors">Digital Marketing</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4 text-sm" style={{ fontFamily: `'${headingFont}', sans-serif` }}>Get in Touch</h4>
                <ul className="space-y-2">
                  <li><Link to="/contact" className="text-sm text-gray-500 hover:text-white transition-colors">Contact Us</Link></li>
                  <li><Link to="/admin" className="text-sm text-gray-500 hover:text-white transition-colors">Admin Login</Link></li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-600">© 2026 {settings?.brand_name || 'CupidCreativeX Ventures'}. All rights reserved.</p>
              <p className="text-sm text-gray-600">Crafted with passion</p>
            </div>
          </div>
        </footer>
      </SocialLinksProvider>
    </div>
  );
}
