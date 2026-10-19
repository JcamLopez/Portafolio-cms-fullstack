import type { Response } from 'express';
import type { ApiErrorResponse, ApiSuccessResponse } from '../types/api.types.js';
/**
 * Envía una respuesta de éxito con el formato { success: true, data }.
 */
export declare const sendSuccess: <T>(res: Response, data: T, statusCode?: number, message?: string) => Response<ApiSuccessResponse<T>>;
/**
 * Envía una respuesta de error con el formato { success: false, message }.
 */
export declare const sendError: (res: Response, message: string, statusCode?: number) => Response<ApiErrorResponse>;
//# sourceMappingURL=response.handler.d.ts.map