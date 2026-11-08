import { useState, useEffect } from 'react';
import { supabase, type BlogPost } from '@/lib/supabase';
import { useTheme } from '@/lib/theme';
import { PageHero } from '@/components/PageHero';
import { Link } from '@/lib/router';
import { Calendar, User, ArrowRight } from 'lucide-react';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useTheme();

  const primary = settings?.color_primary || '#f97316';
  const bg = settings?.color_bg || '#0a0a0f';
  const headingFont = settings?.font_heading || 'Space Grotesk';
  const hf = `'${headingFont}', sans-serif`;

  useEffect(() => {
    supabase.from('blog_posts').select('*').eq('published', true).order('published_at', { ascending: false }).then(({ data }) => {
      setPosts(data || []);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex items-center justify-center" style={{ backgroundColor: bg }}>
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: primary, borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: bg }}>
      <PageHero pageKey="blog" defaultTitle="Our Blog" defaultSubtitle="Insights, trends, and stories from the world of digital innovation." gradientWord="Blog" />

      <div className="w-full px-8 md:px-12 lg:px-20 pb-20">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No blog posts yet. Check back soon!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="group glass glass-hover rounded-2xl overflow-hidden">
                <div className="aspect-[16/10] overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                  {post.cover_image_url && (
                    <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.published_at ? new Date(post.published_at).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Draft'}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 transition-colors" style={{ fontFamily: hf }}>
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">{post.excerpt}</p>
                  <span className="text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: primary }}>
                    Read More <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
