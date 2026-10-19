import type { Request, Response } from 'express';
import * as profileService from '../services/profile.service.js';
import type { ProfileInput } from '../services/profile.service.js';
import { sendError, sendSuccess } from '../utils/response.handler.js';

export const getProfile = async (_req: Request, res: Response) => {
  try {
    const profile = await profileService.getProfile();

    if (!profile) {
      return sendError(res, 'El perfil aún no ha sido creado', 404);
    }

    return sendSuccess(res, profile);
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    return sendError(res, 'Error interno al obtener el perfil');
  }
};

export const upsertProfile = async (req: Request, res: Response) => {
  try {
    // req.body ya fue validado y limpiado por validateSchema(profileSchema)
    const { profile, created } = await profileService.upsertProfile(req.body as ProfileInput);

    return created
      ? sendSuccess(res, profile, 201, 'Perfil creado correctamente')
      : sendSuccess(res, profile, 200, 'Perfil actualizado correctamente');
  } catch (error) {
    console.error('Error al guardar el perfil:', error);
    return sendError(res, 'Error interno al guardar el perfil');
  }
};
