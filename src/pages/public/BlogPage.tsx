import { useState, useEffect } from 'react';
import { supabase, type BlogPost } from '@/lib/supabase';
import { useTheme } from '@/lib/theme';
import { usePageContent } from '@/lib/pageContent';
import { Link } from '@/lib/router';
import { Calendar, User, ArrowRight, Sparkles } from 'lucide-react';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useTheme();
  const { content } = usePageContent('blog');

  const primary = settings?.color_primary || '#f97316';
  const accent = settings?.color_accent || '#06b6d4';
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
      {/* Full-Width Banner Section with Darker Brand-Blended Background, Zoom-Out, & Steam Effect */}
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

              {/* Animated Smoke / Steaming Layers */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
                <div 
                  className="absolute -bottom-10 left-1/4 w-32 h-32 rounded-full blur-[45px] animate-steam-1" 
                  style={{ background: `radial-gradient(circle, ${primary}40, transparent 70%)` }}
                />
                <div 
                  className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-[55px] animate-steam-2" 
                  style={{ background: `radial-gradient(circle, ${accent}30, transparent 70%)` }}
                />
                <div 
                  className="absolute -bottom-10 right-1/4 w-36 h-36 rounded-full blur-[50px] animate-steam-3" 
                  style={{ background: `radial-gradient(circle, ${primary}35, transparent 70%)` }}
                />
              </div>

              <div className="relative z-20 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full mb-4 border border-white/5">
                  <Sparkles className="w-4 h-4" style={{ color: primary }} />
                  <span className="text-sm text-gray-400">Latest Insights</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4" style={{ fontFamily: hf }}>
                  Our{' '}
                  <span
                    style={{
                      background: `linear-gradient(135deg, ${primary}, ${accent})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Blog
                  </span>
                </h1>
                <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                  {content?.subtitle || 'Insights, trends, and stories from the world of digital innovation.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full px-8 md:px-12 lg:px-20 pb-20">
        {/* Full-Width Glass Heading Container with Orange Underline */}
        <div className="w-full relative mb-12 rounded-2xl glass px-8 py-8 text-center backdrop-blur-xl border border-white/10">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight pb-3 inline-block relative" style={{ fontFamily: hf }}>
            Latest Articles & Insights
            <span 
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full"
              style={{ 
                background: primary,
                boxShadow: `0 0 12px ${primary}` 
              }}
            />
          </h2>
        </div>

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