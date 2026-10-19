import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
// Error de Prisma cuando el registro a actualizar/eliminar no existe
const isNotFoundError = (error) => error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025';
// Prisma no acepta `null` literal en columnas Json: hay que usar Prisma.DbNull
const toPrismaData = ({ highlights, ...rest }) => ({
    ...rest,
    ...(highlights !== undefined && { highlights: highlights ?? Prisma.DbNull }),
});
/**
 * Obtiene todas las experiencias, las más recientes primero (startDate desc)
 * y, a igual fecha de inicio, por `order` (asc).
 */
export const getAllExperiences = async () => {
    return prisma.experience.findMany({
        orderBy: [{ startDate: 'desc' }, { order: 'asc' }],
    });
};
/**
 * Obtiene una experiencia por su id (o null si no existe).
 */
export const getExperienceById = async (id) => {
    return prisma.experience.findUnique({ where: { id } });
};
/**
 * Crea una experiencia.
 */
export const createExperience = async (data) => {
    return prisma.experience.create({ data: toPrismaData(data) });
};
/**
 * Actualiza una experiencia (o devuelve null si no existe).
 */
export const updateExperience = async (id, data) => {
    try {
        return await prisma.experience.update({ where: { id }, data: toPrismaData(data) });
    }
    catch (error) {
        if (isNotFoundError(error))
            return null;
        throw error;
    }
};
/**
 * Elimina una experiencia. Devuelve la experiencia eliminada, o null si no existía.
 */
export const deleteExperience = async (id) => {
    try {
        return await prisma.experience.delete({ where: { id } });
    }
    catch (error) {
        if (isNotFoundError(error))
            return null;
        throw error;
    }
};
//# sourceMappingURL=experience.service.js.map