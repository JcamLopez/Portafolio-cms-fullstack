import { z } from 'zod';
export declare const educationSchema: z.ZodObject<{
    institution: z.ZodString;
    title: z.ZodString;
    type: z.ZodEnum<{
        UNDERGRADUATE: 'UNDERGRADUATE';
        MASTER: 'MASTER';
        DIPLOMADO: 'DIPLOMADO';
        BOOTCAMP: 'BOOTCAMP';
        COURSE: 'COURSE';
        CERTIFICATION: 'CERTIFICATION';
    }>;
    startDate: z.ZodOptional<z.ZodNullable<z.ZodCoercedDate<unknown>>>;
    endDate: z.ZodOptional<z.ZodNullable<z.ZodCoercedDate<unknown>>>;
    isCurrent: z.ZodOptional<z.ZodBoolean>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    fieldOfStudy: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    credentialUrl: z.ZodOptional<z.ZodNullable<z.ZodURL>>;
    logoUrl: z.ZodOptional<z.ZodNullable<z.ZodURL>>;
    order: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type EducationSchemaInput = z.infer<typeof educationSchema>;
//# sourceMappingURL=education.schema.d.ts.map