import { useState, useEffect, useRef } from 'react';
import { supabase, type MediaFile } from '@/lib/supabase';
import { Upload, Trash2, Copy, Check, Search, Image as ImageIcon } from 'lucide-react';

export default function AdminMedia() {
  const [items, setItems] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('media_files').select('*').order('created_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage.from('media').upload(fileName, file);
      if (upErr) continue;
      const { data: pubData } = supabase.storage.from('media').getPublicUrl(fileName);
      await supabase.from('media_files').insert({
        file_url: pubData.publicUrl,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        alt_text: '',
        category: 'general',
      });
    }
    setUploading(false);
    load();
  };

  const handleDelete = async (item: MediaFile) => {
    if (!confirm('Delete this media file?')) return;
    const path = item.file_url.split('/media/')[1];
    if (path) await supabase.storage.from('media').remove([path]);
    await supabase.from('media_files').delete().eq('id', item.id);
    load();
  };

  const copyUrl = (item: MediaFile) => {
    navigator.clipboard.writeText(item.file_url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = items.filter((i) => i.file_name.toLowerCase().includes(search.toLowerCase()));

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Media Gallery</h2>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg flex items-center gap-2 disabled:opacity-50"
        >
          <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Upload Media'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleUpload(e.target.files)}
        />
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search media..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <ImageIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500">No media files yet. Upload some images to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="glass rounded-xl overflow-hidden group">
              <div className="aspect-square overflow-hidden bg-gray-800">
                <img src={item.file_url} alt={item.alt_text || item.file_name} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <p className="text-sm text-white truncate mb-1">{item.file_name}</p>
                <p className="text-xs text-gray-500 mb-3">{formatSize(item.file_size)}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyUrl(item)}
                    className="flex-1 px-2 py-1.5 glass glass-hover rounded-lg text-xs text-gray-400 hover:text-orange-400 flex items-center justify-center gap-1"
                  >
                    {copiedId === item.id ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy URL</>}
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="px-2 py-1.5 glass glass-hover rounded-lg text-xs text-gray-400 hover:text-red-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
