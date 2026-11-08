import { AuthProvider } from '@/lib/auth';
import { RouterProvider, useRouter } from '@/lib/router';
import { ThemeProvider } from '@/lib/theme';
import { useAuth } from '@/lib/auth';
import { useEffect } from 'react';
import { useTheme } from '@/lib/theme';
import PublicLayout from '@/components/public/PublicLayout';
import AdminLayout from '@/components/admin/AdminLayout';
import HomePage from '@/pages/public/HomePage';
import ServicesPage from '@/pages/public/ServicesPage';
import PortfolioPage from '@/pages/public/PortfolioPage';
import AboutPage from '@/pages/public/AboutPage';
import TeamPage from '@/pages/public/TeamPage';
import BlogPage from '@/pages/public/BlogPage';
import BlogPostPage from '@/pages/public/BlogPostPage';
import ContactPage from '@/pages/public/ContactPage';
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminServices from '@/pages/admin/AdminServices';
import AdminProjects from '@/pages/admin/AdminProjects';
import AdminTeam from '@/pages/admin/AdminTeam';
import AdminTestimonials from '@/pages/admin/AdminTestimonials';
import AdminBlog from '@/pages/admin/AdminBlog';
import AdminMessages from '@/pages/admin/AdminMessages';
import AdminSettings from '@/pages/admin/AdminSettings';
import AdminMedia from '@/pages/admin/AdminMedia';
import AdminPages from '@/pages/admin/AdminPages';
import AdminIntegrations from '@/pages/admin/AdminIntegrations';
import AdminPlugins from '@/pages/admin/AdminPlugins';
import AdminSocial from '@/pages/admin/AdminSocial';

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { navigate } = useRouter();
  const { settings } = useTheme();
  const primary = settings?.color_primary || '#f97316';
  const bg = settings?.color_bg || '#0a0a0f';

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: bg }}>
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: primary, borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}

function Routes() {
  const { path } = useRouter();

  // Admin routes
  if (path === '/admin/login') return <AdminLogin />;

  if (path.startsWith('/admin')) {
    const sub = path.replace('/admin', '') || '/';
    return (
      <AdminRoute>
        <AdminLayout>
          {sub === '/' || sub === '' ? <AdminDashboard /> : null}
          {sub === '/services' ? <AdminServices /> : null}
          {sub === '/projects' ? <AdminProjects /> : null}
          {sub === '/team' ? <AdminTeam /> : null}
          {sub === '/testimonials' ? <AdminTestimonials /> : null}
          {sub === '/blog' ? <AdminBlog /> : null}
          {sub === '/messages' ? <AdminMessages /> : null}
          {sub === '/settings' ? <AdminSettings /> : null}
          {sub === '/media' ? <AdminMedia /> : null}
          {sub === '/pages' ? <AdminPages /> : null}
          {sub === '/integrations' ? <AdminIntegrations /> : null}
          {sub === '/plugins' ? <AdminPlugins /> : null}
          {sub === '/social' ? <AdminSocial /> : null}
        </AdminLayout>
      </AdminRoute>
    );
  }

  // Public routes
  if (path === '/services') {
    return <PublicLayout><ServicesPage /></PublicLayout>;
  }
  if (path === '/portfolio') {
    return <PublicLayout><PortfolioPage /></PublicLayout>;
  }
  if (path === '/about') {
    return <PublicLayout><AboutPage /></PublicLayout>;
  }
  if (path === '/team') {
    return <PublicLayout><TeamPage /></PublicLayout>;
  }
  if (path === '/blog') {
    return <PublicLayout><BlogPage /></PublicLayout>;
  }
  if (path.startsWith('/blog/')) {
    const slug = path.replace('/blog/', '');
    return <PublicLayout><BlogPostPage slug={slug} /></PublicLayout>;
  }
  if (path === '/contact') {
    return <PublicLayout><ContactPage /></PublicLayout>;
  }

  // Default: Home
  return <PublicLayout><HomePage /></PublicLayout>;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider>
          <Routes />
        </RouterProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
