import { useState, useEffect } from 'react';
import { supabase, type PageContent } from './supabase';

type PageContentMap = Record<string, PageContent>;
let cache: PageContentMap | null = null;
let loadingPromise: Promise<PageContentMap> | null = null;

export async function loadAllPageContents(): Promise<PageContentMap> {
  if (cache) return cache;
  if (loadingPromise) return loadingPromise;
  loadingPromise = (async () => {
    const { data } = await supabase
      .from('page_contents')
      .select('id,page_key,hero_image_url,hero_title,hero_subtitle,body_content,section_services_image,section_about_image,section_contact_image,section_hero_image,created_at,updated_at');
    const map: PageContentMap = {};
    (data || []).forEach((pc) => { map[pc.page_key] = pc as PageContent; });
    cache = map;
    loadingPromise = null;
    return map;
  })();
  return loadingPromise;
}

export function clearPageContentCache() {
  cache = null;
  loadingPromise = null;
}

export function usePageContent(pageKey: string): { content: PageContent | null; loading: boolean } {
  const [content, setContent] = useState<PageContent | null>(cache?.[pageKey] || null);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache && cache[pageKey]) {
      setContent(cache[pageKey]);
      setLoading(false);
      return;
    }
    loadAllPageContents().then((map) => {
      setContent(map[pageKey] || null);
      setLoading(false);
    });
  }, [pageKey]);

  return { content, loading };
}
