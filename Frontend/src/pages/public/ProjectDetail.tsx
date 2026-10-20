import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { getApiErrorMessage } from '../../api/client';
import { getProjectBySlug, type ProjectDetail as ProjectDetailData } from '../../api/projectsService';
import { getSkillColor } from '../../api/skillsService';

export default function ProjectDetail() {
  const { slug = '' } = useParams<{ slug: string }>();

  // La key reinicia el estado al navegar de un proyecto a otro
  return <ProjectDetailContent key={slug} slug={slug} />;
}

function ProjectDetailContent({ slug }: { slug: string }) {
  const [project, setProject] = useState<ProjectDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getProjectBySlug(slug)
      .then((data) => {
        if (cancelled) return;
        // Los borradores no se exponen en la parte pública
        if (data.isPublished) setProject(data);
        else setError('Proyecto no encontrado.');
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(
          axios.isAxiosError(err) && err.response?.status === 404
            ? 'Proyecto no encontrado.'
            : getApiErrorMessage(err, 'No se pudo cargar el proyecto.'),
        );
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-24">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 transition-colors hover:text-emerald-400"
      >
        <span aria-hidden="true">&larr;</span>
        Volver al inicio
      </Link>

      {isLoading ? (
        <p className="mt-16 animate-pulse text-center text-slate-500">Cargando...</p>
      ) : error || !project ? (
        <p className="mt-16 rounded-xl border border-dashed border-slate-800 py-12 text-center text-slate-500">
          {error ?? 'Proyecto no encontrado.'}
        </p>
      ) : (
        <article className="mt-8">
          <header>
            {project.isFeatured && (
              <span className="mb-4 inline-block rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-slate-950">
                Destacado
              </span>
            )}
            <h1 className="text-2xl font-bold tracking-tight wrap-break-word text-slate-100 sm:text-4xl">{project.title}</h1>
            {project.summary && <p className="mt-3 text-base text-slate-400 sm:text-lg">{project.summary}</p>}
          </header>

          <div className="mt-6 aspect-video overflow-hidden rounded-xl sm:mt-8 sm:rounded-2xl border border-slate-800 bg-linear-to-br from-slate-800 to-slate-900">
            {project.coverImageUrl ? (
              <img src={project.coverImageUrl} alt={project.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-5xl font-black sm:text-7xl text-slate-700">
                {project.title.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* whitespace-pre-wrap respeta los saltos de línea y viñetas tal como se redactaron */}
          <div className="mt-10 whitespace-pre-wrap wrap-break-word text-base leading-relaxed text-slate-300">
            {project.description}
          </div>

          {project.skills.length > 0 && (
            <div className="mt-10">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-emerald-400">Tecnologías</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.skills.map((skill) => (
                  <li
                    key={skill.id}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 text-sm text-slate-300"
                  >
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: getSkillColor(skill) }}
                    />
                    {skill.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(project.repoUrl || project.demoUrl) && (
            <div className="mt-12 flex flex-col gap-3 border-t border-slate-800 pt-8 sm:flex-row">
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-slate-700 px-6 py-3 text-center text-sm font-medium text-slate-300 transition-colors hover:border-slate-500 hover:text-slate-100"
                >
                  Ver Repositorio
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-emerald-500/10 px-6 py-3 text-center text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500 hover:text-slate-950"
                >
                  Ver Demo
                </a>
              )}
            </div>
          )}
        </article>
      )}
    </section>
  );
}
