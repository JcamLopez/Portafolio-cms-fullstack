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

// Siguiente posición libre: los registros nuevos se añaden al final del orden manual
const nextOrder = async (): Promise<number> => {
  const { _max } = await prisma.experience.aggregate({ _max: { order: true } });
  return (_max.order ?? -1) + 1;
};

// Prisma no acepta `null` literal en columnas Json: hay que usar Prisma.DbNull
const toPrismaData = ({ highlights, ...rest }: ExperienceInput) => ({
  ...rest,
  ...(highlights !== undefined && { highlights: highlights ?? Prisma.DbNull }),
});

/**
 * Obtiene las experiencias en el orden manual definido desde el admin (`order` asc).
 * A igual `order`, por id para que el resultado sea estable.
 */
export const getAllExperiences = async (): Promise<Experience[]> => {
  return prisma.experience.findMany({
    orderBy: [{ order: 'asc' }, { id: 'asc' }],
  });
};

/**
 * Obtiene una experiencia por su id (o null si no existe).
 */
export const getExperienceById = async (id: number): Promise<Experience | null> => {
  return prisma.experience.findUnique({ where: { id } });
};

/**
 * Crea una experiencia; si no trae `order`, se añade al final.
 */
export const createExperience = async (data: ExperienceInput): Promise<Experience> => {
  return prisma.experience.create({
    data: { ...toPrismaData(data), order: data.order ?? (await nextOrder()) },
  });
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

/**
 * Guarda el orden manual (drag & drop): el índice de cada id en `ids` pasa a ser su `order`.
 * Todo va en una transacción: si algún id no existe no se aplica ningún cambio y devuelve false.
 */
export const reorderExperiences = async (ids: number[]): Promise<boolean> => {
  try {
    await prisma.$transaction(
      ids.map((id, index) => prisma.experience.update({ where: { id }, data: { order: index } })),
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
export const setExperienceFeatured = async (id: number, isFeatured: boolean): Promise<Experience | null> => {
  try {
    return await prisma.experience.update({ where: { id }, data: { isFeatured } });
  } catch (error) {
    if (isNotFoundError(error)) return null;
    throw error;
  }
};
