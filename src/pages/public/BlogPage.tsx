import { useState, useEffect, useMemo } from 'react';
import { supabase, type BlogPost } from '@/lib/supabase';
import { useTheme } from '@/lib/theme';
import { usePageContent } from '@/lib/pageContent';
import { Link } from '@/lib/router';
import { Calendar, User, ArrowRight, Sparkles, Search, Filter, ChevronLeft, ChevronRight, BookOpen, MessageSquare } from 'lucide-react';

const POSTS_PER_PAGE = 6;

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

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

  // Extract unique categories dynamically
  const categories = useMemo(() => {
    const cats = posts.map((p) => (p as any).category || 'General');
    return ['All', ...Array.from(new Set(cats))];
  }, [posts]);

  // Filter posts based on search and category
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
      const postCat = (post as any).category || 'General';
      const matchesCategory = selectedCategory === 'All' || postCat === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex items-center justify-center" style={{ backgroundColor: bg }}>
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: primary, borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: bg }}>
      {/* Hero Banner Section */}
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
              <div className="absolute inset-0 opacity-40 pointer-events-none z-0" style={{ background: `radial-gradient(circle at center top, ${primary}25, transparent 75%)` }} />

              {/* Animated Steam Layers */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
                <div className="absolute -bottom-10 left-1/4 w-32 h-32 rounded-full blur-[45px] animate-steam-1" style={{ background: `radial-gradient(circle, ${primary}40, transparent 70%)` }} />
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-[55px] animate-steam-2" style={{ background: `radial-gradient(circle, ${accent}30, transparent 70%)` }} />
                <div className="absolute -bottom-10 right-1/4 w-36 h-36 rounded-full blur-[50px] animate-steam-3" style={{ background: `radial-gradient(circle, ${primary}35, transparent 70%)` }} />
              </div>

              <div className="relative z-20 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full mb-4 border border-white/5">
                  <Sparkles className="w-4 h-4" style={{ color: primary }} />
                  <span className="text-sm text-gray-400">CupidCreativeX Expert Insights</span>
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
                    Blog & Guides
                  </span>
                </h1>
                <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                  {content?.subtitle || 'Actionable strategies, engineering frameworks, and design playbooks for ambitious brands.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full px-8 md:px-12 lg:px-20 pb-20">
        {/* Search Bar & Category Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl glass text-white placeholder-gray-500 text-sm border border-white/10 focus:outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <Filter className="w-4 h-4 text-gray-500 shrink-0 mr-1" />
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="px-4 py-2 rounded-xl text-xs font-medium transition-all shrink-0 border"
                  style={{
                    backgroundColor: isActive ? primary : 'rgba(255, 255, 255, 0.03)',
                    borderColor: isActive ? primary : 'rgba(255, 255, 255, 0.1)',
                    color: isActive ? '#fff' : '#9ca3af',
                    boxShadow: isActive ? `0 0 15px ${primary}40` : 'none',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Posts Grid */}
        {paginatedPosts.length === 0 ? (
          <div className="text-center py-20 glass rounded-2xl border border-white/10">
            <p className="text-gray-400 text-lg mb-2">No articles found matching your criteria.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="text-sm font-medium underline"
              style={{ color: primary }}
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedPosts.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="group glass glass-hover rounded-2xl overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="aspect-[16/10] overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 relative">
                    {post.cover_image_url && (
                      <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    )}
                    {(post as any).category && (
                      <span className="absolute top-3 right-3 px-3 py-1 rounded-lg text-xs font-semibold glass text-white border border-white/10">
                        {(post as any).category}
                      </span>
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
                    <h3 className="text-lg font-bold text-white mb-2 transition-colors line-clamp-2" style={{ fontFamily: hf }}>
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">{post.excerpt}</p>
                  </div>
                </div>
                <div className="px-6 pb-6 pt-0 flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: primary }}>
                    Read Full Guide <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-12">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-3 rounded-xl glass border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className="w-10 h-10 rounded-xl text-sm font-medium transition-all border"
                  style={{
                    backgroundColor: currentPage === page ? primary : 'rgba(255, 255, 255, 0.03)',
                    borderColor: currentPage === page ? primary : 'rgba(255, 255, 255, 0.1)',
                    color: currentPage === page ? '#fff' : '#9ca3af',
                    boxShadow: currentPage === page ? `0 0 15px ${primary}40` : 'none',
                  }}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-3 rounded-xl glass border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Embedded Template Conversion Banner (Brought from blog template) */}
        <div className="mt-20 rounded-3xl p-8 md:p-12 glass relative overflow-hidden border border-white/10 text-center">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: `radial-gradient(circle at center, ${primary}, transparent 70%)` }} />
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full mb-4 border border-white/5">
              <BookOpen className="w-4 h-4" style={{ color: primary }} />
              <span className="text-sm text-gray-300">Partner With Us</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4" style={{ fontFamily: hf }}>
              Ready to Transform Your Digital Presence?
            </h3>
            <p className="text-gray-400 text-sm md:text-base mb-8">
              Let's turn your vision into an industry-leading reality. Get in touch with our team at [CupidCreativeX](http://localhost:5173/) today.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to={`/contact`} className="px-6 py-3 rounded-xl font-medium text-white transition-all shadow-lg" style={{ backgroundColor: primary, boxShadow: `0 0 20px ${primary}50` }}>
                Start Your Project
              </Link>
              <Link to={`/portfolio`} className="px-6 py-3 rounded-xl font-medium text-white glass hover:bg-white/10 transition-all border border-white/10">
                Explore Case Studies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}