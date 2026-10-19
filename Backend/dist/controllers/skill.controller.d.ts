import type { Request, Response } from 'express';
type SkillParams = {
    id: string;
};
type SkillSlugParams = {
    slug: string;
};
export declare const getAllSkills: (_req: Request, res: Response) => Promise<Response<import("../types/api.types.js").ApiErrorResponse, Record<string, any>> | Response<import("../types/api.types.js").ApiSuccessResponse<{
    id: number;
    name: string;
    slug: string;
    category: import("@prisma/client").$Enums.SkillCategory;
    level: import("@prisma/client").$Enums.SkillLevel | null;
    iconUrl: string | null;
    color: string | null;
    isFeatured: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}[]>, Record<string, any>>>;
export declare const getSkillById: (req: Request<SkillParams>, res: Response) => Promise<Response<import("../types/api.types.js").ApiErrorResponse, Record<string, any>> | Response<import("../types/api.types.js").ApiSuccessResponse<{
    id: number;
    name: string;
    slug: string;
    category: import("@prisma/client").$Enums.SkillCategory;
    level: import("@prisma/client").$Enums.SkillLevel | null;
    iconUrl: string | null;
    color: string | null;
    isFeatured: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}>, Record<string, any>>>;
export declare const getSkillBySlug: (req: Request<SkillSlugParams>, res: Response) => Promise<Response<import("../types/api.types.js").ApiErrorResponse, Record<string, any>> | Response<import("../types/api.types.js").ApiSuccessResponse<{
    id: number;
    name: string;
    slug: string;
    category: import("@prisma/client").$Enums.SkillCategory;
    level: import("@prisma/client").$Enums.SkillLevel | null;
    iconUrl: string | null;
    color: string | null;
    isFeatured: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}>, Record<string, any>>>;
export declare const createSkill: (req: Request, res: Response) => Promise<Response<import("../types/api.types.js").ApiErrorResponse, Record<string, any>> | Response<import("../types/api.types.js").ApiSuccessResponse<{
    id: number;
    name: string;
    slug: string;
    category: import("@prisma/client").$Enums.SkillCategory;
    level: import("@prisma/client").$Enums.SkillLevel | null;
    iconUrl: string | null;
    color: string | null;
    isFeatured: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}>, Record<string, any>>>;
export declare const updateSkill: (req: Request<SkillParams>, res: Response) => Promise<Response<import("../types/api.types.js").ApiErrorResponse, Record<string, any>> | Response<import("../types/api.types.js").ApiSuccessResponse<{
    id: number;
    name: string;
    slug: string;
    category: import("@prisma/client").$Enums.SkillCategory;
    level: import("@prisma/client").$Enums.SkillLevel | null;
    iconUrl: string | null;
    color: string | null;
    isFeatured: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}>, Record<string, any>>>;
export declare const deleteSkill: (req: Request<SkillParams>, res: Response) => Promise<Response<import("../types/api.types.js").ApiErrorResponse, Record<string, any>> | Response<import("../types/api.types.js").ApiSuccessResponse<{
    id: number;
    name: string;
    slug: string;
    category: import("@prisma/client").$Enums.SkillCategory;
    level: import("@prisma/client").$Enums.SkillLevel | null;
    iconUrl: string | null;
    color: string | null;
    isFeatured: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}>, Record<string, any>>>;
export {};
//# sourceMappingURL=skill.controller.d.ts.map