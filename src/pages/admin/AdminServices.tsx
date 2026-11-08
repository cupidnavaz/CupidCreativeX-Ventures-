import { useState, useEffect, useRef } from 'react';
import { supabase, type Service } from '@/lib/supabase';
import { Plus, Edit2, Trash2, X, Save, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

const ICON_OPTIONS = ['Code', 'Smartphone', 'Palette', 'Sparkles', 'TrendingUp', 'Cloud', 'PenTool', 'Camera', 'Zap', 'Globe', 'Database', 'Shield'];

export default function AdminServices() {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('services').select('*').order('sort_order');
    setItems(data || []);
    setLoading(false);
  };

  const handleSave = async (data: Partial<Service>) => {
    if (editing) {
      await supabase.from('services').update(data).eq('id', editing.id);
    } else {
      await supabase.from('services').insert(data);
    }
    setShowForm(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    await supabase.from('services').delete().eq('id', id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Services</h2>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item.id} className="glass rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.title} className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-white/10" />
                    ) : (
                      <div className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 border border-white/10 bg-white/5">
                        <ImageIcon className="w-6 h-6 text-gray-600" />
                      </div>
                    )}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${item.published ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                          {item.published ? 'Published' : 'Draft'}
                        </span>
                        <span className="text-xs text-gray-600">Order: {item.sort_order}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white truncate">{item.title}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-2">{item.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {item.features.slice(0, 4).map((f, i) => (
                      <span key={i} className="px-2 py-1 bg-white/5 rounded text-xs text-gray-500">{f}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
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
        <ServiceForm
          initial={editing}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}
    </div>
  );
}

function ServiceForm({ initial, onSave, onClose }: { initial: Service | null; onSave: (data: Partial<Service>) => void; onClose: () => void }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [slug, setSlug] = useState(initial?.slug || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [icon, setIcon] = useState(initial?.icon || 'Code');
  const [features, setFeatures] = useState((initial?.features || []).join('\n'));
  const [imageUrl, setImageUrl] = useState(initial?.image_url || '');
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 0);
  const [published, setPublished] = useState(initial?.published ?? true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList) => {
    const file = files[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `service-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: upErr } = await supabase.storage.from('media').upload(fileName, file);
    if (!upErr) {
      const { data: pubData } = supabase.storage.from('media').getPublicUrl(fileName);
      setImageUrl(pubData.publicUrl);
    }
    setUploading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
      description,
      icon,
      features: features.split('\n').map((f) => f.trim()).filter(Boolean),
      image_url: imageUrl || null,
      sort_order: sortOrder,
      published,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass rounded-2xl p-8 w-full max-w-lg my-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">{initial ? 'Edit Service' : 'Add Service'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image uploader */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Display Image</label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center flex-shrink-0">
                {imageUrl ? (
                  <img src={imageUrl} alt="Service preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-600" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="w-full px-4 py-2.5 glass glass-hover rounded-lg text-sm text-gray-300 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : <><Upload className="w-4 h-4" /> Upload Image</>}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files && handleUpload(e.target.files)}
                />
                {imageUrl && (
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="text-xs text-gray-500 hover:text-red-400 transition-colors"
                  >
                    Remove image
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Title</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Slug (optional)</label>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" placeholder="auto-generated from title" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Description</label>
            <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50 resize-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Icon</label>
            <select value={icon} onChange={(e) => setIcon(e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50">
              {ICON_OPTIONS.map((ic) => <option key={ic} value={ic} className="bg-gray-900">{ic}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Features (one per line)</label>
            <textarea value={features} onChange={(e) => setFeatures(e.target.value)} rows={5} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50 resize-none" placeholder="Responsive Design&#10;SEO Optimized&#10;Fast Loading" />
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
