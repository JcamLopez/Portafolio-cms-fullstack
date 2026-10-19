import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
// Error de Prisma cuando el registro a actualizar/eliminar no existe
const isNotFoundError = (error) => error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025';
/**
 * Obtiene todos los proyectos ordenados por `order` (asc) y, a igual orden,
 * por fecha de creación (más recientes primero).
 */
export const getAllProjects = async () => {
    return prisma.project.findMany({
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
};
/**
 * Obtiene un proyecto por su id (o null si no existe).
 */
export const getProjectById = async (id) => {
    return prisma.project.findUnique({ where: { id } });
};
/**
 * Obtiene un proyecto por su slug junto con sus tecnologías (o null si no existe).
 * La relación pasa por la tabla intermedia ProjectSkill; se aplana para devolver Skill[].
 */
export const getProjectBySlug = async (slug) => {
    const project = await prisma.project.findUnique({
        where: { slug },
        include: {
            skills: {
                include: { skill: true },
                orderBy: [{ skill: { order: 'asc' } }, { skill: { name: 'asc' } }],
            },
        },
    });
    if (!project)
        return null;
    return { ...project, skills: project.skills.map(({ skill }) => skill) };
};
/**
 * Crea un proyecto. Si nace publicado, se fija publishedAt a la fecha actual.
 */
export const createProject = async (data) => {
    return prisma.project.create({
        data: {
            ...data,
            publishedAt: data.isPublished ? new Date() : null,
        },
    });
};
/**
 * Actualiza un proyecto (o devuelve null si no existe).
 * publishedAt se fija la primera vez que el proyecto pasa a publicado
 * y se limpia si vuelve a borrador.
 */
export const updateProject = async (id, data) => {
    const existing = await prisma.project.findUnique({
        where: { id },
        select: { publishedAt: true },
    });
    if (!existing)
        return null;
    let publishedAt = existing.publishedAt;
    if (data.isPublished === true && !publishedAt)
        publishedAt = new Date();
    if (data.isPublished === false)
        publishedAt = null;
    try {
        return await prisma.project.update({
            where: { id },
            data: { ...data, publishedAt },
        });
    }
    catch (error) {
        // el proyecto pudo eliminarse entre la lectura y la escritura
        if (isNotFoundError(error))
            return null;
        throw error;
    }
};
/**
 * Elimina un proyecto. Devuelve el proyecto eliminado, o null si no existía.
 */
export const deleteProject = async (id) => {
    try {
        return await prisma.project.delete({ where: { id } });
    }
    catch (error) {
        if (isNotFoundError(error))
            return null;
        throw error;
    }
};
//# sourceMappingURL=project.service.js.map