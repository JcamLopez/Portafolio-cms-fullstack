import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
// Error de Prisma cuando el registro a actualizar/eliminar no existe
const isNotFoundError = (error) => error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025';
/**
 * Obtiene toda la formación, la más reciente primero (startDate desc)
 * y, a igual fecha de inicio, por `order` (asc).
 */
export const getAllEducations = async () => {
    return prisma.education.findMany({
        orderBy: [{ startDate: 'desc' }, { order: 'asc' }],
    });
};
/**
 * Obtiene una formación por su id (o null si no existe).
 */
export const getEducationById = async (id) => {
    return prisma.education.findUnique({ where: { id } });
};
/**
 * Crea una formación.
 */
export const createEducation = async (data) => {
    return prisma.education.create({ data });
};
/**
 * Actualiza una formación (o devuelve null si no existe).
 */
export const updateEducation = async (id, data) => {
    try {
        return await prisma.education.update({ where: { id }, data });
    }
    catch (error) {
        if (isNotFoundError(error))
            return null;
        throw error;
    }
};
/**
 * Elimina una formación. Devuelve la formación eliminada, o null si no existía.
 */
export const deleteEducation = async (id) => {
    try {
        return await prisma.education.delete({ where: { id } });
    }
    catch (error) {
        if (isNotFoundError(error))
            return null;
        throw error;
    }
};
//# sourceMappingURL=education.service.js.map