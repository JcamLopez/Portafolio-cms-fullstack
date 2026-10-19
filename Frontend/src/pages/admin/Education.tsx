import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { getApiErrorMessage } from '../../api/client';
import {
  createEducation,
  deleteEducation,
  EDUCATION_TYPES,
  getEducations,
  updateEducation,
  type Education as EducationItem,
  type EducationInput,
  type EducationType,
} from '../../api/educationService';

const TYPE_LABELS: Record<EducationType, string> = {
  UNDERGRADUATE: 'Grado universitario',
  MASTER: 'Máster',
  DIPLOMADO: 'Diplomado',
  BOOTCAMP: 'Bootcamp',
  COURSE: 'Curso',
  CERTIFICATION: 'Certificación',
};

interface EducationFormState {
  institution: string;
  title: string;
  type: EducationType | '';
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  credentialUrl: string;
  logoUrl: string;
}

const INITIAL_FORM: EducationFormState = {
  institution: '',
  title: '',
  type: '',
  fieldOfStudy: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  description: '',
  credentialUrl: '',
  logoUrl: '',
};

const optional = (value: string) => value.trim() || null;

// "2024-03-01T00:00:00.000Z" -> "2024-03-01" (formato de <input type="date">)
const toDateInput = (value: string | null) => (value ? value.slice(0, 10) : '');

function toEducationInput(form: EducationFormState): EducationInput {
  return {
    institution: form.institution.trim(),
    title: form.title.trim(),
    type: form.type as EducationType,
    fieldOfStudy: optional(form.fieldOfStudy),
    startDate: form.startDate || null,
    endDate: form.isCurrent ? null : form.endDate || null,
    isCurrent: form.isCurrent,
    description: optional(form.description),
    credentialUrl: optional(form.credentialUrl),
    logoUrl: optional(form.logoUrl),
  };
}

function toFormState(education: EducationItem): EducationFormState {
  return {
    institution: education.institution,
    title: education.title,
    type: education.type,
    fieldOfStudy: education.fieldOfStudy ?? '',
    startDate: toDateInput(education.startDate),
    endDate: toDateInput(education.endDate),
    isCurrent: education.isCurrent,
    description: education.description ?? '',
    credentialUrl: education.credentialUrl ?? '',
    logoUrl: education.logoUrl ?? '',
  };
}

// Las fechas se guardan como @db.Date (medianoche UTC), por eso se formatea en UTC
const monthFormatter = new Intl.DateTimeFormat('es-ES', { month: 'short', year: 'numeric', timeZone: 'UTC' });
const formatMonth = (value: string | null) => (value ? monthFormatter.format(new Date(value)) : null);

function formatPeriod(education: EducationItem): string | null {
  const start = formatMonth(education.startDate);
  const end = education.isCurrent ? 'Actualidad' : formatMonth(education.endDate);
  if (!start && !end) return null;
  return [start ?? '¿?', end ?? '¿?'].join(' — ');
}

const inputClass =
  'block w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-40 [color-scheme:dark]';
const labelClass = 'mb-1.5 block text-sm font-medium text-slate-300';

export default function Education() {
  const [educations, setEducations] = useState<EducationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [form, setForm] = useState<EducationFormState>(INITIAL_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadEducations = async () => {
    setLoadError(null);
    try {
      setEducations(await getEducations());
    } catch (err) {
      setLoadError(getApiErrorMessage(err, 'No se pudo cargar la formación.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    getEducations()
      .then((data) => {
        if (!cancelled) setEducations(data);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(getApiErrorMessage(err, 'No se pudo cargar la formación.'));
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

  // Al marcar "Actualmente estudiando" se descarta la fecha fin (el backend la rechaza si isCurrent)
  const handleCurrentToggle = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setForm((prev) => ({ ...prev, isCurrent: checked, endDate: checked ? '' : prev.endDate }));
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setEditingId(null);
    setFormError(null);
  };

  const handleEdit = (education: EducationItem) => {
    setForm(toFormState(education));
    setEditingId(education.id);
    setFormError(null);
    setSuccessMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (education: EducationItem) => {
    if (!window.confirm(`¿Eliminar "${education.title}" de ${education.institution}?`)) return;

    setDeletingId(education.id);
    setSuccessMessage(null);
    try {
      await deleteEducation(education.id);
      if (editingId === education.id) resetForm();
      setSuccessMessage(`Formación "${education.title}" eliminada.`);
      await loadEducations();
    } catch (err) {
      setLoadError(getApiErrorMessage(err, 'No se pudo eliminar la formación.'));
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (!form.isCurrent && form.startDate && form.endDate && form.endDate < form.startDate) {
      setFormError('La fecha de fin no puede ser anterior a la fecha de inicio.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    setSuccessMessage(null);

    try {
      const input = toEducationInput(form);
      const saved = editingId === null ? await createEducation(input) : await updateEducation(editingId, input);
      setSuccessMessage(
        `Formación "${saved.title}" ${editingId === null ? 'creada' : 'actualizada'} correctamente.`,
      );
      resetForm();
      await loadEducations();
    } catch (err) {
      setFormError(getApiErrorMessage(err, 'No se pudo guardar la formación.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = form.institution.trim() && form.title.trim() && form.type && !isSubmitting;

  return (
    <section className="space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-slate-100 md:text-3xl">Educación</h2>
        <p className="mt-1 text-sm text-slate-400">Registra tu formación académica, cursos y certificaciones.</p>
      </header>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-xl border border-slate-800 bg-slate-800/50 p-6 shadow-lg shadow-black/20"
      >
        <h3 className="mb-5 text-lg font-semibold text-slate-100">
          {editingId === null ? 'Nueva formación' : 'Editar formación'}
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
            <label htmlFor="institution" className={labelClass}>
              Institución <span className="text-red-400">*</span>
            </label>
            <input id="institution" name="institution" maxLength={150} required value={form.institution} onChange={handleChange} placeholder="Universidad Politécnica de Madrid" className={inputClass} />
          </div>

          <div>
            <label htmlFor="title" className={labelClass}>
              Título <span className="text-red-400">*</span>
            </label>
            <input id="title" name="title" maxLength={150} required value={form.title} onChange={handleChange} placeholder="Máster en DevOps" className={inputClass} />
          </div>

          <div>
            <label htmlFor="type" className={labelClass}>
              Tipo <span className="text-red-400">*</span>
            </label>
            <select id="type" name="type" required value={form.type} onChange={handleChange} className={inputClass}>
              <option value="" disabled>
                Selecciona un tipo
              </option>
              {EDUCATION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="fieldOfStudy" className={labelClass}>
              Campo de estudio
            </label>
            <input id="fieldOfStudy" name="fieldOfStudy" maxLength={150} value={form.fieldOfStudy} onChange={handleChange} placeholder="Ingeniería Informática" className={inputClass} />
          </div>

          <div>
            <label htmlFor="startDate" className={labelClass}>
              Fecha de inicio
            </label>
            <input id="startDate" name="startDate" type="date" value={form.startDate} onChange={handleChange} className={inputClass} />
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
              Actualmente estudiando
            </label>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className={labelClass}>
              Descripción
            </label>
            <textarea id="description" name="description" rows={4} value={form.description} onChange={handleChange} placeholder="Contenidos, proyectos destacados, logros…" className={`${inputClass} resize-y`} />
          </div>

          <div>
            <label htmlFor="credentialUrl" className={labelClass}>
              URL de la credencial
            </label>
            <input id="credentialUrl" name="credentialUrl" type="url" maxLength={500} value={form.credentialUrl} onChange={handleChange} placeholder="https://…/certificado" className={inputClass} />
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
            {isSubmitting ? 'Guardando…' : editingId === null ? 'Guardar formación' : 'Actualizar formación'}
          </button>
        </div>
      </form>

      <div>
        <div className="mb-4 flex items-baseline justify-between">
          <h3 className="text-lg font-semibold text-slate-100">Listado</h3>
          {!isLoading && !loadError && <span className="text-sm text-slate-400">{educations.length} registro(s)</span>}
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
        ) : educations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 px-6 py-12 text-center text-sm text-slate-400">
            Aún no hay formación registrada. Añade la primera con el formulario de arriba.
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {educations.map((education) => (
              <EducationCard
                key={education.id}
                education={education}
                isEditing={editingId === education.id}
                isDeleting={deletingId === education.id}
                onEdit={() => handleEdit(education)}
                onDelete={() => handleDelete(education)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

interface EducationCardProps {
  education: EducationItem;
  isEditing: boolean;
  isDeleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

function EducationCard({ education, isEditing, isDeleting, onEdit, onDelete }: EducationCardProps) {
  const period = formatPeriod(education);

  return (
    <article
      className={`flex flex-col gap-4 rounded-xl border bg-slate-800/50 p-5 shadow-lg shadow-black/20 transition ${
        isEditing ? 'border-emerald-500/60' : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      <div className="flex gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-emerald-500/10 text-lg font-bold text-emerald-400">
          {education.logoUrl ? (
            <img src={education.logoUrl} alt="" loading="lazy" className="size-10 object-contain" />
          ) : (
            education.institution.charAt(0).toUpperCase()
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="text-base font-semibold text-slate-100">{education.title}</h4>
          <p className="truncate text-sm text-slate-300">{education.institution}</p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-slate-700/60 px-2.5 py-0.5 text-xs font-medium text-slate-300">
              {TYPE_LABELS[education.type]}
            </span>
            {education.fieldOfStudy && (
              <span className="rounded-full bg-slate-700/60 px-2.5 py-0.5 text-xs font-medium text-slate-300">
                {education.fieldOfStudy}
              </span>
            )}
            {education.isCurrent && (
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                En curso
              </span>
            )}
          </div>
          {period && <p className="mt-2 text-xs capitalize text-slate-400">{period}</p>}
        </div>
      </div>

      {education.description && (
        <p className="line-clamp-3 whitespace-pre-line text-sm text-slate-400">{education.description}</p>
      )}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-slate-700/60 pt-4">
        {education.credentialUrl ? (
          <a
            href={education.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-emerald-400 hover:text-emerald-300 hover:underline"
          >
            Ver credencial ↗
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
