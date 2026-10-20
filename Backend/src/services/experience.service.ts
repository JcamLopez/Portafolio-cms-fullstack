import { Prisma, PrismaClient } from '@prisma/client';
import type { Experience } from '@prisma/client';

const prisma = new PrismaClient();

// Campos que el cliente puede modificar (id, timestamps y relaciones los gestiona el servidor)
export type ExperienceInput = Omit<
  Prisma.ExperienceCreateInput,
  'skills' | 'highlights' | 'createdAt' | 'updatedAt'
> & { highlights?: string[] | null };

// Error de Prisma cuando el registro a actualizar/eliminar no existe
const isNotFoundError = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025';

// Prisma no acepta `null` literal en columnas Json: hay que usar Prisma.DbNull
const toPrismaData = ({ highlights, ...rest }: ExperienceInput) => ({
  ...rest,
  ...(highlights !== undefined && { highlights: highlights ?? Prisma.DbNull }),
});

/**
 * Obtiene todas las experiencias: por prioridad manual (`order` asc), luego el
 * trabajo actual primero (isCurrent desc) y por último las más recientes (startDate desc).
 */
export const getAllExperiences = async (): Promise<Experience[]> => {
  return prisma.experience.findMany({
    orderBy: [{ order: 'asc' }, { isCurrent: 'desc' }, { startDate: 'desc' }],
  });
};

/**
 * Obtiene una experiencia por su id (o null si no existe).
 */
export const getExperienceById = async (id: number): Promise<Experience | null> => {
  return prisma.experience.findUnique({ where: { id } });
};

/**
 * Crea una experiencia.
 */
export const createExperience = async (data: ExperienceInput): Promise<Experience> => {
  return prisma.experience.create({ data: toPrismaData(data) });
};

/**
 * Actualiza una experiencia (o devuelve null si no existe).
 */
export const updateExperience = async (id: number, data: ExperienceInput): Promise<Experience | null> => {
  try {
    return await prisma.experience.update({ where: { id }, data: toPrismaData(data) });
  } catch (error) {
    if (isNotFoundError(error)) return null;
    throw error;
  }
};

/**
 * Elimina una experiencia. Devuelve la experiencia eliminada, o null si no existía.
 */
export const deleteExperience = async (id: number): Promise<Experience | null> => {
  try {
    return await prisma.experience.delete({ where: { id } });
  } catch (error) {
    if (isNotFoundError(error)) return null;
    throw error;
  }
};
