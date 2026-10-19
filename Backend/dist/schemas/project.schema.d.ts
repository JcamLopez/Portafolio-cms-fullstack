import { z } from 'zod';
export declare const projectSchema: z.ZodObject<{
    title: z.ZodString;
    slug: z.ZodString;
    summary: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    description: z.ZodString;
    coverImageUrl: z.ZodOptional<z.ZodNullable<z.ZodURL>>;
    repoUrl: z.ZodOptional<z.ZodNullable<z.ZodURL>>;
    demoUrl: z.ZodOptional<z.ZodNullable<z.ZodURL>>;
    isPublished: z.ZodOptional<z.ZodBoolean>;
    isFeatured: z.ZodOptional<z.ZodBoolean>;
    order: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type ProjectSchemaInput = z.infer<typeof projectSchema>;
//# sourceMappingURL=project.schema.d.ts.map