import { Prisma, PrismaClient } from '@prisma/client';
import type { Skill } from '@prisma/client';

const prisma = new PrismaClient();

// Campos que el cliente puede modificar (id, timestamps y relaciones los gestiona el servidor)
export type SkillInput = Omit<Prisma.SkillCreateInput, 'projects' | 'experiences' | 'createdAt' | 'updatedAt'>;

// Error de Prisma cuando el registro a actualizar/eliminar no existe
const isNotFoundError = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025';

/**
 * Obtiene todas las habilidades: las destacadas primero (isFeatured desc), luego
 * por `order` (asc) y, a igual orden, por nombre.
 */
export const getAllSkills = async (): Promise<Skill[]> => {
  return prisma.skill.findMany({
    orderBy: [{ isFeatured: 'desc' }, { order: 'asc' }, { name: 'asc' }],
  });
};

/**
 * Obtiene una habilidad por su id (o null si no existe).
 */
export const getSkillById = async (id: number): Promise<Skill | null> => {
  return prisma.skill.findUnique({ where: { id } });
};

/**
 * Obtiene una habilidad por su slug (o null si no existe).
 */
export const getSkillBySlug = async (slug: string): Promise<Skill | null> => {
  return prisma.skill.findUnique({ where: { slug } });
};

/**
 * Crea una habilidad.
 */
export const createSkill = async (data: SkillInput): Promise<Skill> => {
  return prisma.skill.create({ data });
};

/**
 * Actualiza una habilidad (o devuelve null si no existe).
 */
export const updateSkill = async (id: number, data: SkillInput): Promise<Skill | null> => {
  try {
    return await prisma.skill.update({ where: { id }, data });
  } catch (error) {
    if (isNotFoundError(error)) return null;
    throw error;
  }
};

/**
 * Elimina una habilidad. Devuelve la habilidad eliminada, o null si no existía.
 */
export const deleteSkill = async (id: number): Promise<Skill | null> => {
  try {
    return await prisma.skill.delete({ where: { id } });
  } catch (error) {
    if (isNotFoundError(error)) return null;
    throw error;
  }
};
