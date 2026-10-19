import { z } from 'zod';
export declare const skillSchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodString;
    category: z.ZodEnum<{
        LANGUAGE: 'LANGUAGE';
        FRONTEND: 'FRONTEND';
        BACKEND: 'BACKEND';
        DATABASE: 'DATABASE';
        DEVOPS: 'DEVOPS';
        CLOUD: 'CLOUD';
        TESTING: 'TESTING';
        IOT: 'IOT';
        TOOL: 'TOOL';
        OTHER: 'OTHER';
    }>;
    level: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        BEGINNER: 'BEGINNER';
        INTERMEDIATE: 'INTERMEDIATE';
        ADVANCED: 'ADVANCED';
        EXPERT: 'EXPERT';
    }>>>;
    iconUrl: z.ZodOptional<z.ZodNullable<z.ZodURL>>;
    color: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    isFeatured: z.ZodOptional<z.ZodBoolean>;
    order: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type SkillSchemaInput = z.infer<typeof skillSchema>;
//# sourceMappingURL=skill.schema.d.ts.map