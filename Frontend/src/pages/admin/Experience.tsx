import { useEffect, useState, type ChangeEvent, type SubmitEvent } from 'react';
import { getApiErrorMessage } from '../../api/client';
import {
  createExperience,
  deleteExperience,
  EXPERIENCE_TYPES,
  getExperiences,
  updateExperience,
  WORK_MODALITIES,
  type Experience as ExperienceItem,
  type ExperienceInput,
  type ExperienceType,
  type WorkModality,
} from '../../api/experienceService';

const TYPE_LABELS: Record<ExperienceType, string> = {
  JOB: 'Empleo',
  TEACHING: 'Docencia',
  FREELANCE: 'Freelance',
  INTERNSHIP: 'Prácticas',
  VOLUNTEER: 'Voluntariado',
};

const MODALITY_LABELS: Record<WorkModality, string> = {
  ONSITE: 'Presencial',
  REMOTE: 'Remoto',
  HYBRID: 'Híbrido',
};

interface ExperienceFormState {
  role: string;
  organization: string;
  type: ExperienceType | '';
  modality: WorkModality | '';
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  companyUrl: string;
  logoUrl: string;
}

const INITIAL_FORM: ExperienceFormState = {
  role: '',
  organization: '',
  type: '',
  modality: '',
  location: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  description: '',
  companyUrl: '',
  logoUrl: '',
};

const optional = (value: string) => value.trim() || null;

// "2024-03-01T00:00:00.000Z" -> "2024-03-01" (formato de <input type="date">)
const toDateInput = (value: string | null) => (value ? value.slice(0, 10) : '');

function toExperienceInput(form: ExperienceFormState): ExperienceInput {
  return {
    role: form.role.trim(),
    organization: form.organization.trim(),
    type: form.type as ExperienceType,
    modality: form.modality || null,
    location: optional(form.location),
    startDate: form.startDate,
    endDate: form.isCurrent ? null : form.endDate || null,
    isCurrent: form.isCurrent,
    description: form.description.trim(),
    companyUrl: optional(form.companyUrl),
    logoUrl: optional(form.logoUrl),
  };
}

function toFormState(experience: ExperienceItem): ExperienceFormState {
  return {
    role: experience.role,
    organization: experience.organization,
    type: experience.type,
    modality: experience.modality ?? '',
    location: experience.location ?? '',
    startDate: toDateInput(experience.startDate),
    endDate: toDateInput(experience.endDate),
    isCurrent: experience.isCurrent,
    description: experience.description,
    companyUrl: experience.companyUrl ?? '',
    logoUrl: experience.logoUrl ?? '',
  };
}

// Las fechas se guardan como @db.Date (medianoche UTC), por eso se formatea en UTC
const monthFormatter = new Intl.DateTimeFormat('es-ES', { month: 'short', year: 'numeric', timeZone: 'UTC' });
const formatMonth = (value: string | null) => (value ? monthFormatter.format(new Date(value)) : null);

function formatPeriod(experience: ExperienceItem): string {
  const start = formatMonth(experience.startDate);
  const end = experience.isCurrent ? 'Actualidad' : (formatMonth(experience.endDate) ?? '¿?');
  return `${start} — ${end}`;
}

const inputClass =
  'block w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-40 [color-scheme:dark]';
const labelClass = 'mb-1.5 block text-sm font-medium text-slate-300';

export default function Experience() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [form, setForm] = useState<ExperienceFormState>(INITIAL_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadExperiences = async () => {
    setLoadError(null);
    try {
      setExperiences(await getExperiences());
    } catch (err) {
      setLoadError(getApiErrorMessage(err, 'No se pudo cargar la experiencia.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    getExperiences()
      .then((data) => {
        if (!cancelled) setExperiences(data);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(getApiErrorMessage(err, 'No se pudo cargar la experiencia.'));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError(null);
    if (successMessage) setSuccessMessage(null);
  };

  // Al marcar "Trabajo actual" se descarta la fecha fin (el backend la rechaza si isCurrent)
  const handleCurrentToggle = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setForm((prev) => ({ ...prev, isCurrent: checked, endDate: checked ? '' : prev.endDate }));
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setEditingId(null);
    setFormError(null);
  };

  const handleEdit = (experience: ExperienceItem) => {
    setForm(toFormState(experience));
    setEditingId(experience.id);
    setFormError(null);
    setSuccessMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (experience: ExperienceItem) => {
    if (!window.confirm(`¿Eliminar "${experience.role}" en ${experience.organization}?`)) return;

    setDeletingId(experience.id);
    setSuccessMessage(null);
    try {
      await deleteExperience(experience.id);
      if (editingId === experience.id) resetForm();
      setSuccessMessage(`Experiencia "${experience.role}" eliminada.`);
      await loadExperiences();
    } catch (err) {
      setLoadError(getApiErrorMessage(err, 'No se pudo eliminar la experiencia.'));
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (!form.isCurrent && form.endDate && form.endDate < form.startDate) {
      setFormError('La fecha de fin no puede ser anterior a la fecha de inicio.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    setSuccessMessage(null);

    try {
      const input = toExperienceInput(form);
      const saved = editingId === null ? await createExperience(input) : await updateExperience(editingId, input);
      setSuccessMessage(
        `Experiencia "${saved.role}" ${editingId === null ? 'creada' : 'actualizada'} correctamente.`,
      );
      resetForm();
      await loadExperiences();
    } catch (err) {
      setFormError(getApiErrorMessage(err, 'No se pudo guardar la experiencia.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit =
    form.role.trim() &&
    form.organization.trim() &&
    form.type &&
    form.startDate &&
    form.description.trim() &&
    !isSubmitting;

  return (
    <section className="space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-slate-100 md:text-3xl">Experiencia</h2>
        <p className="mt-1 text-sm text-slate-400">Registra tu experiencia laboral, docencia y proyectos freelance.</p>
      </header>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-xl border border-slate-800 bg-slate-800/50 p-6 shadow-lg shadow-black/20"
      >
        <h3 className="mb-5 text-lg font-semibold text-slate-100">
          {editingId === null ? 'Nueva experiencia' : 'Editar experiencia'}
        </h3>

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
            <label htmlFor="role" className={labelClass}>
              Rol / Cargo <span className="text-red-400">*</span>
            </label>
            <input id="role" name="role" maxLength={150} required value={form.role} onChange={handleChange} placeholder="Desarrollador Full Stack" className={inputClass} />
          </div>

          <div>
            <label htmlFor="organization" className={labelClass}>
              Organización / Empresa <span className="text-red-400">*</span>
            </label>
            <input id="organization" name="organization" maxLength={150} required value={form.organization} onChange={handleChange} placeholder="Acme S.A.S." className={inputClass} />
          </div>

          <div>
            <label htmlFor="type" className={labelClass}>
              Tipo <span className="text-red-400">*</span>
            </label>
            <select id="type" name="type" required value={form.type} onChange={handleChange} className={inputClass}>
              <option value="" disabled>
                Selecciona un tipo
              </option>
              {EXPERIENCE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="modality" className={labelClass}>
              Modalidad
            </label>
            <select id="modality" name="modality" value={form.modality} onChange={handleChange} className={inputClass}>
              <option value="">Sin especificar</option>
              {WORK_MODALITIES.map((modality) => (
                <option key={modality} value={modality}>
                  {MODALITY_LABELS[modality]}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="location" className={labelClass}>
              Ubicación
            </label>
            <input id="location" name="location" maxLength={120} value={form.location} onChange={handleChange} placeholder="Medellín, Colombia" className={inputClass} />
          </div>

          <div>
            <label htmlFor="startDate" className={labelClass}>
              Fecha de inicio <span className="text-red-400">*</span>
            </label>
            <input id="startDate" name="startDate" type="date" required value={form.startDate} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label htmlFor="endDate" className={labelClass}>
              Fecha de fin
            </label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              min={form.startDate || undefined}
              value={form.endDate}
              onChange={handleChange}
              disabled={form.isCurrent}
              className={inputClass}
            />
            <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" name="isCurrent" checked={form.isCurrent} onChange={handleCurrentToggle} className="size-4 accent-emerald-500" />
              Trabajo actual
            </label>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className={labelClass}>
              Descripción <span className="text-red-400">*</span>
            </label>
            <textarea id="description" name="description" rows={4} required value={form.description} onChange={handleChange} placeholder="Responsabilidades, tecnologías, logros…" className={`${inputClass} resize-y`} />
          </div>

          <div>
            <label htmlFor="companyUrl" className={labelClass}>
              URL de la empresa
            </label>
            <input id="companyUrl" name="companyUrl" type="url" maxLength={500} value={form.companyUrl} onChange={handleChange} placeholder="https://empresa.com" className={inputClass} />
          </div>

          <div>
            <label htmlFor="logoUrl" className={labelClass}>
              URL del logo
            </label>
            <input id="logoUrl" name="logoUrl" type="url" maxLength={500} value={form.logoUrl} onChange={handleChange} placeholder="https://…/logo.png" className={inputClass} />
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-700/60 pt-5 sm:flex-row sm:justify-end">
          {editingId !== null && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-slate-100"
            >
              Cancelar edición
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
            {isSubmitting ? 'Guardando…' : editingId === null ? 'Guardar experiencia' : 'Actualizar experiencia'}
          </button>
        </div>
      </form>

      <div>
        <div className="mb-4 flex items-baseline justify-between">
          <h3 className="text-lg font-semibold text-slate-100">Listado</h3>
          {!isLoading && !loadError && <span className="text-sm text-slate-400">{experiences.length} registro(s)</span>}
        </div>

        {isLoading ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {Array.from({ length: 2 }, (_, i) => (
              <div key={i} className="h-36 animate-pulse rounded-xl border border-slate-800 bg-slate-800/40" />
            ))}
          </div>
        ) : loadError ? (
          <div role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {loadError}
          </div>
        ) : experiences.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 px-6 py-12 text-center text-sm text-slate-400">
            Aún no hay experiencia registrada. Añade la primera con el formulario de arriba.
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {experiences.map((experience) => (
              <ExperienceCard
                key={experience.id}
                experience={experience}
                isEditing={editingId === experience.id}
                isDeleting={deletingId === experience.id}
                onEdit={() => handleEdit(experience)}
                onDelete={() => handleDelete(experience)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

interface ExperienceCardProps {
  experience: ExperienceItem;
  isEditing: boolean;
  isDeleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

function ExperienceCard({ experience, isEditing, isDeleting, onEdit, onDelete }: ExperienceCardProps) {
  return (
    <article
      className={`flex flex-col gap-4 rounded-xl border bg-slate-800/50 p-5 shadow-lg shadow-black/20 transition ${
        isEditing ? 'border-emerald-500/60' : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      <div className="flex gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-emerald-500/10 text-lg font-bold text-emerald-400">
          {experience.logoUrl ? (
            <img src={experience.logoUrl} alt="" loading="lazy" className="size-10 object-contain" />
          ) : (
            experience.organization.charAt(0).toUpperCase()
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="text-base font-semibold text-slate-100">{experience.role}</h4>
          <p className="truncate text-sm text-slate-300">{experience.organization}</p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-slate-700/60 px-2.5 py-0.5 text-xs font-medium text-slate-300">
              {TYPE_LABELS[experience.type]}
            </span>
            {experience.modality && (
              <span className="rounded-full bg-slate-700/60 px-2.5 py-0.5 text-xs font-medium text-slate-300">
                {MODALITY_LABELS[experience.modality]}
              </span>
            )}
            {experience.isCurrent && (
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                Actual
              </span>
            )}
          </div>
          <p className="mt-2 text-xs capitalize text-slate-400">
            {formatPeriod(experience)}
            {experience.location && <span className="normal-case"> · {experience.location}</span>}
          </p>
        </div>
      </div>

      <p className="line-clamp-3 whitespace-pre-line text-sm text-slate-400">{experience.description}</p>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-slate-700/60 pt-4">
        {experience.companyUrl ? (
          <a
            href={experience.companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-emerald-400 hover:text-emerald-300 hover:underline"
          >
            Sitio de la empresa ↗
          </a>
        ) : (
          <span />
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-700 hover:text-slate-100"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? 'Eliminando…' : 'Eliminar'}
          </button>
        </div>
      </div>
    </article>
  );
}
