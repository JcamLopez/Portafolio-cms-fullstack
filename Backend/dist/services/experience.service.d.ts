import { Prisma } from '@prisma/client';
import type { Experience } from '@prisma/client';
export type ExperienceInput = Omit<Prisma.ExperienceCreateInput, 'skills' | 'highlights' | 'createdAt' | 'updatedAt'> & {
    highlights?: string[] | null;
};
/**
 * Obtiene todas las experiencias, las más recientes primero (startDate desc)
 * y, a igual fecha de inicio, por `order` (asc).
 */
export declare const getAllExperiences: () => Promise<Experience[]>;
/**
 * Obtiene una experiencia por su id (o null si no existe).
 */
export declare const getExperienceById: (id: number) => Promise<Experience | null>;
/**
 * Crea una experiencia.
 */
export declare const createExperience: (data: ExperienceInput) => Promise<Experience>;
/**
 * Actualiza una experiencia (o devuelve null si no existe).
 */
export declare const updateExperience: (id: number, data: ExperienceInput) => Promise<Experience | null>;
/**
 * Elimina una experiencia. Devuelve la experiencia eliminada, o null si no existía.
 */
export declare const deleteExperience: (id: number) => Promise<Experience | null>;
//# sourceMappingURL=experience.service.d.ts.map