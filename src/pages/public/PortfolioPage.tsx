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
  const accent = settings?.color_accent || '#06b6d4';
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
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className="px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 glass glass-hover cursor-pointer"
              style={filter === cat ? {
                background: `linear-gradient(110deg, ${primary}, ${accent})`,
                color: 'white',
                boxShadow: `0 8px 20px -4px ${primary}50`,
                borderColor: `${primary}80`,
              } : {
                color: '#9ca3af',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((project) => (
            <article
              key={project.id}
              className="group relative overflow-hidden rounded-2xl glass transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between"
            >
              {/* Card Neon Border & Glow Effect on Hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20"
                style={{
                  boxShadow: `inset 0 0 25px ${primary}25, 0 15px 35px -5px ${primary}35`,
                  border: `1px solid ${primary}50`,
                }}
              />

              {/* Ambient background glow on hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" 
                style={{ background: `radial-gradient(circle at center top, ${accent}15, transparent 75%)` }}
              />

              <div>
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-6 text-center text-lg font-semibold text-gray-400" style={{ fontFamily: hf }}>
                      {project.title}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: primary }}>{project.category}</span>
                    <h3 className="text-xl font-bold text-white mt-1" style={{ fontFamily: hf }}>
                      {project.title}
                    </h3>
                    {project.client && <p className="text-sm text-gray-400 mt-0.5">{project.client}</p>}
                  </div>
                </div>
                <div className="p-6 relative z-10">
                  <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">{project.description}</p>
                  {project.tools_used?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4" aria-label="Tools used">
                      {project.tools_used.map((tool) => (
                        <span key={tool} className="px-2.5 py-1 rounded-full border border-white/10 text-xs text-gray-300 bg-white/5">
                          {tool}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 pt-0 relative z-10 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedProject(project)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white hover:border-white/30 bg-white/5 transition-colors cursor-pointer"
                >
                  <Eye className="h-4 w-4" /> Preview project
                </button>
                {getLiveProjectUrl(project) && (
                  <a
                    href={getLiveProjectUrl(project) ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold hover:text-white transition-colors"
                    style={{ color: primary }}
                  >
                    Live project <ExternalLink className="h-4 w-4" />
                  </a>
                )}
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