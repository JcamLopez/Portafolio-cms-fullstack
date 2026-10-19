import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
// Error de Prisma cuando el registro a actualizar/eliminar no existe
const isNotFoundError = (error) => error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025';
/**
 * Obtiene todas las habilidades agrupadas lógicamente: primero por `category` (asc),
 * dentro de cada categoría por `order` (asc) y, a igual orden, por nombre.
 */
export const getAllSkills = async () => {
    return prisma.skill.findMany({
        orderBy: [{ category: 'asc' }, { order: 'asc' }, { name: 'asc' }],
    });
};
/**
 * Obtiene una habilidad por su id (o null si no existe).
 */
export const getSkillById = async (id) => {
    return prisma.skill.findUnique({ where: { id } });
};
/**
 * Obtiene una habilidad por su slug (o null si no existe).
 */
export const getSkillBySlug = async (slug) => {
    return prisma.skill.findUnique({ where: { slug } });
};
/**
 * Crea una habilidad.
 */
export const createSkill = async (data) => {
    return prisma.skill.create({ data });
};
/**
 * Actualiza una habilidad (o devuelve null si no existe).
 */
export const updateSkill = async (id, data) => {
    try {
        return await prisma.skill.update({ where: { id }, data });
    }
    catch (error) {
        if (isNotFoundError(error))
            return null;
        throw error;
    }
};
/**
 * Elimina una habilidad. Devuelve la habilidad eliminada, o null si no existía.
 */
export const deleteSkill = async (id) => {
    try {
        return await prisma.skill.delete({ where: { id } });
    }
    catch (error) {
        if (isNotFoundError(error))
            return null;
        throw error;
    }
};
//# sourceMappingURL=skill.service.js.map