import type { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import * as skillService from '../services/skill.service.js';
import type { SkillInput } from '../services/skill.service.js';
import { sendError, sendSuccess } from '../utils/response.handler.js';

type SkillParams = { id: string };
type SkillSlugParams = { slug: string };

// Convierte el :id de la URL a entero positivo (o null si no es válido)
const parseId = (rawId: string): number | null => {
  const id = Number(rawId);
  return Number.isInteger(id) && id > 0 ? id : null;
};

// Error de Prisma por violación de restricción única (aquí, name o slug)
const isUniqueConstraintError = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';

export const getAllSkills = async (_req: Request, res: Response) => {
  try {
    const skills = await skillService.getAllSkills();
    return sendSuccess(res, skills);
  } catch (error) {
    console.error('Error al obtener las habilidades:', error);
    return sendError(res, 'Error interno al obtener las habilidades');
  }
};

export const getSkillById = async (req: Request<SkillParams>, res: Response) => {
  const id = parseId(req.params.id);
  if (id === null) return sendError(res, 'El id de la habilidad no es válido', 400);

  try {
    const skill = await skillService.getSkillById(id);

    if (!skill) {
      return sendError(res, 'Habilidad no encontrada', 404);
    }

    return sendSuccess(res, skill);
  } catch (error) {
    console.error('Error al obtener la habilidad:', error);
    return sendError(res, 'Error interno al obtener la habilidad');
  }
};

export const getSkillBySlug = async (req: Request<SkillSlugParams>, res: Response) => {
  try {
    const skill = await skillService.getSkillBySlug(req.params.slug);

    if (!skill) {
      return sendError(res, 'Habilidad no encontrada', 404);
    }

    return sendSuccess(res, skill);
  } catch (error) {
    console.error('Error al obtener la habilidad:', error);
    return sendError(res, 'Error interno al obtener la habilidad');
  }
};

export const createSkill = async (req: Request, res: Response) => {
  try {
    // req.body ya fue validado y limpiado por validateSchema(skillSchema)
    const skill = await skillService.createSkill(req.body as SkillInput);
    return sendSuccess(res, skill, 201, 'Habilidad creada correctamente');
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return sendError(res, 'Ya existe una habilidad con ese nombre o slug', 409);
    }
    console.error('Error al crear la habilidad:', error);
    return sendError(res, 'Error interno al crear la habilidad');
  }
};

export const updateSkill = async (req: Request<SkillParams>, res: Response) => {
  const id = parseId(req.params.id);
  if (id === null) return sendError(res, 'El id de la habilidad no es válido', 400);

  try {
    // req.body ya fue validado y limpiado por validateSchema(skillSchema)
    const skill = await skillService.updateSkill(id, req.body as SkillInput);

    if (!skill) {
      return sendError(res, 'Habilidad no encontrada', 404);
    }

    return sendSuccess(res, skill, 200, 'Habilidad actualizada correctamente');
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return sendError(res, 'Ya existe una habilidad con ese nombre o slug', 409);
    }
    console.error('Error al actualizar la habilidad:', error);
    return sendError(res, 'Error interno al actualizar la habilidad');
  }
};

export const deleteSkill = async (req: Request<SkillParams>, res: Response) => {
  const id = parseId(req.params.id);
  if (id === null) return sendError(res, 'El id de la habilidad no es válido', 400);

  try {
    const skill = await skillService.deleteSkill(id);

    if (!skill) {
      return sendError(res, 'Habilidad no encontrada', 404);
    }

    return sendSuccess(res, skill, 200, 'Habilidad eliminada correctamente');
  } catch (error) {
    console.error('Error al eliminar la habilidad:', error);
    return sendError(res, 'Error interno al eliminar la habilidad');
  }
};
