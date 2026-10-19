import * as educationService from '../services/education.service.js';
import { sendError, sendSuccess } from '../utils/response.handler.js';
// Convierte el :id de la URL a entero positivo (o null si no es válido)
const parseId = (rawId) => {
    const id = Number(rawId);
    return Number.isInteger(id) && id > 0 ? id : null;
};
export const getAllEducations = async (_req, res) => {
    try {
        const educations = await educationService.getAllEducations();
        return sendSuccess(res, educations);
    }
    catch (error) {
        console.error('Error al obtener la formación:', error);
        return sendError(res, 'Error interno al obtener la formación');
    }
};
export const getEducationById = async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null)
        return sendError(res, 'El id de la formación no es válido', 400);
    try {
        const education = await educationService.getEducationById(id);
        if (!education) {
            return sendError(res, 'Formación no encontrada', 404);
        }
        return sendSuccess(res, education);
    }
    catch (error) {
        console.error('Error al obtener la formación:', error);
        return sendError(res, 'Error interno al obtener la formación');
    }
};
export const createEducation = async (req, res) => {
    try {
        // req.body ya fue validado y limpiado por validateSchema(educationSchema)
        const education = await educationService.createEducation(req.body);
        return sendSuccess(res, education, 201, 'Formación creada correctamente');
    }
    catch (error) {
        console.error('Error al crear la formación:', error);
        return sendError(res, 'Error interno al crear la formación');
    }
};
export const updateEducation = async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null)
        return sendError(res, 'El id de la formación no es válido', 400);
    try {
        // req.body ya fue validado y limpiado por validateSchema(educationSchema)
        const education = await educationService.updateEducation(id, req.body);
        if (!education) {
            return sendError(res, 'Formación no encontrada', 404);
        }
        return sendSuccess(res, education, 200, 'Formación actualizada correctamente');
    }
    catch (error) {
        console.error('Error al actualizar la formación:', error);
        return sendError(res, 'Error interno al actualizar la formación');
    }
};
export const deleteEducation = async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null)
        return sendError(res, 'El id de la formación no es válido', 400);
    try {
        const education = await educationService.deleteEducation(id);
        if (!education) {
            return sendError(res, 'Formación no encontrada', 404);
        }
        return sendSuccess(res, education, 200, 'Formación eliminada correctamente');
    }
    catch (error) {
        console.error('Error al eliminar la formación:', error);
        return sendError(res, 'Error interno al eliminar la formación');
    }
};
//# sourceMappingURL=education.controller.js.map