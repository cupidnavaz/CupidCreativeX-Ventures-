import { useState, useEffect } from 'react';
import { supabase, type ContactMessage } from '@/lib/supabase';
import { Mail, Trash2, Check, X, Eye } from 'lucide-react';

export default function AdminMessages() {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  const markRead = async (id: string) => {
    await supabase.from('contact_messages').update({ is_read: true }).eq('id', id);
    load();
    if (selected?.id === id) setSelected({ ...selected, is_read: true });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    await supabase.from('contact_messages').delete().eq('id', id);
    if (selected?.id === id) setSelected(null);
    load();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Contact Messages</h2>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center text-gray-500">No messages yet.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => { setSelected(item); if (!item.is_read) markRead(item.id); }}
                className={`w-full text-left glass rounded-xl p-4 transition-all ${selected?.id === item.id ? 'border-orange-500/30' : ''} ${!item.is_read ? 'border-l-2 border-l-orange-500' : ''}`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    {!item.is_read && <span className="w-2 h-2 bg-orange-500 rounded-full" />}
                    <span className="font-semibold text-white text-sm">{item.name}</span>
                  </div>
                  <span className="text-xs text-gray-600">{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
                <div className="text-sm text-gray-500 truncate">{item.subject}</div>
                <div className="text-xs text-gray-600 truncate mt-1">{item.message}</div>
              </button>
            ))}
          </div>

          <div className="lg:sticky lg:top-24 h-fit">
            {selected ? (
              <div className="glass rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{selected.subject}</h3>
                    <p className="text-sm text-gray-500">{new Date(selected.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleDelete(selected.id)} className="p-2 glass glass-hover rounded-lg text-gray-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    <button onClick={() => setSelected(null)} className="p-2 glass glass-hover rounded-lg text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">From</div>
                    <div className="text-white font-medium">{selected.name}</div>
                    <a href={`mailto:${selected.email}`} className="text-sm text-orange-400 hover:underline">{selected.email}</a>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Message</div>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <a href={`mailto:${selected.email}`} className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Reply
                  </a>
                  {!selected.is_read && (
                    <button onClick={() => markRead(selected.id)} className="px-4 py-2 glass text-gray-300 text-sm font-semibold rounded-lg flex items-center gap-2">
                      <Check className="w-4 h-4" /> Mark Read
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="glass rounded-xl p-12 text-center text-gray-500">
                <Eye className="w-8 h-8 mx-auto mb-3 opacity-30" />
                Select a message to view details
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
