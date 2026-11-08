import { useEffect, useRef } from 'react';
import { ExternalLink, X } from 'lucide-react';
import type { Project } from '@/lib/supabase';
import { getLiveProjectUrl } from '@/lib/projectLinks';

export function ProjectOverviewModal({
  project,
  headingFont,
  primary,
  onClose,
}: {
  project: Project;
  headingFont: string;
  primary: string;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const liveUrl = getLiveProjectUrl(project);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!dialog.open) dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="project-overview-title"
      onClose={(event) => {
        if (!event.currentTarget.open) onClose();
      }}
      onCancel={(event) => {
        event.preventDefault();
        dialogRef.current?.close();
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          dialogRef.current?.close();
        }
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}
      className="fixed inset-0 m-0 grid h-full max-h-none w-full max-w-none place-items-center border-0 bg-transparent p-4 backdrop:bg-black/80"
    >
      <article className="relative my-auto max-h-[90dvh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0d0d16] shadow-2xl shadow-black/50">
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          aria-label="Close project overview"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white hover:bg-black/80"
        >
          <X className="h-5 w-5" />
        </button>

        {project.image_url && (
          <img
            src={project.image_url}
            alt={`${project.title} project preview`}
            className="max-h-[50vh] w-full bg-white/5 object-cover"
          />
        )}

        <div className="p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: primary }}>
            {project.category}
          </p>
          <h2
            id="project-overview-title"
            className="mt-2 text-2xl font-bold text-white sm:text-3xl"
            style={{ fontFamily: headingFont }}
          >
            {project.title}
          </h2>
          {project.client && <p className="mt-1 text-sm text-gray-400">{project.client}</p>}
          <p className="mt-5 whitespace-pre-line leading-relaxed text-gray-300">{project.description}</p>

          {project.tools_used?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-white">Tools used</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {project.tools_used.map((tool) => (
                  <li key={tool} className="rounded-full border border-white/10 px-3 py-1.5 text-sm text-gray-300">
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-lg px-5 py-3 font-semibold text-white transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ backgroundColor: primary, outlineColor: primary }}
              >
                View live project <ExternalLink className="h-4 w-4" />
              </a>
            )}
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/15 px-5 py-3 font-semibold text-gray-200 hover:border-white/30 hover:text-white"
            >
              Close overview <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </article>
    </dialog>
  );
}
