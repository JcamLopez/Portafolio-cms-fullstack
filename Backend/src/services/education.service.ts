import { Prisma, PrismaClient } from '@prisma/client';
import type { Education } from '@prisma/client';

const prisma = new PrismaClient();

// Campos que el cliente puede modificar (id y timestamps los gestiona el servidor)
export type EducationInput = Omit<Prisma.EducationCreateInput, 'createdAt' | 'updatedAt'>;

// Error de Prisma cuando el registro a actualizar/eliminar no existe
const isNotFoundError = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025';

// Siguiente posición libre: los registros nuevos se añaden al final del orden manual
const nextOrder = async (): Promise<number> => {
  const { _max } = await prisma.education.aggregate({ _max: { order: true } });
  return (_max.order ?? -1) + 1;
};

/**
 * Obtiene toda la formación en el orden manual definido desde el admin (`order` asc).
 * A igual `order`, por id para que el resultado sea estable.
 */
export const getAllEducations = async (): Promise<Education[]> => {
  return prisma.education.findMany({
    orderBy: [{ order: 'asc' }, { id: 'asc' }],
  });
};

/**
 * Obtiene una formación por su id (o null si no existe).
 */
export const getEducationById = async (id: number): Promise<Education | null> => {
  return prisma.education.findUnique({ where: { id } });
};

/**
 * Crea una formación; si no trae `order`, se añade al final.
 */
export const createEducation = async (data: EducationInput): Promise<Education> => {
  return prisma.education.create({ data: { ...data, order: data.order ?? (await nextOrder()) } });
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

/**
 * Guarda el orden manual (drag & drop): el índice de cada id en `ids` pasa a ser su `order`.
 * Todo va en una transacción: si algún id no existe no se aplica ningún cambio y devuelve false.
 */
export const reorderEducations = async (ids: number[]): Promise<boolean> => {
  try {
    await prisma.$transaction(
      ids.map((id, index) => prisma.education.update({ where: { id }, data: { order: index } })),
    );
    return true;
  } catch (error) {
    if (isNotFoundError(error)) return false;
    throw error;
  }
};

/**
 * Activa o desactiva el estado destacado (o devuelve null si no existe).
 */
export const setEducationFeatured = async (id: number, isFeatured: boolean): Promise<Education | null> => {
  try {
    return await prisma.education.update({ where: { id }, data: { isFeatured } });
  } catch (error) {
    if (isNotFoundError(error)) return null;
    throw error;
  }
};
