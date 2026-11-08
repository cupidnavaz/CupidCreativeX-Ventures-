import { useState, useEffect } from 'react';
import { supabase, type Plugin } from '@/lib/supabase';
import { Plus, Trash2, Puzzle, Settings, X, Save, Power, Download } from 'lucide-react';

export default function AdminPlugins() {
  const [items, setItems] = useState<Plugin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('plugins').select('*').order('installed_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this plugin?')) return;
    await supabase.from('plugins').delete().eq('id', id);
    load();
  };

  const handleToggle = async (item: Plugin) => {
    await supabase.from('plugins').update({ enabled: !item.enabled }).eq('id', item.id);
    load();
  };

  const handleInstall = async (data: Partial<Plugin>) => {
    await supabase.from('plugins').insert(data);
    setShowForm(false);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Plugins</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Install Plugin
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <Puzzle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500">No plugins installed yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item.id} className="glass rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Puzzle className="w-4 h-4 text-orange-400" />
                    <span className={`px-2 py-0.5 rounded-full text-xs ${item.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {item.enabled ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-400 mb-2">{item.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>v{item.version}</span>
                    <span>by {item.author}</span>
                    <span className="font-mono">{item.slug}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => handleToggle(item)} className="p-2 glass glass-hover rounded-lg text-gray-400 hover:text-green-400" title={item.enabled ? 'Disable' : 'Enable'}>
                    <Power className="w-4 h-4" />
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
        <PluginForm onSave={handleInstall} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}

function PluginForm({ onSave, onClose }: { onSave: (data: Partial<Plugin>) => void; onClose: () => void }) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [version, setVersion] = useState('1.0.0');
  const [author, setAuthor] = useState('');
  const [configText, setConfigText] = useState('{}');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let config: Record<string, string> = {};
    try { config = JSON.parse(configText); } catch { config = {}; }
    onSave({ name, slug: slug || name.toLowerCase().replace(/\s+/g, '-'), description, version, author, config, enabled: true });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass rounded-2xl p-8 w-full max-w-lg my-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Install Plugin</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Plugin Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Slug (optional)</label>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto-generated from name" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Version</label>
              <input type="text" value={version} onChange={(e) => setVersion(e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Author</label>
              <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Config (JSON)</label>
            <textarea value={configText} onChange={(e) => setConfigText(e.target.value)} rows={4} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-gray-300 font-mono text-sm focus:outline-none focus:border-orange-500/50 resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Install
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2.5 glass text-gray-300 font-semibold rounded-lg">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
