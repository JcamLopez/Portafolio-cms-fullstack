import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { getApiErrorMessage } from '../../api/client';
import { getEducations, type Education, type EducationType } from '../../api/educationService';
import {
  getExperiences,
  type Experience,
  type ExperienceType,
  type WorkModality,
} from '../../api/experienceService';
import { getProfile, type Profile } from '../../api/profileService';
import { getProjects, type Project } from '../../api/projectsService';
import { getSkillColor, getSkills, type Skill, type SkillCategory, type SkillLevel } from '../../api/skillsService';
import { FEATURED_CARD_CLASS } from '../../styles/featured';

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

// Ancho de la barra de nivel (en %)
const LEVEL_PROGRESS: Record<SkillLevel, number> = {
  BEGINNER: 25,
  INTERMEDIATE: 50,
  ADVANCED: 75,
  EXPERT: 100,
};

const TYPE_LABELS: Record<EducationType, string> = {
  UNDERGRADUATE: 'Grado universitario',
  MASTER: 'Máster',
  DIPLOMADO: 'Diplomado',
  BOOTCAMP: 'Bootcamp',
  COURSE: 'Curso',
  CERTIFICATION: 'Certificación',
};

const EXPERIENCE_TYPE_LABELS: Record<ExperienceType, string> = {
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

// Las fechas se guardan como @db.Date (medianoche UTC), por eso se formatea en UTC
const monthFormatter = new Intl.DateTimeFormat('es-ES', { month: 'short', year: 'numeric', timeZone: 'UTC' });
const formatMonth = (value: string | null) => (value ? monthFormatter.format(new Date(value)) : null);

interface Period {
  startDate: string | null;
  endDate: string | null;
  isCurrent: boolean;
}

function formatPeriod({ startDate, endDate, isCurrent }: Period): string | null {
  const start = formatMonth(startDate);
  const end = isCurrent ? 'Actualidad' : formatMonth(endDate);
  if (!start && !end) return null;
  if (!start) return end;
  return end ? `${start} — ${end}` : start;
}

<<<<<<< HEAD
=======
// Hover de las tarjetas no destacadas; las destacadas conservan su resplandor (ver FEATURED_CARD_CLASS)
const DEFAULT_CARD_CLASS = `border-slate-800 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5`;

function FeaturedBadge({ label = 'Destacado', className = '' }: { label?: string; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-0.5 text-xs font-semibold text-slate-950 shadow-sm shadow-emerald-500/30 ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3" aria-hidden="true">
        <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z" />
      </svg>
      {label}
    </span>
  );
}

// Punto de la línea de tiempo: verde brillante si está destacado
function TimelineDot({ isFeatured }: { isFeatured: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute top-7 left-[-2.97rem] hidden h-3.5 w-3.5 rounded-full border-2 border-slate-950 sm:block ${
        isFeatured ? 'bg-emerald-400 ring-4 ring-emerald-400/20' : 'bg-slate-600'
      }`}
    />
  );
}

>>>>>>> dev
export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notificacion, setNotificacion] = useState<string | null>(null);
  const notificacionTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    let cancelled = false;

    Promise.all([getProfile(), getProjects(), getSkills(), getEducations(), getExperiences()])
      .then(([profileData, projectsData, skillsData, educationsData, experiencesData]) => {
        if (cancelled) return;
        setProfile(profileData);
<<<<<<< HEAD
        // El backend ya devuelve cada lista ordenada (relevancia + cronológico inverso).
        // Solo se muestran los proyectos publicados.
=======
        // Todo llega en el orden manual definido en el admin (order asc): aquí no se reordena nada.
        // Solo se muestran los proyectos publicados
>>>>>>> dev
        setProjects(projectsData.filter((project) => project.isPublished));
        setSkills(skillsData);
        setEducations(educationsData);
        setExperiences(experiencesData);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(getApiErrorMessage(err, 'No se pudo cargar el contenido.'));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // No usa preventDefault: el href (mailto / wa.me) se sigue abriendo además de copiar el dato
  const handleClickYCopiar = (texto: string, tipo: string) => {
    navigator.clipboard?.writeText(texto).catch(() => {});
    setNotificacion(tipo);
    clearTimeout(notificacionTimeout.current);
    notificacionTimeout.current = setTimeout(() => setNotificacion(null), 3000);
  };

  useEffect(() => () => clearTimeout(notificacionTimeout.current), []);

  return (
    <>
      {/* Hero */}
      <section id="inicio" className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute -top-40 left-1/2 h-128 w-lg -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute top-20 right-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto flex min-h-[calc(100svh-4rem)] max-w-6xl flex-col justify-center px-4 py-16 sm:px-6 sm:py-24">
          {isLoading ? (
            <HeroSkeleton />
          ) : (
            <div className="grid grid-cols-1 items-center gap-10 sm:gap-12 lg:grid-cols-[1fr_auto] lg:gap-16">
              <div className="order-2 min-w-0 lg:order-1">
                <div className="mb-6 flex flex-wrap items-center gap-3">
                  {profile?.availableForWork && (
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-300">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                      Disponible para nuevos proyectos
                    </span>
                  )}
                  {profile?.location && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/80 bg-slate-900/60 px-4 py-1.5 text-xs font-medium text-slate-300">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-6.2-7-11.5a7 7 0 1 1 14 0C19 14.8 12 21 12 21Z" />
                        <circle cx="12" cy="9.5" r="2.5" />
                      </svg>
                      {profile.location}
                    </span>
                  )}
                </div>

                <h1 className="max-w-4xl text-3xl font-extrabold leading-tight tracking-tight wrap-break-word sm:text-5xl lg:text-6xl">
                  Hola, soy{' '}
                  <span className="bg-linear-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                    {profile?.fullName ?? 'Juan Camilo López Marín'}
                  </span>
                </h1>

                {profile?.headline && (
                  <p className="mt-4 text-lg font-semibold text-slate-200 sm:text-xl md:text-2xl">{profile.headline}</p>
                )}

                {(profile?.bio || profile?.subheadline) && (
                  <p className="mt-6 max-w-2xl whitespace-pre-line text-base leading-relaxed sm:text-lg text-slate-400">
                    {profile.bio || profile.subheadline}
                  </p>
                )}

                <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">
                  <a
                    href="#proyectos"
                    className="rounded-lg bg-emerald-500 px-6 py-3 text-center text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-400"
                  >
                    Ver proyectos
                  </a>
                  <a
                    href="#habilidades"
                    className="rounded-lg border border-slate-700 px-6 py-3 text-center text-sm font-semibold text-slate-200 transition-all hover:-translate-y-0.5 hover:border-emerald-400 hover:text-emerald-400"
                  >
                    Mis habilidades
                  </a>
                  {profile?.resumeUrl && (
                    <a
                      href={profile.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-6 py-3 text-sm font-semibold text-cyan-300 transition-all hover:-translate-y-0.5 hover:border-cyan-400 hover:bg-cyan-500/20"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14" />
                      </svg>
                      Descargar CV
                    </a>
                  )}
                </div>
              </div>

              {profile?.avatarUrl && (
                <div className="order-1 flex justify-center lg:order-2">
                  <div className="relative">
                    <div className="absolute -inset-3 rounded-4xl bg-linear-to-br from-emerald-500/40 via-teal-400/20 to-cyan-500/40 blur-2xl" />
                    <img
                      src={profile.avatarUrl}
                      alt={profile.fullName}
                      className="relative h-40 w-40 rounded-4xl border border-slate-700/60 object-cover shadow-2xl shadow-emerald-500/10 ring-1 ring-emerald-400/20 sm:h-64 sm:w-64 lg:h-80 lg:w-80"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {error && (
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        </div>
      )}

      {/* Proyectos */}
      <section id="proyectos" className="scroll-mt-16 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading eyebrow="Portafolio" title="Proyectos destacados" />

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="h-80 animate-pulse rounded-2xl bg-slate-900" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <EmptyState text="Pronto habrá proyectos por aquí." />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Habilidades */}
      <section id="habilidades" className="scroll-mt-16 border-t border-slate-800/60 bg-slate-900/30 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading eyebrow="Stack" title="Habilidades" />

          {isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-900" />
              ))}
            </div>
          ) : skills.length === 0 ? (
            <EmptyState text="Pronto habrá habilidades por aquí." />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {skills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Experiencia */}
      <section id="experiencia" className="scroll-mt-16 border-t border-slate-800/60 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading eyebrow="Carrera" title="Experiencia Laboral" />

          {isLoading ? (
            <div className="space-y-6">
              {Array.from({ length: 2 }, (_, i) => (
                <div key={i} className="h-40 animate-pulse rounded-2xl bg-slate-900 sm:ml-10" />
              ))}
            </div>
          ) : experiences.length === 0 ? (
            <EmptyState text="Pronto habrá experiencia por aquí." />
          ) : (
            <ol className="relative space-y-6 sm:border-l sm:border-slate-800 sm:pl-10">
              {experiences.map((experience) => (
                <ExperienceItem key={experience.id} experience={experience} />
              ))}
            </ol>
          )}
        </div>
      </section>

      {/* Educación */}
      <section id="educacion" className="scroll-mt-16 border-t border-slate-800/60 bg-slate-900/30 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading eyebrow="Trayectoria" title="Formación Académica" />

          {isLoading ? (
            <div className="space-y-6">
              {Array.from({ length: 2 }, (_, i) => (
                <div key={i} className="h-36 animate-pulse rounded-2xl bg-slate-900 sm:ml-10" />
              ))}
            </div>
          ) : educations.length === 0 ? (
            <EmptyState text="Pronto habrá formación por aquí." />
          ) : (
            <ol className="relative space-y-6 sm:border-l sm:border-slate-800 sm:pl-10">
              {educations.map((education) => (
                <EducationItem key={education.id} education={education} />
              ))}
            </ol>
          )}
        </div>
      </section>

      {/* Contacto */}
      {(isLoading || profile?.email || profile?.phone) && (
        <section id="contacto" className="scroll-mt-16 border-t border-slate-800/60 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading eyebrow="Hablemos" title="Contacto" />

            {isLoading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {Array.from({ length: 2 }, (_, i) => (
                  <div key={i} className="h-20 animate-pulse rounded-2xl bg-slate-900" />
                ))}
              </div>
            ) : (
              <>
                <p className="mb-8 max-w-2xl text-slate-400">
                  ¿Tienes un proyecto en mente o quieres conversar? Escríbeme o llámame directamente.
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {profile?.email && (
                    <ContactLink
                      href={`mailto:${profile.email}`}
                      label="Email"
                      value={profile.email}
                      copied={notificacion === 'email'}
                      onClick={() => handleClickYCopiar(profile.email!, 'email')}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16v12H4z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4 7 8 6 8-6" />
                    </ContactLink>
                  )}
                  {profile?.phone && (
                    <ContactLink
                      href={toWhatsAppUrl(profile.phone)}
                      label="WhatsApp"
                      value={profile.phone}
                      external
                      copied={notificacion === 'telefono'}
                      onClick={() => handleClickYCopiar(profile.phone!, 'telefono')}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"
                      />
                    </ContactLink>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
      )}
    </>
  );
}

// wa.me requiere el número con código de país y solo dígitos; asume Colombia (57) si falta.
function toWhatsAppUrl(phone: string) {
  const digits = phone.replace(/\D/g, '');
  return `https://wa.me/${digits.length === 10 ? `57${digits}` : digits}`;
}

function ContactLink({
  href,
  label,
  value,
  external = false,
  copied = false,
  onClick,
  children,
}: {
  href: string;
  label: string;
  value: string;
  external?: boolean;
  copied?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
      className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 transition-all duration-200 sm:p-5 sm:hover:scale-105 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 transition-colors group-hover:bg-emerald-500 group-hover:text-slate-950">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5" aria-hidden="true">
          {children}
        </svg>
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>
        <p className="truncate font-medium text-slate-200 transition-colors group-hover:text-emerald-400">{value}</p>
        {copied && (
          <span className="mt-1 block text-xs text-emerald-400" role="status">
            ¡Copiado en el portapapeles! Puedes presionar Ctrl+V
          </span>
        )}
      </div>
    </a>
  );
}

function HeroSkeleton() {
  return (
    <div className="grid animate-pulse grid-cols-1 items-center gap-10 sm:gap-12 lg:grid-cols-[1fr_auto] lg:gap-16">
      <div className="order-2 space-y-6 lg:order-1">
        <div className="h-7 w-56 rounded-full bg-slate-800" />
        <div className="h-14 w-full max-w-2xl rounded-lg bg-slate-800" />
        <div className="h-8 w-80 max-w-full rounded-lg bg-slate-800" />
        <div className="space-y-3">
          <div className="h-4 w-full max-w-2xl rounded bg-slate-800/70" />
          <div className="h-4 w-5/6 max-w-xl rounded bg-slate-800/70" />
        </div>
        <div className="flex gap-4 pt-4">
          <div className="h-11 w-36 rounded-lg bg-slate-800" />
          <div className="h-11 w-36 rounded-lg bg-slate-800" />
        </div>
      </div>
      <div className="order-1 flex justify-center lg:order-2">
        <div className="h-40 w-40 rounded-4xl bg-slate-800 sm:h-64 sm:w-64 lg:h-80 lg:w-80" />
      </div>
    </div>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-8 sm:mb-12">
      <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl md:text-4xl">{title}</h2>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <p className="rounded-xl border border-dashed border-slate-800 py-12 text-center text-slate-500">{text}</p>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const detailPath = `/proyectos/${project.slug}`;

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-2xl border bg-slate-900/60 transition-all hover:-translate-y-1 ${
        project.isFeatured ? FEATURED_CARD_CLASS : DEFAULT_CARD_CLASS
      }`}
    >
      {/* Solo la portada y el título enlazan al detalle; los botones externos quedan fuera para evitar enlaces anidados */}
      <Link
        to={detailPath}
        tabIndex={-1}
        aria-hidden="true"
        className="relative block aspect-video overflow-hidden bg-linear-to-br from-slate-800 to-slate-900"
      >
        {project.coverImageUrl ? (
          <img
            src={project.coverImageUrl}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl font-black text-slate-700">
            {project.title.charAt(0).toUpperCase()}
          </div>
        )}
        {project.isFeatured && <FeaturedBadge className="absolute top-3 left-3" />}
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-lg font-semibold wrap-break-word text-slate-100">
          <Link
            to={detailPath}
            className="underline-offset-4 transition-colors hover:text-emerald-400 hover:underline focus-visible:text-emerald-400 focus-visible:underline focus-visible:outline-none"
          >
            {project.title}
          </Link>
        </h3>
        <div className="mt-2 flex-1">
          <p className="line-clamp-3 text-sm leading-relaxed text-slate-400">
            {project.summary || project.description}
          </p>
          <Link
            to={detailPath}
            aria-label={`Leer más sobre ${project.title}`}
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-emerald-400 transition-colors hover:text-emerald-300 hover:underline"
          >
            Leer más
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {(project.repoUrl || project.demoUrl) && (
          <div className="mt-6 flex gap-3">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-lg border border-slate-700 px-4 py-2 text-center text-sm font-medium text-slate-300 transition-colors hover:border-slate-500 hover:text-slate-100"
              >
                Repositorio
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-lg bg-emerald-500/10 px-4 py-2 text-center text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500 hover:text-slate-950"
              >
                Ver demo
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function SkillCard({ skill }: { skill: Skill }) {
  const accent = getSkillColor(skill);

  return (
    <div
      className={`group relative flex flex-col gap-3 rounded-xl border bg-slate-900/60 p-3 transition-all sm:p-4 hover:-translate-y-0.5 ${
        skill.isFeatured ? FEATURED_CARD_CLASS : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      {skill.isFeatured && <FeaturedBadge className="absolute -top-2.5 right-3" />}
      <div className="flex items-center gap-3">
        {skill.iconUrl ? (
          <img src={skill.iconUrl} alt="" loading="lazy" className="h-8 w-8 shrink-0 object-contain" />
        ) : (
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-slate-950"
            style={{ backgroundColor: accent }}
          >
            {skill.name.charAt(0).toUpperCase()}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate font-medium text-slate-100">{skill.name}</p>
          <p className="text-xs text-slate-500">{CATEGORY_LABELS[skill.category]}</p>
        </div>
      </div>

      {skill.level && (
        <div>
          <div className="h-1 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full"
              style={{ width: `${LEVEL_PROGRESS[skill.level]}%`, backgroundColor: accent }}
            />
          </div>
          <p className="mt-1.5 text-xs text-slate-500">{LEVEL_LABELS[skill.level]}</p>
        </div>
      )}
    </div>
  );
}

function EducationItem({ education }: { education: Education }) {
  const period = formatPeriod(education);
  // El título universitario se resalta frente a cursos, diplomados, etc.
  const isPrimary = education.type === 'UNDERGRADUATE';

  return (
    <li className="relative">
<<<<<<< HEAD
      {/* Punto de la línea de tiempo */}
      <span
        aria-hidden="true"
        className={`absolute top-7 left-[-2.97rem] hidden h-3.5 w-3.5 rounded-full border-2 border-slate-950 sm:block ${
          education.isCurrent || isPrimary ? 'bg-emerald-400 ring-4 ring-emerald-400/20' : 'bg-slate-600'
        }`}
      />

      <article
        className={`group rounded-2xl border p-6 transition-all hover:-translate-y-0.5 hover:shadow-xl ${
          isPrimary
            ? 'border-emerald-500/50 border-l-4 border-l-emerald-400 bg-linear-to-br from-emerald-500/10 via-slate-900/60 to-slate-900/60 shadow-lg shadow-emerald-500/10 hover:border-emerald-400/70 hover:shadow-emerald-500/15'
            : 'border-slate-800 bg-slate-900/60 hover:border-emerald-500/40 hover:shadow-emerald-500/5'
=======
      <TimelineDot isFeatured={education.isFeatured} />

      <article
        className={`group rounded-2xl border bg-slate-900/60 p-4 transition-all sm:p-6 hover:-translate-y-0.5 ${
          education.isFeatured ? FEATURED_CARD_CLASS : DEFAULT_CARD_CLASS
>>>>>>> dev
        }`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            {education.logoUrl && (
              <img
                src={education.logoUrl}
                alt={education.institution}
                loading="lazy"
                className="h-12 w-12 shrink-0 rounded-lg border border-slate-800 bg-slate-950/60 object-contain p-1.5"
              />
            )}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold wrap-break-word text-slate-100">{education.title}</h3>
                {education.isFeatured && <FeaturedBadge label="Principal" />}
              </div>
              <p className="mt-0.5 text-sm font-medium text-emerald-400">{education.institution}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {isPrimary && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-0.5 text-xs font-semibold text-slate-950">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3" aria-hidden="true">
                      <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" />
                    </svg>
                    Principal
                  </span>
                )}
                <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-300">
                  {TYPE_LABELS[education.type]}
                </span>
                {education.fieldOfStudy && (
                  <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-300">
                    {education.fieldOfStudy}
                  </span>
                )}
              </div>
            </div>
          </div>

          {period && (
            <span
              className={`shrink-0 self-start rounded-full border px-3 py-1 text-xs font-medium capitalize ${
                education.isCurrent
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                  : 'border-slate-700/80 bg-slate-900/60 text-slate-400'
              }`}
            >
              {period}
            </span>
          )}
        </div>

        {education.description && (
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-400">{education.description}</p>
        )}

        {education.credentialUrl && (
          <a
            href={education.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-emerald-400 hover:text-emerald-400"
          >
            Ver Credencial
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5h5v5m0-5-9 9M19 14v5H5V5h5" />
            </svg>
          </a>
        )}
      </article>
    </li>
  );
}

function ExperienceItem({ experience }: { experience: Experience }) {
  const period = formatPeriod(experience);

  return (
    <li className="relative">
      <TimelineDot isFeatured={experience.isFeatured} />

      <article
        className={`group rounded-2xl border bg-slate-900/60 p-4 transition-all sm:p-6 hover:-translate-y-0.5 ${
          experience.isFeatured ? FEATURED_CARD_CLASS : DEFAULT_CARD_CLASS
        }`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            {experience.logoUrl && (
              <img
                src={experience.logoUrl}
                alt={experience.organization}
                loading="lazy"
                className="h-12 w-12 shrink-0 rounded-lg border border-slate-800 bg-slate-950/60 object-contain p-1.5"
              />
            )}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold wrap-break-word text-slate-100">{experience.role}</h3>
                {experience.isFeatured && <FeaturedBadge />}
              </div>
              {experience.companyUrl ? (
                <a
                  href={experience.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-0.5 inline-block text-sm font-medium text-emerald-400 hover:text-emerald-300 hover:underline"
                >
                  {experience.organization}
                </a>
              ) : (
                <p className="mt-0.5 text-sm font-medium text-emerald-400">{experience.organization}</p>
              )}
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-300">
                  {EXPERIENCE_TYPE_LABELS[experience.type]}
                </span>
                {experience.modality && (
                  <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-300">
                    {MODALITY_LABELS[experience.modality]}
                  </span>
                )}
                {experience.location && (
                  <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-300">
                    {experience.location}
                  </span>
                )}
              </div>
            </div>
          </div>

          {period && (
            <span
              className={`shrink-0 self-start rounded-full border px-3 py-1 text-xs font-medium capitalize ${
                experience.isCurrent
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                  : 'border-slate-700/80 bg-slate-900/60 text-slate-400'
              }`}
            >
              {period}
            </span>
          )}
        </div>

        <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-400">{experience.description}</p>

        {experience.highlights && experience.highlights.length > 0 && (
          <ul className="mt-4 space-y-1.5">
            {experience.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-2 text-sm text-slate-300">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                {highlight}
              </li>
            ))}
          </ul>
        )}
      </article>
    </li>
  );
}
