import { Prisma } from '@prisma/client';
import type { Skill } from '@prisma/client';
export type SkillInput = Omit<Prisma.SkillCreateInput, 'projects' | 'experiences' | 'createdAt' | 'updatedAt'>;
/**
 * Obtiene todas las habilidades agrupadas lógicamente: primero por `category` (asc),
 * dentro de cada categoría por `order` (asc) y, a igual orden, por nombre.
 */
export declare const getAllSkills: () => Promise<Skill[]>;
/**
 * Obtiene una habilidad por su id (o null si no existe).
 */
export declare const getSkillById: (id: number) => Promise<Skill | null>;
/**
 * Obtiene una habilidad por su slug (o null si no existe).
 */
export declare const getSkillBySlug: (slug: string) => Promise<Skill | null>;
/**
 * Crea una habilidad.
 */
export declare const createSkill: (data: SkillInput) => Promise<Skill>;
/**
 * Actualiza una habilidad (o devuelve null si no existe).
 */
export declare const updateSkill: (id: number, data: SkillInput) => Promise<Skill | null>;
/**
 * Elimina una habilidad. Devuelve la habilidad eliminada, o null si no existía.
 */
export declare const deleteSkill: (id: number) => Promise<Skill | null>;
//# sourceMappingURL=skill.service.d.ts.map