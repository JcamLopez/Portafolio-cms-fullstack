import { useEffect, useState } from 'react';
import { getEducations } from '../../api/educationService';
import { getExperiences } from '../../api/experienceService';
import { getProjects } from '../../api/projectsService';
import { getSkills } from '../../api/skillsService';

export default function Dashboard() {
  const [projectCount, setProjectCount] = useState(0);
  const [skillCount, setSkillCount] = useState(0);
  const [experienceCount, setExperienceCount] = useState(0);
  const [educationCount, setEducationCount] = useState(0);

  useEffect(() => {
    getProjects()
      .then((projects) => setProjectCount(projects.length))
      .catch((error) => console.error('Error al cargar proyectos:', error));

    getSkills()
      .then((skills) => setSkillCount(skills.length))
      .catch((error) => console.error('Error al cargar habilidades:', error));

    getExperiences()
      .then((experiences) => setExperienceCount(experiences.length))
      .catch((error) => console.error('Error al cargar experiencias:', error));

    getEducations()
      .then((educations) => setEducationCount(educations.length))
      .catch((error) => console.error('Error al cargar educación:', error));
  }, []);

  const stats = [
    { label: 'Total Proyectos', value: projectCount },
    { label: 'Total Habilidades', value: skillCount },
    { label: 'Total Experiencia', value: experienceCount },
    { label: 'Total Educación', value: educationCount },
  ];

  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold text-slate-100 md:text-3xl">Dashboard Principal</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value }) => (
          <article
            key={label}
            className="rounded-xl border border-slate-800 bg-slate-800/50 p-6 shadow-lg shadow-black/20"
          >
            <p className="text-sm font-medium text-slate-400">{label}</p>
            <p className="mt-2 text-4xl font-bold text-emerald-400">{value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
