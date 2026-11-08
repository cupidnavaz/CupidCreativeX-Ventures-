import type { Project } from '@/lib/supabase';

export function getLiveProjectUrl(project: Project) {
  if (!project.project_url || project.project_url === '#') return null;

  try {
    const url = new URL(project.project_url);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null;
  } catch {
    return null;
  }
}
