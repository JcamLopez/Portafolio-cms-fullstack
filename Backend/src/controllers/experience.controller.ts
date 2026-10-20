import type { Request, Response } from 'express';
import * as experienceService from '../services/experience.service.js';
import type { ExperienceInput } from '../services/experience.service.js';
import type { FeaturedInput, ReorderInput } from '../schemas/common.schema.js';
import { sendError, sendSuccess } from '../utils/response.handler.js';

type ExperienceParams = { id: string };

// Convierte el :id de la URL a entero positivo (o null si no es válido)
const parseId = (rawId: string): number | null => {
  const id = Number(rawId);
  return Number.isInteger(id) && id > 0 ? id : null;
};

export const getAllExperiences = async (_req: Request, res: Response) => {
  try {
    const experiences = await experienceService.getAllExperiences();
    return sendSuccess(res, experiences);
  } catch (error) {
    console.error('Error al obtener las experiencias:', error);
    return sendError(res, 'Error interno al obtener las experiencias');
  }
};

export const getExperienceById = async (req: Request<ExperienceParams>, res: Response) => {
  const id = parseId(req.params.id);
  if (id === null) return sendError(res, 'El id de la experiencia no es válido', 400);

  try {
    const experience = await experienceService.getExperienceById(id);

    if (!experience) {
      return sendError(res, 'Experiencia no encontrada', 404);
    }

    return sendSuccess(res, experience);
  } catch (error) {
    console.error('Error al obtener la experiencia:', error);
    return sendError(res, 'Error interno al obtener la experiencia');
  }
};

export const createExperience = async (req: Request, res: Response) => {
  try {
    // req.body ya fue validado y limpiado por validateSchema(experienceSchema)
    const experience = await experienceService.createExperience(req.body as ExperienceInput);
    return sendSuccess(res, experience, 201, 'Experiencia creada correctamente');
  } catch (error) {
    console.error('Error al crear la experiencia:', error);
    return sendError(res, 'Error interno al crear la experiencia');
  }
};

export const updateExperience = async (req: Request<ExperienceParams>, res: Response) => {
  const id = parseId(req.params.id);
  if (id === null) return sendError(res, 'El id de la experiencia no es válido', 400);

  try {
    // req.body ya fue validado y limpiado por validateSchema(experienceSchema)
    const experience = await experienceService.updateExperience(id, req.body as ExperienceInput);

    if (!experience) {
      return sendError(res, 'Experiencia no encontrada', 404);
    }

    return sendSuccess(res, experience, 200, 'Experiencia actualizada correctamente');
  } catch (error) {
    console.error('Error al actualizar la experiencia:', error);
    return sendError(res, 'Error interno al actualizar la experiencia');
  }
};

export const deleteExperience = async (req: Request<ExperienceParams>, res: Response) => {
  const id = parseId(req.params.id);
  if (id === null) return sendError(res, 'El id de la experiencia no es válido', 400);

  try {
    const experience = await experienceService.deleteExperience(id);

    if (!experience) {
      return sendError(res, 'Experiencia no encontrada', 404);
    }

    return sendSuccess(res, experience, 200, 'Experiencia eliminada correctamente');
  } catch (error) {
    console.error('Error al eliminar la experiencia:', error);
    return sendError(res, 'Error interno al eliminar la experiencia');
  }
};

export const reorderExperiences = async (req: Request, res: Response) => {
  try {
    // req.body ya fue validado por validateSchema(reorderSchema)
    const { ids } = req.body as ReorderInput;
    const updated = await experienceService.reorderExperiences(ids);

    if (!updated) {
      return sendError(res, 'Alguno de los ids no existe; no se aplicó el nuevo orden', 404);
    }

    return sendSuccess(res, await experienceService.getAllExperiences(), 200, 'Orden actualizado correctamente');
  } catch (error) {
    console.error('Error al reordenar las experiencias:', error);
    return sendError(res, 'Error interno al reordenar las experiencias');
  }
};

export const setExperienceFeatured = async (req: Request<ExperienceParams>, res: Response) => {
  const id = parseId(req.params.id);
  if (id === null) return sendError(res, 'El id de la experiencia no es válido', 400);

  try {
    // req.body ya fue validado por validateSchema(featuredSchema)
    const { isFeatured } = req.body as FeaturedInput;
    const item = await experienceService.setExperienceFeatured(id, isFeatured);

    if (!item) {
      return sendError(res, 'Experiencia no encontrada', 404);
    }

    return sendSuccess(res, item, 200, isFeatured ? 'Marcado como destacado' : 'Ya no está destacado');
  } catch (error) {
    console.error('Error al cambiar el destacado de la experiencia:', error);
    return sendError(res, 'Error interno al cambiar el destacado de la experiencia');
  }
};
