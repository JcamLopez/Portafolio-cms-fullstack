import { Prisma } from '@prisma/client';
import * as projectService from '../services/project.service.js';
import { sendError, sendSuccess } from '../utils/response.handler.js';
// Convierte el :id de la URL a entero positivo (o null si no es válido)
const parseId = (rawId) => {
    const id = Number(rawId);
    return Number.isInteger(id) && id > 0 ? id : null;
};
// Error de Prisma por violación de restricción única (aquí, el slug)
const isUniqueConstraintError = (error) => error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
export const getAllProjects = async (_req, res) => {
    try {
        const projects = await projectService.getAllProjects();
        return sendSuccess(res, projects);
    }
    catch (error) {
        console.error('Error al obtener los proyectos:', error);
        return sendError(res, 'Error interno al obtener los proyectos');
    }
};
export const getProjectById = async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null)
        return sendError(res, 'El id del proyecto no es válido', 400);
    try {
        const project = await projectService.getProjectById(id);
        if (!project) {
            return sendError(res, 'Proyecto no encontrado', 404);
        }
        return sendSuccess(res, project);
    }
    catch (error) {
        console.error('Error al obtener el proyecto:', error);
        return sendError(res, 'Error interno al obtener el proyecto');
    }
};
export const getProjectBySlug = async (req, res) => {
    try {
        const project = await projectService.getProjectBySlug(req.params.slug);
        if (!project) {
            return sendError(res, 'Proyecto no encontrado', 404);
        }
        return sendSuccess(res, project);
    }
    catch (error) {
        console.error('Error al obtener el proyecto:', error);
        return sendError(res, 'Error interno al obtener el proyecto');
    }
};
export const createProject = async (req, res) => {
    try {
        // req.body ya fue validado y limpiado por validateSchema(projectSchema)
        const project = await projectService.createProject(req.body);
        return sendSuccess(res, project, 201, 'Proyecto creado correctamente');
    }
    catch (error) {
        if (isUniqueConstraintError(error)) {
            return sendError(res, 'Ya existe un proyecto con ese slug', 409);
        }
        console.error('Error al crear el proyecto:', error);
        return sendError(res, 'Error interno al crear el proyecto');
    }
};
export const updateProject = async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null)
        return sendError(res, 'El id del proyecto no es válido', 400);
    try {
        // req.body ya fue validado y limpiado por validateSchema(projectSchema)
        const project = await projectService.updateProject(id, req.body);
        if (!project) {
            return sendError(res, 'Proyecto no encontrado', 404);
        }
        return sendSuccess(res, project, 200, 'Proyecto actualizado correctamente');
    }
    catch (error) {
        if (isUniqueConstraintError(error)) {
            return sendError(res, 'Ya existe un proyecto con ese slug', 409);
        }
        console.error('Error al actualizar el proyecto:', error);
        return sendError(res, 'Error interno al actualizar el proyecto');
    }
};
export const deleteProject = async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null)
        return sendError(res, 'El id del proyecto no es válido', 400);
    try {
        const project = await projectService.deleteProject(id);
        if (!project) {
            return sendError(res, 'Proyecto no encontrado', 404);
        }
        return sendSuccess(res, project, 200, 'Proyecto eliminado correctamente');
    }
    catch (error) {
        console.error('Error al eliminar el proyecto:', error);
        return sendError(res, 'Error interno al eliminar el proyecto');
    }
};
//# sourceMappingURL=project.controller.js.map