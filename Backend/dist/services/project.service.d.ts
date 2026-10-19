import { Prisma } from '@prisma/client';
import type { Project, Skill } from '@prisma/client';
export type ProjectInput = Omit<Prisma.ProjectCreateInput, 'images' | 'skills' | 'publishedAt' | 'createdAt' | 'updatedAt'>;
/**
 * Obtiene todos los proyectos ordenados por `order` (asc) y, a igual orden,
 * por fecha de creación (más recientes primero).
 */
export declare const getAllProjects: () => Promise<Project[]>;
/**
 * Obtiene un proyecto por su id (o null si no existe).
 */
export declare const getProjectById: (id: number) => Promise<Project | null>;
export type ProjectWithSkills = Project & {
    skills: Skill[];
};
/**
 * Obtiene un proyecto por su slug junto con sus tecnologías (o null si no existe).
 * La relación pasa por la tabla intermedia ProjectSkill; se aplana para devolver Skill[].
 */
export declare const getProjectBySlug: (slug: string) => Promise<ProjectWithSkills | null>;
/**
 * Crea un proyecto. Si nace publicado, se fija publishedAt a la fecha actual.
 */
export declare const createProject: (data: ProjectInput) => Promise<Project>;
/**
 * Actualiza un proyecto (o devuelve null si no existe).
 * publishedAt se fija la primera vez que el proyecto pasa a publicado
 * y se limpia si vuelve a borrador.
 */
export declare const updateProject: (id: number, data: ProjectInput) => Promise<Project | null>;
/**
 * Elimina un proyecto. Devuelve el proyecto eliminado, o null si no existía.
 */
export declare const deleteProject: (id: number) => Promise<Project | null>;
//# sourceMappingURL=project.service.d.ts.map