import * as experienceService from '../services/experience.service.js';
import { sendError, sendSuccess } from '../utils/response.handler.js';
// Convierte el :id de la URL a entero positivo (o null si no es válido)
const parseId = (rawId) => {
    const id = Number(rawId);
    return Number.isInteger(id) && id > 0 ? id : null;
};
export const getAllExperiences = async (_req, res) => {
    try {
        const experiences = await experienceService.getAllExperiences();
        return sendSuccess(res, experiences);
    }
    catch (error) {
        console.error('Error al obtener las experiencias:', error);
        return sendError(res, 'Error interno al obtener las experiencias');
    }
};
export const getExperienceById = async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null)
        return sendError(res, 'El id de la experiencia no es válido', 400);
    try {
        const experience = await experienceService.getExperienceById(id);
        if (!experience) {
            return sendError(res, 'Experiencia no encontrada', 404);
        }
        return sendSuccess(res, experience);
    }
    catch (error) {
        console.error('Error al obtener la experiencia:', error);
        return sendError(res, 'Error interno al obtener la experiencia');
    }
};
export const createExperience = async (req, res) => {
    try {
        // req.body ya fue validado y limpiado por validateSchema(experienceSchema)
        const experience = await experienceService.createExperience(req.body);
        return sendSuccess(res, experience, 201, 'Experiencia creada correctamente');
    }
    catch (error) {
        console.error('Error al crear la experiencia:', error);
        return sendError(res, 'Error interno al crear la experiencia');
    }
};
export const updateExperience = async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null)
        return sendError(res, 'El id de la experiencia no es válido', 400);
    try {
        // req.body ya fue validado y limpiado por validateSchema(experienceSchema)
        const experience = await experienceService.updateExperience(id, req.body);
        if (!experience) {
            return sendError(res, 'Experiencia no encontrada', 404);
        }
        return sendSuccess(res, experience, 200, 'Experiencia actualizada correctamente');
    }
    catch (error) {
        console.error('Error al actualizar la experiencia:', error);
        return sendError(res, 'Error interno al actualizar la experiencia');
    }
};
export const deleteExperience = async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null)
        return sendError(res, 'El id de la experiencia no es válido', 400);
    try {
        const experience = await experienceService.deleteExperience(id);
        if (!experience) {
            return sendError(res, 'Experiencia no encontrada', 404);
        }
        return sendSuccess(res, experience, 200, 'Experiencia eliminada correctamente');
    }
    catch (error) {
        console.error('Error al eliminar la experiencia:', error);
        return sendError(res, 'Error interno al eliminar la experiencia');
    }
};
//# sourceMappingURL=experience.controller.js.map