import { Link, useRouter } from '@/lib/router';
import { useAuth } from '@/lib/auth';
import { useState } from 'react';
import { LayoutDashboard, Briefcase, Users, MessageSquare, Settings, FileText, Star, LogOut, Menu, X, Code, Image, FileEdit, Plug, Puzzle, Share2 } from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { Logo } from '@/components/Logo';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const { path, navigate } = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { settings } = useTheme();

  const primary = settings?.color_primary || '#f97316';
  const accent = settings?.color_accent || '#06b6d4';
  const bg = settings?.color_bg || '#0a0a0f';
  const headingFont = settings?.font_heading || 'Space Grotesk';

  const navItems = [
    { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
    { label: 'Services', to: '/admin/services', icon: Code },
    { label: 'Projects', to: '/admin/projects', icon: Briefcase },
    { label: 'Team', to: '/admin/team', icon: Users },
    { label: 'Testimonials', to: '/admin/testimonials', icon: Star },
    { label: 'Blog Posts', to: '/admin/blog', icon: FileText },
    { label: 'Messages', to: '/admin/messages', icon: MessageSquare },
    { label: 'Media Gallery', to: '/admin/media', icon: Image },
    { label: 'Pages', to: '/admin/pages', icon: FileEdit },
    { label: 'Integrations', to: '/admin/integrations', icon: Plug },
    { label: 'Plugins', to: '/admin/plugins', icon: Puzzle },
    { label: 'Social Links', to: '/admin/social', icon: Share2 },
    { label: 'Settings', to: '/admin/settings', icon: Settings },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="h-screen w-screen text-gray-200 flex overflow-hidden" style={{ backgroundColor: bg }}>
      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 shrink-0 glass border-r border-white/5 z-50 transition-transform duration-300 flex flex-col justify-between ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <Link to="/" className="block mb-8 group/logo">
            <div className="transition-transform duration-300 group-hover/logo:scale-105">
              <Logo size="sm" />
            </div>
          </Link>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = path === item.to;
              return (
                <button
                  key={item.to}
                  onClick={() => { navigate(item.to); setSidebarOpen(false); }}
                  className={`group/item relative w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 overflow-hidden cursor-pointer ${
                    active ? '' : 'hover:-translate-y-0.5'
                  }`}
                  style={active ? {
                    background: `linear-gradient(135deg, ${primary}25, ${accent}15)`,
                    color: primary,
                    boxShadow: `0 8px 20px -4px ${primary}30`,
                    border: `1px solid ${primary}50`,
                  } : {}}
                >
                  {/* Neon Glow & Border on Hover for Inactive Items */}
                  {!active && (
                    <>
                      <div
                        className="absolute inset-0 rounded-xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
                        style={{
                          boxShadow: `inset 0 0 15px ${primary}20, 0 6px 15px -3px ${primary}30`,
                          border: `1px solid ${primary}40`,
                        }}
                      />
                      <div 
                        className="absolute inset-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 pointer-events-none z-0" 
                        style={{ background: `radial-gradient(circle at center top, ${accent}10, transparent 80%)` }}
                      />
                    </>
                  )}

                  <Icon className={`w-4 h-4 relative z-20 transition-transform duration-300 group-hover/item:scale-110 ${active ? '' : 'text-gray-400 group-hover/item:text-white'}`} style={active ? { color: primary } : undefined} />
                  <span className={`relative z-20 ${active ? 'font-semibold' : 'text-gray-400 group-hover/item:text-white'}`}>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-white/5 relative z-20">
          <div className="text-xs text-gray-500 mb-3 truncate px-1">{user?.email}</div>
          
          <div className="relative group/btn rounded-xl p-[2px]">
            <div 
              className="absolute inset-0 rounded-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 animate-border-rotate pointer-events-none"
            />
            <button
              onClick={handleSignOut}
              className="relative z-10 w-full flex items-center gap-3 px-4 py-2.5 rounded-[10px] text-sm font-medium text-gray-400 hover:text-red-400 bg-white/5 hover:bg-transparent transition-all duration-300 cursor-pointer group-hover/btn:scale-95 shadow-md"
              style={{ boxShadow: '0 5px 15px -3px rgba(239, 68, 68, 0.2)' }}
            >
              <LogOut className="w-4 h-4 transition-transform duration-300 group-hover/btn:-translate-x-0.5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <header className="glass border-b border-white/5 px-6 md:px-10 py-4 flex items-center justify-between sticky top-0 z-30 shadow-lg shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-white p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar menu"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-lg font-semibold text-white tracking-wide" style={{ fontFamily: `'${headingFont}', sans-serif` }}>
              Admin Dashboard
            </h1>
          </div>

          <Link 
            to="/" 
            className="group/link relative inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl glass glass-hover border border-white/10 transition-all duration-300 hover:-translate-y-0.5"
            style={{ 
              borderColor: `${primary}40`,
            }}
          >
            <span className="text-gray-300 group-hover/link:text-white transition-colors">View Site</span>
            <span className="transition-transform duration-300 group-hover/link:translate-x-1" style={{ color: primary }}>→</span>
          </Link>
        </header>

        <main className="flex-1 p-6 md:p-10 animate-fade-up max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}