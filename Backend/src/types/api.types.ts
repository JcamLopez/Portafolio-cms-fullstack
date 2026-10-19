// Respuesta estándar cuando la operación fue exitosa
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

// Respuesta estándar cuando ocurre un error
export interface ApiErrorResponse {
  success: false;
  message: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
