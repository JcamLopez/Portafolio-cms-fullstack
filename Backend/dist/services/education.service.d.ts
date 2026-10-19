import { Prisma } from '@prisma/client';
import type { Education } from '@prisma/client';
export type EducationInput = Omit<Prisma.EducationCreateInput, 'createdAt' | 'updatedAt'>;
/**
 * Obtiene toda la formación, la más reciente primero (startDate desc)
 * y, a igual fecha de inicio, por `order` (asc).
 */
export declare const getAllEducations: () => Promise<Education[]>;
/**
 * Obtiene una formación por su id (o null si no existe).
 */
export declare const getEducationById: (id: number) => Promise<Education | null>;
/**
 * Crea una formación.
 */
export declare const createEducation: (data: EducationInput) => Promise<Education>;
/**
 * Actualiza una formación (o devuelve null si no existe).
 */
export declare const updateEducation: (id: number, data: EducationInput) => Promise<Education | null>;
/**
 * Elimina una formación. Devuelve la formación eliminada, o null si no existía.
 */
export declare const deleteEducation: (id: number) => Promise<Education | null>;
//# sourceMappingURL=education.service.d.ts.map