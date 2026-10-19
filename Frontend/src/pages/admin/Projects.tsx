import { useEffect, useRef, useState, type ChangeEvent, type SubmitEvent } from 'react';
import { getApiErrorMessage } from '../../api/client';
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
  type Project,
  type ProjectInput,
} from '../../api/projectsService';

interface ProjectFormState {
  title: string;
  slug: string;
  summary: string;
  description: string;
  repoUrl: string;
  demoUrl: string;
  coverImageUrl: string;
  isPublished: boolean;
  isFeatured: boolean;
}

const INITIAL_FORM: ProjectFormState = {
  title: '',
  slug: '',
  summary: '',
  description: '',
  repoUrl: '',
  demoUrl: '',
  coverImageUrl: '',
  isPublished: false,
  isFeatured: false,
};

// "Mi Proyecto Ñandú!" -> "mi-proyecto-nandu" (formato que exige el backend)
function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const optional = (value: string) => value.trim() || null;

function toProjectInput(form: ProjectFormState): ProjectInput {
  return {
    title: form.title.trim(),
    slug: form.slug.trim(),
    summary: optional(form.summary),
    description: form.description.trim(),
    repoUrl: optional(form.repoUrl),
    demoUrl: optional(form.demoUrl),
    coverImageUrl: optional(form.coverImageUrl),
    isPublished: form.isPublished,
    isFeatured: form.isFeatured,
  };
}

function toFormState(project: Project): ProjectFormState {
  return {
    title: project.title,
    slug: project.slug,
    summary: project.summary ?? '',
    description: project.description,
    repoUrl: project.repoUrl ?? '',
    demoUrl: project.demoUrl ?? '',
    coverImageUrl: project.coverImageUrl ?? '',
    isPublished: project.isPublished,
    isFeatured: project.isFeatured,
  };
}

const inputClass =
  'block w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30';
const labelClass = 'mb-1.5 block text-sm font-medium text-slate-300';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [form, setForm] = useState<ProjectFormState>(INITIAL_FORM);
  const [slugTouched, setSlugTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const loadProjects = async () => {
    try {
      setProjects(await getProjects());
      setLoadError(null);
    } catch (err) {
      setLoadError(getApiErrorMessage(err, 'No se pudieron cargar los proyectos.'));
    }
  };

  useEffect(() => {
    let cancelled = false;

    getProjects()
      .then((data) => {
        if (!cancelled) setProjects(data);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(getApiErrorMessage(err, 'No se pudieron cargar los proyectos.'));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;

    setForm((prev) => {
      const next = { ...prev, [name]: value };
      // El slug se genera a partir del título hasta que el usuario lo edite a mano
      if (name === 'title' && !slugTouched) next.slug = slugify(value);
      return next;
    });

    if (name === 'slug') setSlugTouched(true);
    if (formError) setFormError(null);
    if (successMessage) setSuccessMessage(null);
  };

  const handleCheckbox = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setSlugTouched(false);
    setEditingId(null);
    setFormError(null);
  };

  const handleEdit = (project: Project) => {
    setForm(toFormState(project));
    // El slug ya existe: no debe regenerarse al cambiar el título
    setSlugTouched(true);
    setEditingId(project.id);
    setFormError(null);
    setSuccessMessage(null);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCancelEdit = () => {
    resetForm();
    setSuccessMessage(null);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este proyecto?')) return;

    setDeletingId(id);
    setSuccessMessage(null);

    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((project) => project.id !== id));
      if (editingId === id) resetForm();
    } catch (err) {
      window.alert(getApiErrorMessage(err, 'No se pudo eliminar el proyecto.'));
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setFormError(null);
    setSuccessMessage(null);

    try {
      if (editingId !== null) {
        const updated = await updateProject(editingId, toProjectInput(form));
        resetForm();
        await loadProjects();
        setSuccessMessage(`Proyecto "${updated.title}" actualizado correctamente.`);
      } else {
        const created = await createProject(toProjectInput(form));
        setProjects((prev) => [created, ...prev]);
        resetForm();
        setSuccessMessage(`Proyecto "${created.title}" creado correctamente.`);
      }
    } catch (err) {
      setFormError(
        getApiErrorMessage(err, editingId !== null ? 'No se pudo actualizar el proyecto.' : 'No se pudo crear el proyecto.'),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditing = editingId !== null;
  const canSubmit = form.title.trim() && form.slug.trim() && form.description.trim() && !isSubmitting;

  return (
    <section className="space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-slate-100 md:text-3xl">Proyectos</h2>
        <p className="mt-1 text-sm text-slate-400">Crea y gestiona los proyectos que se muestran en tu portafolio.</p>
      </header>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        className={`scroll-mt-6 rounded-xl border bg-slate-800/50 p-6 shadow-lg shadow-black/20 transition ${
          isEditing ? 'border-emerald-500/40' : 'border-slate-800'
        }`}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-slate-100">{isEditing ? 'Editar proyecto' : 'Nuevo proyecto'}</h3>
          {isEditing && (
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
              Modo edición
            </span>
          )}
        </div>

        {formError && (
          <div role="alert" className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {formError}
          </div>
        )}
        {successMessage && (
          <div role="status" className="mb-5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            {successMessage}
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="title" className={labelClass}>
              Título <span className="text-red-400">*</span>
            </label>
            <input id="title" name="title" maxLength={150} required value={form.title} onChange={handleChange} placeholder="Mi proyecto" className={inputClass} />
          </div>

          <div>
            <label htmlFor="slug" className={labelClass}>
              Slug <span className="text-red-400">*</span>
            </label>
            <input id="slug" name="slug" maxLength={160} required value={form.slug} onChange={handleChange} placeholder="mi-proyecto" className={`${inputClass} font-mono`} />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="summary" className={labelClass}>
              Resumen
            </label>
            <input id="summary" name="summary" maxLength={300} value={form.summary} onChange={handleChange} placeholder="Texto corto para la tarjeta del proyecto" className={inputClass} />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className={labelClass}>
              Descripción <span className="text-red-400">*</span>
            </label>
            <textarea id="description" name="description" rows={4} required value={form.description} onChange={handleChange} placeholder="Describe el proyecto, las tecnologías y tu rol…" className={`${inputClass} resize-y`} />
          </div>

          <div>
            <label htmlFor="repoUrl" className={labelClass}>
              URL del repositorio
            </label>
            <input id="repoUrl" name="repoUrl" type="url" value={form.repoUrl} onChange={handleChange} placeholder="https://github.com/usuario/repo" className={inputClass} />
          </div>

          <div>
            <label htmlFor="demoUrl" className={labelClass}>
              URL de la demo
            </label>
            <input id="demoUrl" name="demoUrl" type="url" value={form.demoUrl} onChange={handleChange} placeholder="https://mi-proyecto.com" className={inputClass} />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="coverImageUrl" className={labelClass}>
              URL de la imagen de portada
            </label>
            <input id="coverImageUrl" name="coverImageUrl" type="url" value={form.coverImageUrl} onChange={handleChange} placeholder="https://…/portada.png" className={inputClass} />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-slate-700/60 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-6">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" name="isPublished" checked={form.isPublished} onChange={handleCheckbox} className="size-4 accent-emerald-500" />
              Publicado
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleCheckbox} className="size-4 accent-emerald-500" />
              Destacado
            </label>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            {isEditing && (
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isSubmitting}
                className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-slate-600 hover:bg-slate-700/40 hover:text-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              disabled={!canSubmit}
              className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting && (
                <svg viewBox="0 0 24 24" fill="none" className="size-4 animate-spin">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                  <path fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z" className="opacity-75" />
                </svg>
              )}
              {isSubmitting ? 'Guardando…' : isEditing ? 'Actualizar proyecto' : 'Guardar proyecto'}
            </button>
          </div>
        </div>
      </form>

      <div>
        <div className="mb-4 flex items-baseline justify-between">
          <h3 className="text-lg font-semibold text-slate-100">Listado</h3>
          {!isLoading && !loadError && <span className="text-sm text-slate-400">{projects.length} proyecto(s)</span>}
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="h-48 animate-pulse rounded-xl border border-slate-800 bg-slate-800/40" />
            ))}
          </div>
        ) : loadError ? (
          <div role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {loadError}
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 px-6 py-12 text-center text-sm text-slate-400">
            Aún no hay proyectos. Crea el primero con el formulario de arriba.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isEditing={editingId === project.id}
                isDeleting={deletingId === project.id}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

interface ProjectCardProps {
  project: Project;
  isEditing: boolean;
  isDeleting: boolean;
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
}

const cardActionClass =
  'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

function ProjectCard({ project, isEditing, isDeleting, onEdit, onDelete }: ProjectCardProps) {
  return (
    <article
      className={`flex flex-col overflow-hidden rounded-xl border bg-slate-800/50 shadow-lg shadow-black/20 transition ${
        isEditing ? 'border-emerald-500/50 ring-1 ring-emerald-500/30' : 'border-slate-800 hover:border-slate-700'
      } ${isDeleting ? 'opacity-60' : ''}`}
    >
      {project.coverImageUrl && (
        <img src={project.coverImageUrl} alt="" loading="lazy" className="h-40 w-full object-cover" />
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex flex-wrap gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              project.isPublished ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700/60 text-slate-300'
            }`}
          >
            {project.isPublished ? 'Publicado' : 'Borrador'}
          </span>
          {project.isFeatured && (
            <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">Destacado</span>
          )}
        </div>

        <h4 className="text-base font-semibold text-slate-100">{project.title}</h4>
        <p className="mt-0.5 font-mono text-xs text-slate-500">/{project.slug}</p>
        <p className="mt-3 line-clamp-3 text-sm text-slate-400">{project.summary || project.description}</p>

        {(project.repoUrl || project.demoUrl) && (
          <div className="mt-auto flex gap-4 pt-4 text-sm font-medium">
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noreferrer" className="text-emerald-400 hover:text-emerald-300">
                Repositorio ↗
              </a>
            )}
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noreferrer" className="text-emerald-400 hover:text-emerald-300">
                Demo ↗
              </a>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 border-t border-slate-700/60 px-5 py-3">
        <button
          type="button"
          onClick={() => onEdit(project)}
          disabled={isDeleting}
          aria-label={`Editar ${project.title}`}
          className={`${cardActionClass} text-slate-300 hover:bg-slate-700/60 hover:text-slate-100 focus-visible:outline-slate-500`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
          Editar
        </button>
        <button
          type="button"
          onClick={() => onDelete(project.id)}
          disabled={isDeleting}
          aria-label={`Eliminar ${project.title}`}
          className={`${cardActionClass} text-red-400 hover:bg-red-500/10 hover:text-red-300 focus-visible:outline-red-500`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
            <path d="M3 6h18" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          </svg>
          {isDeleting ? 'Eliminando…' : 'Eliminar'}
        </button>
      </div>
    </article>
  );
}
