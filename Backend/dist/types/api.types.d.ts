export interface ApiSuccessResponse<T> {
    success: true;
    data: T;
    message?: string;
}
export interface ApiErrorResponse {
    success: false;
    message: string;
}
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
//# sourceMappingURL=api.types.d.ts.map