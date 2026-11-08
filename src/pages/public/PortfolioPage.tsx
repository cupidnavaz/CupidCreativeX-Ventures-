import { useState, useEffect } from 'react';
import { supabase, type Project } from '@/lib/supabase';
import { useTheme } from '@/lib/theme';
import { PageHero } from '@/components/PageHero';
import { ExternalLink, Eye } from 'lucide-react';
import { ProjectOverviewModal } from '@/components/public/ProjectOverviewModal';
import { getLiveProjectUrl } from '@/lib/projectLinks';

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { settings } = useTheme();

  const primary = settings?.color_primary || '#f97316';
  const bg = settings?.color_bg || '#0a0a0f';
  const headingFont = settings?.font_heading || 'Space Grotesk';
  const hf = `'${headingFont}', sans-serif`;

  useEffect(() => {
    supabase.from('projects').select('*').eq('published', true).order('sort_order').then(({ data }) => setProjects(data || []));
  }, []);

  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];
  const filtered = filter === 'All' ? projects : projects.filter((p) => p.category === filter);

  return (
    <div style={{ backgroundColor: bg }}>
      <PageHero pageKey="portfolio" defaultTitle="Our Portfolio" defaultSubtitle="Explore some of the projects we've crafted for clients across industries." gradientWord="Portfolio" />

      <div className="w-full px-8 md:px-12 lg:px-20 pb-20">
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all"
              style={filter === cat ? {
                background: `linear-gradient(to right, ${primary}, ${primary}dd)`,
                color: 'white',
              } : undefined}
            >
              <span className={filter === cat ? '' : 'text-gray-400'}>{cat}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <article
              key={project.id}
              className="group relative overflow-hidden rounded-2xl glass"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-6 text-center text-lg font-semibold text-gray-400" style={{ fontFamily: hf }}>
                    {project.title}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="text-xs font-medium uppercase tracking-wider" style={{ color: primary }}>{project.category}</span>
                  <h3 className="text-lg font-bold text-white mt-1" style={{ fontFamily: hf }}>
                    {project.title}
                  </h3>
                  {project.client && <p className="text-sm text-gray-400">{project.client}</p>}
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>
                {project.tools_used?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4" aria-label="Tools used">
                    {project.tools_used.map((tool) => (
                      <span key={tool} className="px-2.5 py-1 rounded-full border border-white/10 text-xs text-gray-400">
                        {tool}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 text-sm font-semibold text-white hover:border-white/30"
                  >
                    <Eye className="h-4 w-4" /> Preview project
                  </button>
                  {getLiveProjectUrl(project) && (
                    <a
                      href={getLiveProjectUrl(project) ?? undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold hover:text-white"
                      style={{ color: primary }}
                    >
                      Live project <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      {selectedProject && (
        <ProjectOverviewModal
          project={selectedProject}
          headingFont={hf}
          primary={primary}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
