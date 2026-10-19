import type { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../services/auth.service.js';
import { sendError } from '../utils/response.handler.js';

// Extrae el token de un header "Authorization: Bearer <token>" (el esquema no distingue mayúsculas)
const extractBearerToken = (header: string | undefined): string | null => {
  if (!header) return null;
  const [scheme, token, ...rest] = header.trim().split(/\s+/);
  if (scheme?.toLowerCase() !== 'bearer' || !token || rest.length > 0) return null;
  return token;
};

/**
 * Protege una ruta exigiendo un JWT válido. Si lo es, inyecta su carga útil
 * en req.user y continúa; si no, responde 401 Unauthorized.
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    res.set('WWW-Authenticate', 'Bearer');
    return sendError(res, 'Token de autenticación requerido', 401);
  }

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    // no se detalla el motivo (expirado, firma inválida...) para no dar pistas a un atacante
    res.set('WWW-Authenticate', 'Bearer error="invalid_token"');
    return sendError(res, 'Token inválido o expirado', 401);
  }
};
