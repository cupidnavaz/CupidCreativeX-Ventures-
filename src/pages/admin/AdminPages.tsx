import { useState, useEffect, useRef } from 'react';
import { supabase, type HeroCarouselImage, type PageContent } from '@/lib/supabase';
import { clearPageContentCache } from '@/lib/pageContent';
import {
  HERO_IMAGE_FITS,
  HERO_IMAGE_OVERLAYS,
  getHeroImageOverlayStyle,
  isHeroImageFit,
  isHeroImageOverlay,
  normalizeHeroImageColor,
  type HeroImageFit,
  type HeroImageOverlay,
} from '@/lib/heroImage';
import { ArrowDown, ArrowUp, Save, Trash2, Upload, Check } from 'lucide-react';

const PAGES = [
  { key: 'home', label: 'Home' },
  { key: 'services', label: 'Services' },
  { key: 'portfolio', label: 'Portfolio' },
  { key: 'about', label: 'About' },
  { key: 'team', label: 'Team' },
  { key: 'blog', label: 'Blog' },
  { key: 'contact', label: 'Contact' },
];

const SECTION_IMAGES = [
  { key: 'section_hero_image', label: 'Home Hero Banner Image' },
  { key: 'section_services_image', label: 'Services Section Image' },
  { key: 'section_about_image', label: 'About Section Image' },
  { key: 'section_contact_image', label: 'Contact Section Image' },
] as const;

type SectionImageKey = typeof SECTION_IMAGES[number]['key'];

export default function AdminPages() {
  const [contents, setContents] = useState<Record<string, PageContent>>({});
  const [selectedKey, setSelectedKey] = useState('home');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const carouselFileInput = useRef<HTMLInputElement>(null);

  const [heroImage, setHeroImage] = useState('');
  const [heroImageWidth, setHeroImageWidth] = useState('560');
  const [heroImageHeight, setHeroImageHeight] = useState('420');
  const [heroImageFit, setHeroImageFit] = useState<HeroImageFit>('cover');
  const [heroImageOverlay, setHeroImageOverlay] = useState<HeroImageOverlay>('gradient');
  const [heroImageOverlayColor, setHeroImageOverlayColor] = useState('#0a0a0f');
  const [heroImageOverlayOpacity, setHeroImageOverlayOpacity] = useState('35');
  const [heroCarouselImages, setHeroCarouselImages] = useState<HeroCarouselImage[]>([]);
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [sectionImages, setSectionImages] = useState<Record<SectionImageKey, string>>({
    section_hero_image: '',
    section_services_image: '',
    section_about_image: '',
    section_contact_image: '',
  });
  const [bodyText, setBodyText] = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('page_contents').select('*');
    if (error) {
      setPageError(`Could not load page content: ${error.message}`);
      setLoading(false);
      return;
    }
    const map: Record<string, PageContent> = {};
    (data || []).forEach((pc) => { map[pc.page_key] = pc as PageContent; });
    setContents(map);
    setPageError(null);
    setLoading(false);
  };

  useEffect(() => {
    const pc = contents[selectedKey];
    setHeroImage(pc?.hero_image_url || '');
    setHeroImageWidth(String(pc?.hero_image_width || 560));
    setHeroImageHeight(String(pc?.hero_image_height || 420));
    setHeroImageFit(pc?.hero_image_fit || 'cover');
    setHeroImageOverlay(pc?.hero_image_overlay || 'gradient');
    setHeroImageOverlayColor(normalizeHeroImageColor(pc?.hero_image_overlay_color));
    setHeroImageOverlayOpacity(String(pc?.hero_image_overlay_opacity ?? 35));
    const carouselImages = pc?.body_content?.hero_carousel_images;
    setHeroCarouselImages(
      Array.isArray(carouselImages)
        ? carouselImages.filter(
            (image): image is HeroCarouselImage =>
              typeof image === 'object' &&
              image !== null &&
              'url' in image &&
              typeof image.url === 'string' &&
              'alt' in image &&
              typeof image.alt === 'string',
          )
        : [],
    );
    setHeroTitle(pc?.hero_title || '');
    setHeroSubtitle(pc?.hero_subtitle || '');
    setSectionImages({
      section_hero_image: pc?.section_hero_image || '',
      section_services_image: pc?.section_services_image || '',
      section_about_image: pc?.section_about_image || '',
      section_contact_image: pc?.section_contact_image || '',
    });
    const bodyContent = { ...(pc?.body_content || {}) };
    if (selectedKey === 'home') delete bodyContent.hero_carousel_images;
    setBodyText(JSON.stringify(bodyContent, null, 2));
  }, [selectedKey, contents]);

  const handleSave = async () => {
    setSaving(true);
    setPageError(null);
    let parsedBody: Record<string, unknown>;
    try {
      const parsed = JSON.parse(bodyText);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('Body content must be a JSON object.');
      }
      parsedBody = parsed as Record<string, unknown>;
    } catch (error) {
      setPageError(error instanceof Error ? error.message : 'Body content must be valid JSON.');
      setSaving(false);
      return;
    }

    if (selectedKey === 'home') {
      parsedBody.hero_carousel_images = heroCarouselImages;
    }

    const width = Number(heroImageWidth);
    const height = Number(heroImageHeight);
    if (!Number.isInteger(width) || width < 240 || width > 1600) {
      setPageError('Hero image width must be a whole number between 240 and 1600 pixels.');
      setSaving(false);
      return;
    }
    if (!Number.isInteger(height) || height < 180 || height > 1200) {
      setPageError('Hero image height must be a whole number between 180 and 1200 pixels.');
      setSaving(false);
      return;
    }
    const overlayOpacity = Number(heroImageOverlayOpacity);
    if (!Number.isInteger(overlayOpacity) || overlayOpacity < 0 || overlayOpacity > 80) {
      setPageError('Hero image overlay strength must be a whole number between 0 and 80 percent.');
      setSaving(false);
      return;
    }

    const existing = contents[selectedKey];
    const payload = {
      page_key: selectedKey,
      hero_image_url: heroImage,
      hero_image_width: width,
      hero_image_height: height,
      hero_image_fit: heroImageFit,
      hero_image_overlay: heroImageOverlay,
      hero_image_overlay_color: normalizeHeroImageColor(heroImageOverlayColor),
      hero_image_overlay_opacity: overlayOpacity,
      hero_title: heroTitle,
      hero_subtitle: heroSubtitle,
      body_content: parsedBody,
      section_hero_image: sectionImages.section_hero_image,
      section_services_image: sectionImages.section_services_image,
      section_about_image: sectionImages.section_about_image,
      section_contact_image: sectionImages.section_contact_image,
    };

    const result = existing
      ? await supabase.from('page_contents').update(payload).eq('id', existing.id)
      : await supabase.from('page_contents').insert(payload);
    if (result.error) {
      setPageError(`Could not save page content: ${result.error.message}`);
      setSaving(false);
      return;
    }

    clearPageContentCache();
    await load();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleUpload = async (file: File, field: string) => {
    setUploadingField(field);
    setUploadError(null);
    try {
      const url = await uploadImage(file, field);
      if (field === 'hero_image') {
        setHeroImage(url);
      } else {
        setSectionImages((prev) => ({ ...prev, [field]: url }));
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Image upload failed.');
    } finally {
      setUploadingField(null);
    }
  };

  const handleCarouselUpload = async (files: File[]) => {
    setUploadingField('hero_carousel');
    setUploadError(null);
    const failures: string[] = [];
    for (const file of Array.from(files)) {
      try {
        const url = await uploadImage(file, 'hero-carousel');
        const alt = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim() || 'Featured work';
        setHeroCarouselImages((current) => [...current, { url, alt }]);
      } catch (error) {
        failures.push(`${file.name}: ${error instanceof Error ? error.message : 'Upload failed'}`);
      }
    }
    if (failures.length) setUploadError(failures.join(' '));
    setUploadingField(null);
  };

  const uploadImage = async (file: File, field: string) => {
    if (!file.type.startsWith('image/')) throw new Error('Choose an image file.');
    const extension = file.name.split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'img';
    const fileName = `${selectedKey}-${field}-${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
    const { error } = await supabase.storage.from('media').upload(fileName, file);
    if (error) throw new Error(error.message);

    const { data } = supabase.storage.from('media').getPublicUrl(fileName);
    const { error: metadataError } = await supabase.from('media_files').insert({
      file_url: data.publicUrl,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      alt_text: `${field} for ${selectedKey}`,
      category: field === 'hero_image' ? 'hero' : field === 'hero-carousel' ? 'hero' : 'section',
    });
    if (metadataError) {
      const { error: cleanupError } = await supabase.storage.from('media').remove([fileName]);
      if (cleanupError) {
        throw new Error(`${metadataError.message}. Uploaded file cleanup failed: ${cleanupError.message}`);
      }
      throw new Error(metadataError.message);
    }
    return data.publicUrl;
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  const showSectionImages = selectedKey === 'home';

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Page Content Editor</h2>
      {pageError && (
        <p role="alert" className="mb-4 rounded-lg border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {pageError}
        </p>
      )}
      {uploadError && (
        <p role="alert" className="mb-4 rounded-lg border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {uploadError}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        {PAGES.map((p) => (
          <button
            key={p.key}
            onClick={() => setSelectedKey(p.key)}
            disabled={saving || uploadingField !== null}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={selectedKey === p.key ? {
              background: 'linear-gradient(to right, #f9731620, #06b6d410)',
              color: '#f97316',
              border: '1px solid #f9731620',
            } : undefined}
          >
            <span className={selectedKey === p.key ? '' : 'text-gray-400'}>{p.label}</span>
          </button>
        ))}
      </div>

      <div className="glass rounded-2xl p-6 space-y-5">
        {/* Hero Image for this page */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Page Hero Image</label>
          <div className="flex gap-3 items-start">
            <input
              type="text"
              value={heroImage}
              onChange={(e) => setHeroImage(e.target.value)}
              placeholder="Image URL or upload below"
              className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50"
            />
            <label className="px-4 py-2.5 glass glass-hover rounded-lg text-sm text-gray-300 cursor-pointer flex items-center gap-2">
              <Upload className="w-4 h-4" /> {uploadingField === 'hero_image' ? 'Uploading...' : 'Upload'}
              <input
                type="file"
                accept="image/*"
                disabled={saving || uploadingField !== null}
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'hero_image')}
              />
            </label>
          </div>
          {heroImage && (
            <div
              className="relative mt-3 max-w-full overflow-hidden rounded-lg bg-black/20"
              style={{ width: `min(100%, ${Number(heroImageWidth) || 560}px)`, height: `min(${Number(heroImageHeight) || 420}px, 240px)` }}
            >
              <img
                src={heroImage}
                alt="Hero preview"
                className="h-full w-full"
                style={{ objectFit: heroImageFit }}
                loading="lazy"
              />
              {heroImageOverlay !== 'none' && (
                <div
                  className="pointer-events-none absolute inset-0"
                  style={getHeroImageOverlayStyle(heroImageOverlay, heroImageOverlayColor, Number(heroImageOverlayOpacity) || 0)}
                />
              )}
            </div>
          )}
        </div>

        <section aria-labelledby="hero-image-size-heading" className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 id="hero-image-size-heading" className="text-sm font-semibold text-gray-200">Hero image size</h3>
              <p className="mt-1 text-xs text-gray-500">Set the display width and height in pixels. The image scales down to fit smaller screens.</p>
            </div>
            <button
              type="button"
              onClick={() => { setHeroImageWidth('560'); setHeroImageHeight('420'); }}
              disabled={saving || uploadingField !== null}
              className="text-xs font-medium text-gray-400 underline underline-offset-4 transition hover:text-white disabled:opacity-50"
            >
              Reset to 560 × 420
            </button>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block text-xs font-medium text-gray-400">
              Width (px)
              <input
                type="number"
                min={240}
                max={1600}
                step={10}
                value={heroImageWidth}
                onChange={(event) => setHeroImageWidth(event.target.value)}
                disabled={saving}
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:opacity-60"
              />
            </label>
            <label className="block text-xs font-medium text-gray-400">
              Height (px)
              <input
                type="number"
                min={180}
                max={1200}
                step={10}
                value={heroImageHeight}
                onChange={(event) => setHeroImageHeight(event.target.value)}
                disabled={saving}
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:opacity-60"
              />
            </label>
          </div>
        </section>

        <section aria-labelledby="hero-image-display-heading" className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <div>
            <h3 id="hero-image-display-heading" className="text-sm font-semibold text-gray-200">Image display</h3>
            <p className="mt-1 text-xs text-gray-500">Choose how the image fits its frame and whether it has a color overlay.</p>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block text-xs font-medium text-gray-400">
              Image fit
              <select
                value={heroImageFit}
                onChange={(event) => {
                  if (isHeroImageFit(event.target.value)) setHeroImageFit(event.target.value);
                }}
                disabled={saving}
                className="mt-2 w-full rounded-lg border border-white/10 bg-gray-950 px-3 py-2.5 text-sm text-white focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:opacity-60"
              >
                {HERO_IMAGE_FITS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <label className="block text-xs font-medium text-gray-400">
              Overlay style
              <select
                value={heroImageOverlay}
                onChange={(event) => {
                  if (isHeroImageOverlay(event.target.value)) setHeroImageOverlay(event.target.value);
                }}
                disabled={saving}
                className="mt-2 w-full rounded-lg border border-white/10 bg-gray-950 px-3 py-2.5 text-sm text-white focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:opacity-60"
              >
                {HERO_IMAGE_OVERLAYS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            {heroImageOverlay !== 'none' && (
              <>
                <label className="block text-xs font-medium text-gray-400">
                  Overlay color
                  <span className="mt-2 flex h-[42px] items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3">
                    <input
                      type="color"
                      aria-label="Hero image overlay color"
                      value={normalizeHeroImageColor(heroImageOverlayColor)}
                      onChange={(event) => setHeroImageOverlayColor(event.target.value)}
                      disabled={saving}
                      className="h-7 w-9 cursor-pointer rounded border-0 bg-transparent p-0 disabled:cursor-not-allowed"
                    />
                    <span className="text-sm text-gray-200">{normalizeHeroImageColor(heroImageOverlayColor)}</span>
                  </span>
                </label>
                <label className="block text-xs font-medium text-gray-400">
                  Overlay strength <span className="text-gray-500">{heroImageOverlayOpacity}%</span>
                  <input
                    type="range"
                    min={0}
                    max={80}
                    step={5}
                    value={heroImageOverlayOpacity}
                    onChange={(event) => setHeroImageOverlayOpacity(event.target.value)}
                    disabled={saving}
                    className="mt-3 block w-full accent-orange-500 disabled:opacity-60"
                  />
                </label>
              </>
            )}
          </div>
        </section>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Hero Title</label>
          <input
            type="text"
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            placeholder="Page hero title"
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Hero Subtitle</label>
          <textarea
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 resize-none"
          />
        </div>

        {/* Section Images - only for home page */}
        {showSectionImages && (
          <div className="pt-4 border-t border-white/5">
            <section aria-labelledby="hero-carousel-images-heading" className="mb-6">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h3 id="hero-carousel-images-heading" className="text-sm font-semibold text-gray-200">
                    Homepage Hero Carousel
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Add and arrange images for the homepage hero. These replace the banner and project-image fallback after you save.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => carouselFileInput.current?.click()}
                  disabled={saving || uploadingField !== null}
                  className="px-4 py-2.5 glass glass-hover rounded-lg text-sm text-gray-200 flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
                >
                  <Upload className="w-4 h-4" />
                  {uploadingField === 'hero_carousel' ? 'Uploading...' : 'Upload images'}
                </button>
                <input
                  ref={carouselFileInput}
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={saving || uploadingField !== null}
                  tabIndex={-1}
                  aria-label="Select homepage hero carousel images"
                  className="sr-only"
                  onChange={(event) => {
                    const files = Array.from(event.currentTarget.files || []);
                    if (files.length) void handleCarouselUpload(files);
                    event.currentTarget.value = '';
                  }}
                />
              </div>

              {heroCarouselImages.length ? (
                <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {heroCarouselImages.map((image, index) => (
                    <li key={`${image.url}-${index}`} className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.025]">
                      <div className="relative aspect-[16/10] bg-black/20">
                        <img src={image.url} alt={image.alt} className="h-full w-full object-cover" loading="lazy" />
                        <span className="absolute left-2 top-2 rounded-md bg-black/70 px-2 py-1 text-xs text-white">
                          Slide {index + 1}
                        </span>
                      </div>
                      <div className="space-y-3 p-3">
                        <label className="block text-xs text-gray-400">
                          Image description
                          <input
                            type="text"
                            value={image.alt}
                            onChange={(event) =>
                              setHeroCarouselImages((current) =>
                                current.map((item, itemIndex) =>
                                  itemIndex === index ? { ...item, alt: event.target.value } : item,
                                ),
                              )
                            }
                            placeholder="Describe this image"
                            className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50"
                          />
                        </label>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              aria-label={`Move slide ${index + 1} up`}
                              disabled={index === 0}
                              onClick={() =>
                                setHeroCarouselImages((current) => {
                                  const reordered = [...current];
                                  [reordered[index - 1], reordered[index]] = [reordered[index], reordered[index - 1]];
                                  return reordered;
                                })
                              }
                              className="rounded-md p-2 text-gray-400 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-400"
                            >
                              <ArrowUp className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              aria-label={`Move slide ${index + 1} down`}
                              disabled={index === heroCarouselImages.length - 1}
                              onClick={() =>
                                setHeroCarouselImages((current) => {
                                  const reordered = [...current];
                                  [reordered[index], reordered[index + 1]] = [reordered[index + 1], reordered[index]];
                                  return reordered;
                                })
                              }
                              className="rounded-md p-2 text-gray-400 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-400"
                            >
                              <ArrowDown className="h-4 w-4" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => setHeroCarouselImages((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                            className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs text-red-300 transition hover:bg-red-400/10 hover:text-red-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-300"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-gray-500">
                  No custom hero slides yet. Upload images to use them instead of the default banner and project images.
                </div>
              )}
            </section>

            <h3 className="text-sm font-semibold text-gray-300 mb-4">Section Images (Home Page)</h3>
            <div className="space-y-4">
              {SECTION_IMAGES.map((si) => (
                <div key={si.key}>
                  <label className="block text-sm text-gray-400 mb-2">{si.label}</label>
                  <div className="flex gap-3 items-start">
                    <input
                      type="text"
                      value={sectionImages[si.key]}
                      onChange={(e) => setSectionImages((prev) => ({ ...prev, [si.key]: e.target.value }))}
                      placeholder="Image URL or upload"
                      className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50"
                    />
                    <label className="px-4 py-2.5 glass glass-hover rounded-lg text-sm text-gray-300 cursor-pointer flex items-center gap-2">
                      <Upload className="w-4 h-4" /> {uploadingField === si.key ? 'Uploading...' : 'Upload'}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={saving || uploadingField !== null}
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], si.key)}
                      />
                    </label>
                  </div>
                  {sectionImages[si.key] && (
                    <div className="mt-2 rounded-lg overflow-hidden max-h-32">
                      <img src={sectionImages[si.key]} alt={si.label} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm text-gray-400 mb-1">Body Content (JSON)</label>
          <textarea
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            rows={6}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-gray-300 font-mono text-sm focus:outline-none focus:border-orange-500/50 resize-none"
            placeholder='{"section1": "Content here", "section2": "More content"}'
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={saving || uploadingField !== null}
            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg flex items-center gap-2 disabled:opacity-50"
          >
            {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}</>}
          </button>
        </div>
      </div>
    </div>
  );
}
