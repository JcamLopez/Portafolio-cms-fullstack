import type { NextFunction, Request, Response } from 'express';
/**
 * Protege una ruta exigiendo un JWT válido. Si lo es, inyecta su carga útil
 * en req.user y continúa; si no, responde 401 Unauthorized.
 */
export declare const requireAuth: (req: Request, res: Response, next: NextFunction) => Response<import("../types/api.types.js").ApiErrorResponse, Record<string, any>> | undefined;
//# sourceMappingURL=auth.middleware.d.ts.map