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
    <div className="min-h-screen text-gray-200 flex" style={{ backgroundColor: bg }}>
      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 glass border-r border-white/5 z-50 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6">
          <Link to="/" className="block mb-8">
            <Logo size="sm" />
          </Link>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = path === item.to;
              return (
                <button
                  key={item.to}
                  onClick={() => { navigate(item.to); setSidebarOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={active ? {
                    background: `linear-gradient(to right, ${primary}20, ${accent}10)`,
                    color: primary,
                    border: `1px solid ${primary}20`,
                  } : undefined}
                >
                  <Icon className="w-4 h-4" />
                  <span className={active ? '' : 'text-gray-400 hover:text-white'}>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/5">
          <div className="text-xs text-gray-500 mb-3 truncate">{user?.email}</div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <header className="glass border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <button className="md:hidden text-white" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <h1 className="text-lg font-semibold text-white" style={{ fontFamily: `'${headingFont}', sans-serif` }}>
            Admin Dashboard
          </h1>
          <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">
            View Site →
          </Link>
        </header>

        <div className="p-6 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
