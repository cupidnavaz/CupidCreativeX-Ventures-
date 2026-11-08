import { useState, useEffect } from 'react';
import { supabase, type SocialLink } from '@/lib/supabase';
import { Plus, Edit2, Trash2, X, Save, Share2, ExternalLink } from 'lucide-react';

const PLATFORM_OPTIONS = [
  'Twitter', 'Facebook', 'Instagram', 'LinkedIn', 'GitHub', 'YouTube',
  'TikTok', 'Dribbble', 'Behance', 'Pinterest', 'Discord', 'Medium',
];

const ICON_MAP: Record<string, string> = {
  Twitter: 'Twitter', Facebook: 'Facebook', Instagram: 'Instagram',
  LinkedIn: 'Linkedin', GitHub: 'Github', YouTube: 'Youtube',
  TikTok: 'Music2', Dribbble: 'Dribbble', Behance: 'Figma',
  Pinterest: 'Image', Discord: 'MessageCircle', Medium: 'BookOpen',
};

export default function AdminSocial() {
  const [items, setItems] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<SocialLink | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('social_links').select('*').order('sort_order');
    setItems(data || []);
    setLoading(false);
  };

  const handleSave = async (data: Partial<SocialLink>) => {
    if (editing) {
      await supabase.from('social_links').update(data).eq('id', editing.id);
    } else {
      await supabase.from('social_links').insert(data);
    }
    setShowForm(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this social link?')) return;
    await supabase.from('social_links').delete().eq('id', id);
    load();
  };

  const handleToggle = async (item: SocialLink) => {
    await supabase.from('social_links').update({ published: !item.published }).eq('id', item.id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Social Links</h2>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Social Link
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <Share2 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500">No social links added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item.id} className="glass rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${item.published ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {item.published ? 'Published' : 'Hidden'}
                    </span>
                    <span className="text-xs text-gray-600">Order: {item.sort_order}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{item.platform}</h3>
                  <a href={item.url} target="_blank" rel="noreferrer" className="text-sm text-gray-400 hover:text-orange-400 flex items-center gap-1">
                    {item.url} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => handleToggle(item)} className="p-2 glass glass-hover rounded-lg text-gray-400 hover:text-green-400 text-xs">
                    {item.published ? 'Hide' : 'Show'}
                  </button>
                  <button onClick={() => { setEditing(item); setShowForm(true); }} className="p-2 glass glass-hover rounded-lg text-gray-400 hover:text-orange-400">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 glass glass-hover rounded-lg text-gray-400 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <SocialForm
          initial={editing}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}
    </div>
  );
}

function SocialForm({ initial, onSave, onClose }: { initial: SocialLink | null; onSave: (data: Partial<SocialLink>) => void; onClose: () => void }) {
  const [platform, setPlatform] = useState(initial?.platform || 'Twitter');
  const [url, setUrl] = useState(initial?.url || '');
  const [icon, setIcon] = useState(initial?.icon || 'Twitter');
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 0);
  const [published, setPublished] = useState(initial?.published ?? true);

  const handlePlatformChange = (p: string) => {
    setPlatform(p);
    setIcon(ICON_MAP[p] || p);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ platform, url, icon, sort_order: sortOrder, published });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass rounded-2xl p-8 w-full max-w-md my-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">{initial ? 'Edit Social Link' : 'Add Social Link'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Platform</label>
            <select value={platform} onChange={(e) => handlePlatformChange(e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50">
              {PLATFORM_OPTIONS.map((p) => <option key={p} value={p} className="bg-gray-900">{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">URL</label>
            <input type="url" required value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Icon Name</label>
            <input type="text" value={icon} onChange={(e) => setIcon(e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Sort Order</label>
              <input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Published</label>
              <select value={published ? 'true' : 'false'} onChange={(e) => setPublished(e.target.value === 'true')} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50">
                <option value="true" className="bg-gray-900">Yes</option>
                <option value="false" className="bg-gray-900">No</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Save
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2.5 glass text-gray-300 font-semibold rounded-lg">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
