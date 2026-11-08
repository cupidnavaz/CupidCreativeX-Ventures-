import { useState, useEffect } from 'react';
import { supabase, type Project } from '@/lib/supabase';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';

export default function AdminProjects() {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'warning'; message: string } | null>(null);
  const [loadError, setLoadError] = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('projects').select('*').order('sort_order');
    if (error) {
      setLoadError(`Projects could not be loaded: ${error.message}`);
    } else {
      setItems(data || []);
      setLoadError('');
    }
    setLoading(false);
  };

  const handleSave = async (data: Partial<Project>): Promise<string | null> => {
    let result = editing
      ? await supabase.from('projects').update(data).eq('id', editing.id).select('id').maybeSingle()
      : await supabase.from('projects').insert(data).select('id').single();
    let warning: string | null = null;

    if (result.error && data.tools_used && isMissingToolsColumn(result.error)) {
      const projectDetails = { ...data };
      delete projectDetails.tools_used;
      result = editing
        ? await supabase.from('projects').update(projectDetails).eq('id', editing.id).select('id').maybeSingle()
        : await supabase.from('projects').insert(projectDetails).select('id').single();
      if (!result.error) {
        warning = 'Project details were saved, but Tools used was not. Apply the latest Supabase migration to enable that field.';
      }
    }

    if (result.error) throw new Error(result.error.message);
    if (!result.data) throw new Error('No matching project was updated.');

    await load();
    setShowForm(false);
    setEditing(null);
    setNotice(warning
      ? { type: 'warning', message: warning }
      : { type: 'success', message: 'Project saved.' });
    return warning;
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      setNotice({ type: 'warning', message: `Project could not be deleted: ${error.message}` });
      return;
    }
    setNotice({ type: 'success', message: 'Project deleted.' });
    await load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Projects</h2>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {notice && (
        <div
          role="status"
          className={`mb-5 rounded-xl border p-4 text-sm ${notice.type === 'warning' ? 'border-amber-400/30 bg-amber-400/10 text-amber-200' : 'border-green-400/30 bg-green-400/10 text-green-200'}`}
        >
          <div className="flex items-start justify-between gap-4">
            <p>{notice.message}</p>
            <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss message" className="text-current/80 hover:text-current">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      {loadError && <p role="alert" className="mb-5 text-sm text-red-400">{loadError}</p>}

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="glass rounded-xl overflow-hidden">
              <div className="aspect-video bg-gray-800 overflow-hidden">
                {item.image_url && <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${item.published ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {item.published ? 'Published' : 'Draft'}
                  </span>
                  <span className="text-xs text-orange-400">{item.category}</span>
                </div>
                <h3 className="font-bold text-white mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{item.description}</p>
                {item.tools_used?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {item.tools_used.map((tool) => (
                      <span key={tool} className="px-2 py-1 rounded-full bg-white/5 text-xs text-gray-400">{tool}</span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <button onClick={() => { setEditing(item); setShowForm(true); }} className="p-2 glass glass-hover rounded-lg text-gray-400 hover:text-orange-400"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 glass glass-hover rounded-lg text-gray-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && <ProjectForm initial={editing} onSave={handleSave} onClose={() => { setShowForm(false); setEditing(null); }} />}
    </div>
  );
}

function isMissingToolsColumn(error: { code?: string; message: string }) {
  return (error.code === '42703' || error.code === 'PGRST204')
    && /tools_used/i.test(error.message);
}

function ProjectForm({ initial, onSave, onClose }: { initial: Project | null; onSave: (data: Partial<Project>) => Promise<string | null>; onClose: () => void }) {
  const [title, setTitle] = useState(initial?.title || '');
  const slug = initial?.slug || '';
  const [client, setClient] = useState(initial?.client || '');
  const [category, setCategory] = useState(initial?.category || 'Web Development');
  const [description, setDescription] = useState(initial?.description || '');
  const [toolsUsed, setToolsUsed] = useState((initial?.tools_used || []).join(', '));
  const [imageUrl, setImageUrl] = useState(initial?.image_url || '');
  const [projectUrl, setProjectUrl] = useState(initial?.project_url || '');
  const [sortOrder, setSortOrder] = useState(initial?.sort_order ?? 0);
  const [published, setPublished] = useState(initial?.published ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave({
        title,
        slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
        client,
        category,
        description,
        tools_used: [...new Set(toolsUsed.split(',').map((tool) => tool.trim()).filter(Boolean))],
        image_url: imageUrl,
        project_url: projectUrl,
        sort_order: sortOrder,
        published,
      });
    } catch (saveError) {
      setError(saveError instanceof Error ? `Project could not be saved: ${saveError.message}` : 'Project could not be saved. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass rounded-2xl p-8 w-full max-w-lg my-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">{initial ? 'Edit Project' : 'Add Project'}</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close project editor"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Title</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Client</label>
              <input type="text" value={client} onChange={(e) => setClient(e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Category</label>
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Description</label>
            <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50 resize-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1" htmlFor="project-tools-used">Tools used</label>
            <input
              id="project-tools-used"
              type="text"
              value={toolsUsed}
              onChange={(e) => setToolsUsed(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50"
              placeholder="React, Figma, Supabase"
            />
            <p className="mt-1 text-xs text-gray-500">Separate tools with commas.</p>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Image URL</label>
            <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" placeholder="https://..." />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Project URL</label>
            <input type="url" value={projectUrl} onChange={(e) => setProjectUrl(e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500/50" placeholder="https://..." />
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
          {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-60">
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={onClose} disabled={saving} className="px-4 py-2.5 glass text-gray-300 font-semibold rounded-lg disabled:opacity-60">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
