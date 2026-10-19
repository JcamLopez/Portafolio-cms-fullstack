import type { Request, Response } from 'express';
export declare const getProfile: (_req: Request, res: Response) => Promise<Response<import("../types/api.types.js").ApiErrorResponse, Record<string, any>> | Response<import("../types/api.types.js").ApiSuccessResponse<{
    id: number;
    fullName: string;
    headline: string;
    subheadline: string | null;
    bio: string | null;
    location: string | null;
    email: string | null;
    phone: string | null;
    avatarUrl: string | null;
    resumeUrl: string | null;
    availableForWork: boolean;
    createdAt: Date;
    updatedAt: Date;
}>, Record<string, any>>>;
export declare const upsertProfile: (req: Request, res: Response) => Promise<Response<import("../types/api.types.js").ApiErrorResponse, Record<string, any>> | Response<import("../types/api.types.js").ApiSuccessResponse<{
    id: number;
    fullName: string;
    headline: string;
    subheadline: string | null;
    bio: string | null;
    location: string | null;
    email: string | null;
    phone: string | null;
    avatarUrl: string | null;
    resumeUrl: string | null;
    availableForWork: boolean;
    createdAt: Date;
    updatedAt: Date;
}>, Record<string, any>>>;
//# sourceMappingURL=profile.controller.d.ts.map