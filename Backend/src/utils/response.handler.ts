import type { Response } from 'express';
import type { ApiErrorResponse, ApiSuccessResponse } from '../types/api.types.js';

/**
 * Envía una respuesta de éxito con el formato { success: true, data }.
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode = 200,
  message?: string,
): Response<ApiSuccessResponse<T>> => {
  const body: ApiSuccessResponse<T> = { success: true, data };
  if (message) body.message = message;
  return res.status(statusCode).json(body);
};

/**
 * Envía una respuesta de error con el formato { success: false, message }.
 */
export const sendError = (
  res: Response,
  message: string,
  statusCode = 500,
): Response<ApiErrorResponse> => {
  const body: ApiErrorResponse = { success: false, message };
  return res.status(statusCode).json(body);
};
