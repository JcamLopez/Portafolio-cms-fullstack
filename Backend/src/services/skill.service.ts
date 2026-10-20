import { Prisma, PrismaClient } from '@prisma/client';
import type { Skill } from '@prisma/client';

const prisma = new PrismaClient();

// Campos que el cliente puede modificar (id, timestamps y relaciones los gestiona el servidor)
export type SkillInput = Omit<Prisma.SkillCreateInput, 'projects' | 'experiences' | 'createdAt' | 'updatedAt'>;

// Error de Prisma cuando el registro a actualizar/eliminar no existe
const isNotFoundError = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025';

// Siguiente posición libre: los registros nuevos se añaden al final del orden manual
const nextOrder = async (): Promise<number> => {
  const { _max } = await prisma.skill.aggregate({ _max: { order: true } });
  return (_max.order ?? -1) + 1;
};

/**
 * Obtiene las habilidades en el orden manual definido desde el admin (`order` asc).
 * A igual `order`, por id para que el resultado sea estable.
 */
export const getAllSkills = async (): Promise<Skill[]> => {
  return prisma.skill.findMany({
    orderBy: [{ order: 'asc' }, { id: 'asc' }],
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
 * Crea una habilidad; si no trae `order`, se añade al final.
 */
export const createSkill = async (data: SkillInput): Promise<Skill> => {
  return prisma.skill.create({ data: { ...data, order: data.order ?? (await nextOrder()) } });
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

/**
 * Guarda el orden manual (drag & drop): el índice de cada id en `ids` pasa a ser su `order`.
 * Todo va en una transacción: si algún id no existe no se aplica ningún cambio y devuelve false.
 */
export const reorderSkills = async (ids: number[]): Promise<boolean> => {
  try {
    await prisma.$transaction(
      ids.map((id, index) => prisma.skill.update({ where: { id }, data: { order: index } })),
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
export const setSkillFeatured = async (id: number, isFeatured: boolean): Promise<Skill | null> => {
  try {
    return await prisma.skill.update({ where: { id }, data: { isFeatured } });
  } catch (error) {
    if (isNotFoundError(error)) return null;
    throw error;
  }
};
