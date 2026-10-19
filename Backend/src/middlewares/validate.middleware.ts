import type { NextFunction, Request, Response } from 'express';
import { ZodError, type ZodObject } from 'zod';

/**
 * Valida req.body contra un esquema de Zod. Si es válido, reemplaza el body
 * por la versión parseada (sin campos desconocidos) y continúa; si no,
 * responde 400 con la lista de errores por campo.
 */
export const validateSchema = (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      });
    }
    next(error);
  }
};
