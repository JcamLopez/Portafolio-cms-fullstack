import { Prisma, PrismaClient } from '@prisma/client';
import type { Education } from '@prisma/client';

const prisma = new PrismaClient();

// Campos que el cliente puede modificar (id y timestamps los gestiona el servidor)
export type EducationInput = Omit<Prisma.EducationCreateInput, 'createdAt' | 'updatedAt'>;

// Error de Prisma cuando el registro a actualizar/eliminar no existe
const isNotFoundError = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025';

/**
 * Obtiene toda la formación: primero por prioridad manual (`order` asc, para destacar
 * el título principal) y luego la más reciente primero (endDate desc). Las que no
 * tienen fecha de fin (en curso) se tratan como las más recientes.
 */
export const getAllEducations = async (): Promise<Education[]> => {
  return prisma.education.findMany({
    orderBy: [{ order: 'asc' }, { endDate: { sort: 'desc', nulls: 'first' } }],
  });
};

/**
 * Obtiene una formación por su id (o null si no existe).
 */
export const getEducationById = async (id: number): Promise<Education | null> => {
  return prisma.education.findUnique({ where: { id } });
};

/**
 * Crea una formación.
 */
export const createEducation = async (data: EducationInput): Promise<Education> => {
  return prisma.education.create({ data });
};

/**
 * Actualiza una formación (o devuelve null si no existe).
 */
export const updateEducation = async (id: number, data: EducationInput): Promise<Education | null> => {
  try {
    return await prisma.education.update({ where: { id }, data });
  } catch (error) {
    if (isNotFoundError(error)) return null;
    throw error;
  }
};

/**
 * Elimina una formación. Devuelve la formación eliminada, o null si no existía.
 */
export const deleteEducation = async (id: number): Promise<Education | null> => {
  try {
    return await prisma.education.delete({ where: { id } });
  } catch (error) {
    if (isNotFoundError(error)) return null;
    throw error;
  }
};
