import { z } from 'zod';
export declare const experienceSchema: z.ZodObject<{
    role: z.ZodString;
    organization: z.ZodString;
    description: z.ZodString;
    type: z.ZodEnum<{
        JOB: 'JOB';
        TEACHING: 'TEACHING';
        FREELANCE: 'FREELANCE';
        INTERNSHIP: 'INTERNSHIP';
        VOLUNTEER: 'VOLUNTEER';
    }>;
    startDate: z.ZodPreprocess<z.ZodDate, unknown>;
    endDate: z.ZodOptional<z.ZodNullable<z.ZodPreprocess<z.ZodDate, unknown>>>;
    isCurrent: z.ZodOptional<z.ZodBoolean>;
    modality: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        ONSITE: 'ONSITE';
        REMOTE: 'REMOTE';
        HYBRID: 'HYBRID';
    }>>>;
    location: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    companyUrl: z.ZodOptional<z.ZodNullable<z.ZodURL>>;
    logoUrl: z.ZodOptional<z.ZodNullable<z.ZodURL>>;
    highlights: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
    order: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type ExperienceSchemaInput = z.infer<typeof experienceSchema>;
//# sourceMappingURL=experience.schema.d.ts.map