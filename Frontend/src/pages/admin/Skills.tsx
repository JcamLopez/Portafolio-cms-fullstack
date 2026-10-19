import { useEffect, useRef, useState, type ChangeEvent, type SubmitEvent } from 'react';
import { getApiErrorMessage } from '../../api/client';
import {
  createSkill,
  deleteSkill,
  getSkills,
  updateSkill,
  getSkillColor,
  LEVEL_COLORS,
  SKILL_CATEGORIES,
  SKILL_LEVELS,
  type Skill,
  type SkillCategory,
  type SkillInput,
  type SkillLevel,
} from '../../api/skillsService';

const CATEGORY_LABELS: Record<SkillCategory, string> = {
  LANGUAGE: 'Lenguaje',
  FRONTEND: 'Frontend',
  BACKEND: 'Backend',
  DATABASE: 'Base de datos',
  DEVOPS: 'DevOps',
  CLOUD: 'Cloud',
  TESTING: 'Testing',
  IOT: 'IoT',
  TOOL: 'Herramienta',
  OTHER: 'Otro',
};

const LEVEL_LABELS: Record<SkillLevel, string> = {
  BEGINNER: 'Principiante',
  INTERMEDIATE: 'Intermedio',
  ADVANCED: 'Avanzado',
  EXPERT: 'Experto',
};

interface SkillFormState {
  name: string;
  slug: string;
  category: SkillCategory | '';
  level: SkillLevel | '';
  iconUrl: string;
  color: string;
  isFeatured: boolean;
}

const INITIAL_FORM: SkillFormState = {
  name: '',
  slug: '',
  category: '',
  level: '',
  iconUrl: '',
  color: '',
  isFeatured: false,
};

// "Node.js" -> "node-js" (formato que exige el backend)
function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const optional = (value: string) => value.trim() || null;

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;

function toSkillInput(form: SkillFormState): SkillInput {
  return {
    name: form.name.trim(),
    slug: form.slug.trim(),
    category: form.category as SkillCategory,
    level: form.level || null,
    iconUrl: optional(form.iconUrl),
    color: optional(form.color),
    isFeatured: form.isFeatured,
  };
}

function toFormState(skill: Skill): SkillFormState {
  return {
    name: skill.name,
    slug: skill.slug,
    category: skill.category,
    level: skill.level ?? '',
    iconUrl: skill.iconUrl ?? '',
    color: skill.color ?? '',
    isFeatured: skill.isFeatured,
  };
}

const inputClass =
  'block w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30';
const labelClass = 'mb-1.5 block text-sm font-medium text-slate-300';

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [form, setForm] = useState<SkillFormState>(INITIAL_FORM);
  const [slugTouched, setSlugTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const loadSkills = async () => {
    setLoadError(null);
    try {
      setSkills(await getSkills());
    } catch (err) {
      setLoadError(getApiErrorMessage(err, 'No se pudieron cargar las habilidades.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    getSkills()
      .then((data) => {
        if (!cancelled) setSkills(data);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(getApiErrorMessage(err, 'No se pudieron cargar las habilidades.'));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    setForm((prev) => {
      const next = { ...prev, [name]: value };
      // El slug se genera a partir del nombre hasta que el usuario lo edite a mano
      if (name === 'name' && !slugTouched) next.slug = slugify(value);
      // Al elegir nivel se sugiere su color; el usuario puede sobrescribirlo después
      if (name === 'level' && value) next.color = LEVEL_COLORS[value as SkillLevel];
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

  const handleEdit = (skill: Skill) => {
    setForm(toFormState(skill));
    // El slug ya existe: no debe regenerarse al cambiar el nombre
    setSlugTouched(true);
    setEditingId(skill.id);
    setFormError(null);
    setSuccessMessage(null);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCancelEdit = () => {
    resetForm();
    setSuccessMessage(null);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar esta habilidad?')) return;

    setDeletingId(id);
    setSuccessMessage(null);

    try {
      await deleteSkill(id);
      setSkills((prev) => prev.filter((skill) => skill.id !== id));
      if (editingId === id) resetForm();
    } catch (err) {
      window.alert(getApiErrorMessage(err, 'No se pudo eliminar la habilidad.'));
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (form.color.trim() && !HEX_COLOR.test(form.color.trim())) {
      setFormError('El color debe ser un Hex válido, ej. #3178C6');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    setSuccessMessage(null);

    try {
      if (editingId !== null) {
        const updated = await updateSkill(editingId, toSkillInput(form));
        resetForm();
        await loadSkills();
        setSuccessMessage(`Habilidad "${updated.name}" actualizada correctamente.`);
      } else {
        const created = await createSkill(toSkillInput(form));
        resetForm();
        await loadSkills();
        setSuccessMessage(`Habilidad "${created.name}" creada correctamente.`);
      }
    } catch (err) {
      setFormError(
        getApiErrorMessage(err, editingId !== null ? 'No se pudo actualizar la habilidad.' : 'No se pudo crear la habilidad.'),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditing = editingId !== null;
  const canSubmit = form.name.trim() && form.slug.trim() && form.category && !isSubmitting;

  return (
    <section className="space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-slate-100 md:text-3xl">Habilidades</h2>
        <p className="mt-1 text-sm text-slate-400">Registra las tecnologías y herramientas que dominas.</p>
      </header>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        className={`scroll-mt-6 rounded-xl border bg-slate-800/50 p-6 shadow-lg shadow-black/20 transition ${
          isEditing ? 'border-emerald-500/50 ring-1 ring-emerald-500/30' : 'border-slate-800'
        }`}
      >
        <h3 className="mb-5 text-lg font-semibold text-slate-100">{isEditing ? 'Editar habilidad' : 'Nueva habilidad'}</h3>

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
            <label htmlFor="name" className={labelClass}>
              Nombre <span className="text-red-400">*</span>
            </label>
            <input id="name" name="name" maxLength={80} required value={form.name} onChange={handleChange} placeholder="TypeScript" className={inputClass} />
          </div>

          <div>
            <label htmlFor="slug" className={labelClass}>
              Slug <span className="text-red-400">*</span>
            </label>
            <input id="slug" name="slug" maxLength={90} required value={form.slug} onChange={handleChange} placeholder="typescript" className={`${inputClass} font-mono`} />
          </div>

          <div>
            <label htmlFor="category" className={labelClass}>
              Categoría <span className="text-red-400">*</span>
            </label>
            <select id="category" name="category" required value={form.category} onChange={handleChange} className={inputClass}>
              <option value="" disabled>
                Selecciona una categoría
              </option>
              {SKILL_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {CATEGORY_LABELS[category]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="level" className={labelClass}>
              Nivel
            </label>
            <select id="level" name="level" value={form.level} onChange={handleChange} className={inputClass}>
              <option value="">Sin especificar</option>
              {SKILL_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {LEVEL_LABELS[level]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="iconUrl" className={labelClass}>
              URL del icono
            </label>
            <input id="iconUrl" name="iconUrl" type="url" maxLength={500} value={form.iconUrl} onChange={handleChange} placeholder="https://…/typescript.svg" className={inputClass} />
          </div>

          <div>
            <label htmlFor="color" className={labelClass}>
              Color (Hex)
            </label>
            <div className="flex gap-2">
              <input id="color" name="color" maxLength={7} value={form.color} onChange={handleChange} placeholder="#3178C6" className={`${inputClass} font-mono`} />
              <input
                type="color"
                aria-label="Seleccionar color"
                value={HEX_COLOR.test(form.color) ? form.color : getSkillColor({ color: null, level: form.level || null })}
                onChange={(e) => setForm((prev) => ({ ...prev, color: e.target.value.toUpperCase() }))}
                className="h-10.5 w-12 shrink-0 cursor-pointer rounded-lg border border-slate-700 bg-slate-950/60 p-1"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-slate-700/60 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleCheckbox} className="size-4 accent-emerald-500" />
            Destacada
          </label>

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
              {isSubmitting ? 'Guardando…' : isEditing ? 'Actualizar habilidad' : 'Guardar habilidad'}
            </button>
          </div>
        </div>
      </form>

      <div>
        <div className="mb-4 flex items-baseline justify-between">
          <h3 className="text-lg font-semibold text-slate-100">Listado</h3>
          {!isLoading && !loadError && <span className="text-sm text-slate-400">{skills.length} habilidad(es)</span>}
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl border border-slate-800 bg-slate-800/40" />
            ))}
          </div>
        ) : loadError ? (
          <div role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {loadError}
          </div>
        ) : skills.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 px-6 py-12 text-center text-sm text-slate-400">
            Aún no hay habilidades. Registra la primera con el formulario de arriba.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {skills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                isEditing={editingId === skill.id}
                isDeleting={deletingId === skill.id}
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

interface SkillCardProps {
  skill: Skill;
  isEditing: boolean;
  isDeleting: boolean;
  onEdit: (skill: Skill) => void;
  onDelete: (id: number) => void;
}

const cardActionClass =
  'flex size-8 items-center justify-center rounded-md transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

function SkillCard({ skill, isEditing, isDeleting, onEdit, onDelete }: SkillCardProps) {
  const accent = getSkillColor(skill);

  return (
    <article
      className={`flex items-center gap-4 rounded-xl border border-l-4 bg-slate-800/50 p-4 shadow-lg shadow-black/20 transition ${
        isEditing ? 'border-emerald-500/50 ring-1 ring-emerald-500/30' : 'border-slate-800 hover:border-slate-700'
      } ${isDeleting ? 'opacity-60' : ''}`}
      style={{ borderLeftColor: accent }}
    >
      <div
        className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg text-lg font-bold"
        style={{ backgroundColor: `${accent}1a`, color: accent }}
      >
        {skill.iconUrl ? (
          <img src={skill.iconUrl} alt="" loading="lazy" className="size-8 object-contain" />
        ) : (
          skill.name.charAt(0).toUpperCase()
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="truncate text-base font-semibold text-slate-100">{skill.name}</h4>
          {skill.isFeatured && <span className="text-amber-400" title="Destacada">★</span>}
        </div>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-slate-700/60 px-2.5 py-0.5 text-xs font-medium text-slate-300">
            {CATEGORY_LABELS[skill.category]}
          </span>
          {skill.level && (
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{ backgroundColor: `${accent}1a`, color: accent }}
            >
              {LEVEL_LABELS[skill.level]}
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-1">
        <button
          type="button"
          onClick={() => onEdit(skill)}
          disabled={isDeleting}
          aria-label={`Editar ${skill.name}`}
          title="Editar"
          className={`${cardActionClass} text-slate-400 hover:bg-slate-700/60 hover:text-slate-100 focus-visible:outline-slate-500`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onDelete(skill.id)}
          disabled={isDeleting}
          aria-label={`Eliminar ${skill.name}`}
          title={isDeleting ? 'Eliminando…' : 'Eliminar'}
          className={`${cardActionClass} text-red-400 hover:bg-red-500/10 hover:text-red-300 focus-visible:outline-red-500`}
        >
          {isDeleting ? (
            <svg viewBox="0 0 24 24" fill="none" className="size-4 animate-spin">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
              <path fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z" className="opacity-75" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
              <path d="M3 6h18" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            </svg>
          )}
        </button>
      </div>
    </article>
  );
}
