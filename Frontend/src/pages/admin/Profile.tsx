import { useEffect, useState, type ChangeEvent, type SubmitEvent } from 'react';
import { getApiErrorMessage } from '../../api/client';
import { getProfile, updateProfile, type Profile as ProfileData, type ProfileInput } from '../../api/profileService';

interface ProfileFormState {
  fullName: string;
  headline: string;
  subheadline: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  avatarUrl: string;
  resumeUrl: string;
  availableForWork: boolean;
}

const INITIAL_FORM: ProfileFormState = {
  fullName: '',
  headline: '',
  subheadline: '',
  bio: '',
  location: '',
  email: '',
  phone: '',
  avatarUrl: '',
  resumeUrl: '',
  availableForWork: true,
};

const optional = (value: string) => value.trim() || null;

const HTTP_URL = /^https?:\/\/\S+$/i;

function toFormState(profile: ProfileData): ProfileFormState {
  return {
    fullName: profile.fullName,
    headline: profile.headline,
    subheadline: profile.subheadline ?? '',
    bio: profile.bio ?? '',
    location: profile.location ?? '',
    email: profile.email ?? '',
    phone: profile.phone ?? '',
    avatarUrl: profile.avatarUrl ?? '',
    resumeUrl: profile.resumeUrl ?? '',
    availableForWork: profile.availableForWork,
  };
}

function toProfileInput(form: ProfileFormState): ProfileInput {
  return {
    fullName: form.fullName.trim(),
    headline: form.headline.trim(),
    // los campos vacíos se envían como null para limpiar el valor en la base de datos
    subheadline: optional(form.subheadline),
    bio: optional(form.bio),
    location: optional(form.location),
    email: optional(form.email),
    phone: optional(form.phone),
    avatarUrl: optional(form.avatarUrl),
    resumeUrl: optional(form.resumeUrl),
    availableForWork: form.availableForWork,
  };
}

const inputClass =
  'block w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30';
const labelClass = 'mb-1.5 block text-sm font-medium text-slate-300';

export default function Profile() {
  const [form, setForm] = useState<ProfileFormState>(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isNew, setIsNew] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getProfile()
      .then((profile) => {
        if (cancelled) return;
        if (profile) setForm(toFormState(profile));
        else setIsNew(true);
      })
      .catch((err) => {
        if (!cancelled) setFormError(getApiErrorMessage(err, 'No se pudo cargar el perfil.'));
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
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError(null);
    if (successMessage) setSuccessMessage(null);
  };

  const toggleAvailable = () => {
    setForm((prev) => ({ ...prev, availableForWork: !prev.availableForWork }));
    if (successMessage) setSuccessMessage(null);
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (form.fullName.trim().length < 3) {
      setFormError('El nombre completo debe tener al menos 3 caracteres.');
      return;
    }

    const invalidUrl = [
      { value: form.avatarUrl, label: 'URL del avatar' },
      { value: form.resumeUrl, label: 'URL del CV' },
    ].find(({ value }) => value.trim() && !HTTP_URL.test(value.trim()));
    if (invalidUrl) {
      setFormError(`La ${invalidUrl.label} debe empezar por http:// o https://`);
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    setSuccessMessage(null);

    try {
      const saved = await updateProfile(toProfileInput(form));
      setForm(toFormState(saved));
      setSuccessMessage(isNew ? 'Perfil creado correctamente.' : 'Perfil actualizado correctamente.');
      setIsNew(false);
    } catch (err) {
      setFormError(getApiErrorMessage(err, 'No se pudo guardar el perfil.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = form.fullName.trim() && form.headline.trim() && !isSubmitting && !isLoading;

  return (
    <section className="space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-slate-100 md:text-3xl">Perfil</h2>
        <p className="mt-1 text-sm text-slate-400">Información principal que se muestra en tu portafolio.</p>
      </header>

      {isLoading ? (
        <div className="space-y-5 rounded-xl border border-slate-800 bg-slate-800/50 p-6">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-11 animate-pulse rounded-lg bg-slate-700/40" />
          ))}
          <div className="h-32 animate-pulse rounded-lg bg-slate-700/40" />
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-xl border border-slate-800 bg-slate-800/50 p-6 shadow-lg shadow-black/20"
        >
          {isNew && (
            <div className="mb-5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
              Aún no has creado tu perfil. Completa los datos y guárdalos para publicarlo.
            </div>
          )}
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
              <label htmlFor="fullName" className={labelClass}>
                Nombre completo <span className="text-red-400">*</span>
              </label>
              <input id="fullName" name="fullName" maxLength={120} required value={form.fullName} onChange={handleChange} placeholder="Juan Camilo López" className={inputClass} />
            </div>

            <div>
              <label htmlFor="headline" className={labelClass}>
                Titular <span className="text-red-400">*</span>
              </label>
              <input id="headline" name="headline" maxLength={160} required value={form.headline} onChange={handleChange} placeholder="Ingeniero de Sistemas | DevOps & Cloud | QA" className={inputClass} />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="subheadline" className={labelClass}>
                Subtítulo
              </label>
              <input id="subheadline" name="subheadline" maxLength={255} value={form.subheadline} onChange={handleChange} placeholder="Texto de apoyo que aparece debajo del titular" className={inputClass} />
            </div>

            <div>
              <label htmlFor="location" className={labelClass}>
                Ubicación
              </label>
              <input id="location" name="location" maxLength={120} value={form.location} onChange={handleChange} placeholder="Colombia" className={inputClass} />
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>
                Email de contacto
              </label>
              <input id="email" name="email" type="email" maxLength={191} value={form.email} onChange={handleChange} placeholder="tu@correo.com" className={inputClass} />
            </div>

            <div>
              <label htmlFor="phone" className={labelClass}>
                Teléfono
              </label>
              <input id="phone" name="phone" type="tel" maxLength={30} value={form.phone} onChange={handleChange} placeholder="+57 300 000 0000" className={inputClass} />
            </div>

            <div>
              <label htmlFor="avatarUrl" className={labelClass}>
                URL del avatar
              </label>
              <div className="flex gap-2">
                <input id="avatarUrl" name="avatarUrl" type="url" maxLength={500} value={form.avatarUrl} onChange={handleChange} placeholder="https://…/foto.jpg" className={inputClass} />
                <div className="flex size-10.5 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-700 bg-slate-950/60 text-xs text-slate-500">
                  {HTTP_URL.test(form.avatarUrl.trim()) ? (
                    <img src={form.avatarUrl.trim()} alt="Vista previa del avatar" className="size-full object-cover" />
                  ) : (
                    'IMG'
                  )}
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="resumeUrl" className={labelClass}>
                URL del CV
              </label>
              <input id="resumeUrl" name="resumeUrl" type="url" maxLength={500} value={form.resumeUrl} onChange={handleChange} placeholder="https://drive.google.com/…" className={inputClass} />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="bio" className={labelClass}>
                Biografía
              </label>
              <textarea id="bio" name="bio" rows={6} value={form.bio} onChange={handleChange} placeholder="Cuéntale a los visitantes quién eres y qué haces…" className={`${inputClass} resize-y`} />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 border-t border-slate-700/60 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={form.availableForWork}
                aria-labelledby="availableForWork-label"
                onClick={toggleAvailable}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 ${
                  form.availableForWork ? 'bg-emerald-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block size-5 rounded-full bg-white shadow transition-transform ${
                    form.availableForWork ? 'translate-x-5.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
              <span id="availableForWork-label" className="text-sm text-slate-300">
                Disponible para trabajar
              </span>
            </div>

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
              {isSubmitting ? 'Guardando…' : 'Guardar perfil'}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
