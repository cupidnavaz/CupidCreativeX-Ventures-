import { useState, useEffect } from 'react';
import { supabase, type BlogPost } from '@/lib/supabase';
import { useTheme } from '@/lib/theme';
import { Link } from '@/lib/router';
import { Calendar, User, ArrowLeft } from 'lucide-react';

export default function BlogPostPage({ slug }: { slug: string }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const { settings } = useTheme();

  const primary = settings?.color_primary || '#f97316';
  const bg = settings?.color_bg || '#0a0a0f';
  const headingFont = settings?.font_heading || 'Space Grotesk';
  const hf = `'${headingFont}', sans-serif`;

  useEffect(() => {
    supabase.from('blog_posts').select('*').eq('slug', slug).eq('published', true).maybeSingle().then(({ data }) => {
      setPost(data as BlogPost | null);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex items-center justify-center" style={{ backgroundColor: bg }}>
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: primary, borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: bg }}>
        <h1 className="text-3xl font-bold text-white">Post not found</h1>
        <Link to="/blog" className="transition-colors" style={{ color: primary }}>← Back to Blog</Link>
      </div>
    );
  }

  const lines = post.content.split('\n');

  return (
    <div className="pt-32 pb-20" style={{ backgroundColor: bg }}>
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-gray-400 mb-8 transition-colors" style={{ ['--hover-color' as string]: primary }}>
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        <header className={`grid grid-cols-1 ${post.cover_image_url ? 'lg:grid-cols-[1.05fr_0.95fr]' : ''} gap-10 items-center mb-12`}>
          <div className={post.cover_image_url ? '' : 'max-w-3xl'}>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {post.published_at ? new Date(post.published_at).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {post.author}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: hf }}>
              {post.title}
            </h1>

            <p className="text-xl text-gray-400 leading-relaxed">{post.excerpt}</p>
          </div>

          {post.cover_image_url && (
            <div className="hero-image-shell relative">
              <div className="hero-image-frame relative aspect-[4/3] rounded-[1.75rem] overflow-hidden border border-white/10 shadow-2xl">
                <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${bg}20, transparent 55%, ${bg}40)` }} />
              </div>
            </div>
          )}
        </header>

        <article className="max-w-3xl">
          <div className="prose prose-invert max-w-none">
          {lines.map((line, i) => {
            if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold text-white mt-8 mb-4" style={{ fontFamily: hf }}>{line.slice(2)}</h1>;
            if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold text-white mt-6 mb-3" style={{ fontFamily: hf }}>{line.slice(3)}</h2>;
            if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold text-white mt-4 mb-2" style={{ fontFamily: hf }}>{line.slice(4)}</h3>;
            if (line.trim() === '') return <div key={i} className="h-4" />;
            return <p key={i} className="text-gray-300 leading-relaxed mb-4">{line}</p>;
          })}
          </div>
        </article>
      </div>
    </div>
  );
}
