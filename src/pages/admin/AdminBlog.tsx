import { useState, useEffect } from 'react';
import { supabase, type BlogPost } from '@/lib/supabase';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';

export default function AdminBlog() {
  const [items, setItems] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  const handleSave = async (data: Partial<BlogPost>) => {
    if (editing) {
      await supabase.from('blog_posts').update(data).eq('id', editing.id);
    } else {
      await supabase.from('blog_posts').insert(data);
    }
    setShowForm(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog post?')) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Blog Posts</h2>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Post
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="glass rounded-xl p-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-gray-800 overflow-hidden flex-shrink-0">
                {item.cover_image_url && <img src={item.cover_image_url} alt={item.title} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${item.published ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {item.published ? 'Published' : 'Draft'}
                  </span>
                  <span className="text-xs text-gray-600">{item.author}</span>
                </div>
                <h3 className="font-bold text-white truncate">{item.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-1">{item.excerpt}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => { setEditing(item); setShowForm(true); }} className="p-2 glass glass-hover rounded-lg text-gray-400 hover:text-orange-400"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(item.id)} className="p-2 glass glass-hover rounded-lg text-gray-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && <BlogForm initial={editing} onSave={handleSave} onClose={() => { setShowForm(false); setEditing(null); }} />}
    </div>
  );
}

function BlogForm({ initial, onSave, onClose }: { initial: BlogPost | null; onSave: (data: Partial<BlogPost>) => void; onClose: () => void }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [slug, setSlug] = useState(initial?.slug || '');
  const [excerpt, setExcerpt] = useState(initial?.excerpt || '');
  const [content, setContent] = useState(initial?.content || '');
  const [coverImageUrl, setCoverImageUrl] = useState(initial?.cover_image_url || '');
  const [author, setAuthor] = useState(initial?.author || 'CupidCreativeX Team');
  const [published, setPublished] = useState(initial?.published ?? false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
      excerpt,
      content,
      cover_image_url: coverImageUrl,
      author,
      published,
      published_at: published && !initial?.published_at ? new Date().toISOString() : initial?.published_at,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass rounded-2xl p-8 w-full max-w-2xl my-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">{initial ? 'Edit Post' : 'Add Post'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Title</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Slug (optional)</label>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" placeholder="auto-generated" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Excerpt</label>
            <input type="text" required value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Content (Markdown supported)</label>
            <textarea required value={content} onChange={(e) => setContent(e.target.value)} rows={10} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50 resize-y font-mono text-sm" placeholder="# Heading&#10;&#10;Your content here..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Cover Image URL</label>
              <input type="url" value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Author</label>
              <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Published</label>
            <select value={published ? 'true' : 'false'} onChange={(e) => setPublished(e.target.value === 'true')} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50">
              <option value="true" className="bg-gray-900">Yes</option>
              <option value="false" className="bg-gray-900">No</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Save</button>
            <button type="button" onClick={onClose} className="px-4 py-2.5 glass text-gray-300 font-semibold rounded-lg">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
