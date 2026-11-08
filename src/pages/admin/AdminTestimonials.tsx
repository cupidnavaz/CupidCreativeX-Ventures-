import { useState, useEffect } from 'react';
import { supabase, type Testimonial } from '@/lib/supabase';
import { Plus, Edit2, Trash2, X, Save, Star } from 'lucide-react';

export default function AdminTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('testimonials').select('*').order('sort_order');
    setItems(data || []);
    setLoading(false);
  };

  const handleSave = async (data: Partial<Testimonial>) => {
    if (editing) {
      await supabase.from('testimonials').update(data).eq('id', editing.id);
    } else {
      await supabase.from('testimonials').insert(data);
    }
    setShowForm(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    await supabase.from('testimonials').delete().eq('id', id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Testimonials</h2>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item.id} className="glass rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: item.rating }).map((_, i) => <Star key={i} className="w-3 h-3 text-orange-400" fill="currentColor" />)}
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${item.published ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {item.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 italic mb-3">"{item.quote}"</p>
                  <div className="text-white font-medium text-sm">{item.client_name}</div>
                  <div className="text-xs text-gray-500">{item.company}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => { setEditing(item); setShowForm(true); }} className="p-2 glass glass-hover rounded-lg text-gray-400 hover:text-orange-400"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 glass glass-hover rounded-lg text-gray-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && <TestimonialForm initial={editing} onSave={handleSave} onClose={() => { setShowForm(false); setEditing(null); }} />}
    </div>
  );
}

function TestimonialForm({ initial, onSave, onClose }: { initial: Testimonial | null; onSave: (data: Partial<Testimonial>) => void; onClose: () => void }) {
  const [clientName, setClientName] = useState(initial?.client_name || '');
  const [company, setCompany] = useState(initial?.company || '');
  const [quote, setQuote] = useState(initial?.quote || '');
  const [rating, setRating] = useState(initial?.rating ?? 5);
  const [avatarUrl, setAvatarUrl] = useState(initial?.avatar_url || '');
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 0);
  const [published, setPublished] = useState(initial?.published ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ client_name: clientName, company, quote, rating, avatar_url: avatarUrl, sort_order: sortOrder, published });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass rounded-2xl p-8 w-full max-w-lg my-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">{initial ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Client Name</label>
              <input type="text" required value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Company</label>
              <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Quote</label>
            <textarea required value={quote} onChange={(e) => setQuote(e.target.value)} rows={4} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Rating (1-5)</label>
              <input type="number" min={1} max={5} value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Sort Order</label>
              <input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Avatar URL</label>
            <input type="url" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" placeholder="https://..." />
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
