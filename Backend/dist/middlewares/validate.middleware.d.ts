import type { NextFunction, Request, Response } from 'express';
import { type ZodObject } from 'zod';
/**
 * Valida req.body contra un esquema de Zod. Si es válido, reemplaza el body
 * por la versión parseada (sin campos desconocidos) y continúa; si no,
 * responde 400 con la lista de errores por campo.
 */
export declare const validateSchema: (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=validate.middleware.d.ts.map