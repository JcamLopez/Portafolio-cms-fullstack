import type { Request, Response } from 'express';
export declare const register: (req: Request, res: Response) => Promise<Response<import("../types/api.types.js").ApiErrorResponse, Record<string, any>> | Response<import("../types/api.types.js").ApiSuccessResponse<import("../types/auth.types.js").PublicUser>, Record<string, any>>>;
export declare const login: (req: Request, res: Response) => Promise<Response<import("../types/api.types.js").ApiErrorResponse, Record<string, any>> | Response<import("../types/api.types.js").ApiSuccessResponse<{
    token: string;
    tokenType: string;
    expiresIn: string;
    user: import("../types/auth.types.js").PublicUser;
}>, Record<string, any>>>;
//# sourceMappingURL=auth.controller.d.ts.map