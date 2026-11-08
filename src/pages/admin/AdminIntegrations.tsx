import { useState, useEffect } from 'react';
import { supabase, type Integration } from '@/lib/supabase';
import { Plus, Edit2, Trash2, X, Save, Plug, Webhook } from 'lucide-react';

const TYPE_OPTIONS = ['API', 'Webhook', 'OAuth', 'SMTP', 'Database', 'Custom'];

export default function AdminIntegrations() {
  const [items, setItems] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Integration | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('integrations').select('*').order('created_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  const handleSave = async (data: Partial<Integration>) => {
    if (editing) {
      await supabase.from('integrations').update(data).eq('id', editing.id);
    } else {
      await supabase.from('integrations').insert(data);
    }
    setShowForm(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this integration?')) return;
    await supabase.from('integrations').delete().eq('id', id);
    load();
  };

  const handleToggle = async (item: Integration) => {
    await supabase.from('integrations').update({ enabled: !item.enabled }).eq('id', item.id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Integrations & Connectors</h2>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Integration
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <Plug className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500">No integrations configured yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item.id} className="glass rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {item.type === 'Webhook' ? <Webhook className="w-4 h-4 text-orange-400" /> : <Plug className="w-4 h-4 text-orange-400" />}
                    <span className="text-xs text-gray-500">{item.type}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${item.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {item.enabled ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-400 mb-2">{item.provider}</p>
                  {item.endpoint_url && <p className="text-xs text-gray-500 truncate">Endpoint: {item.endpoint_url}</p>}
                  {item.webhook_url && <p className="text-xs text-gray-500 truncate">Webhook: {item.webhook_url}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => handleToggle(item)} className="p-2 glass glass-hover rounded-lg text-gray-400 hover:text-green-400 text-xs">
                    {item.enabled ? 'Disable' : 'Enable'}
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
        <IntegrationForm
          initial={editing}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}
    </div>
  );
}

function IntegrationForm({ initial, onSave, onClose }: { initial: Integration | null; onSave: (data: Partial<Integration>) => void; onClose: () => void }) {
  const [name, setName] = useState(initial?.name || '');
  const [type, setType] = useState(initial?.type || 'API');
  const [provider, setProvider] = useState(initial?.provider || '');
  const [endpointUrl, setEndpointUrl] = useState(initial?.endpoint_url || '');
  const [apiKeyRef, setApiKeyRef] = useState(initial?.api_key_ref || '');
  const [webhookUrl, setWebhookUrl] = useState(initial?.webhook_url || '');
  const [configText, setConfigText] = useState(JSON.stringify(initial?.config || {}, null, 2));
  const [enabled, setEnabled] = useState(initial?.enabled ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let config: Record<string, string> = {};
    try { config = JSON.parse(configText); } catch { config = {}; }
    onSave({ name, type, provider, endpoint_url: endpointUrl, api_key_ref: apiKeyRef, webhook_url: webhookUrl, config, enabled });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass rounded-2xl p-8 w-full max-w-lg my-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">{initial ? 'Edit Integration' : 'Add Integration'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50">
                {TYPE_OPTIONS.map((t) => <option key={t} value={t} className="bg-gray-900">{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Provider</label>
              <input type="text" value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="Stripe, Slack, etc." className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Endpoint URL</label>
            <input type="text" value={endpointUrl} onChange={(e) => setEndpointUrl(e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">API Key Reference</label>
            <input type="text" value={apiKeyRef} onChange={(e) => setApiKeyRef(e.target.value)} placeholder="env variable name or reference" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Webhook URL</label>
            <input type="text" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Config (JSON)</label>
            <textarea value={configText} onChange={(e) => setConfigText(e.target.value)} rows={4} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-gray-300 font-mono text-sm focus:outline-none focus:border-orange-500/50 resize-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Enabled</label>
            <select value={enabled ? 'true' : 'false'} onChange={(e) => setEnabled(e.target.value === 'true')} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50">
              <option value="true" className="bg-gray-900">Yes</option>
              <option value="false" className="bg-gray-900">No</option>
            </select>
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
