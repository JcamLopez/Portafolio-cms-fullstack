import { z } from 'zod';
export declare const profileSchema: z.ZodObject<{
    fullName: z.ZodString;
    headline: z.ZodString;
    subheadline: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    bio: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    location: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    email: z.ZodOptional<z.ZodNullable<z.ZodEmail>>;
    phone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    avatarUrl: z.ZodOptional<z.ZodNullable<z.ZodURL>>;
    resumeUrl: z.ZodOptional<z.ZodNullable<z.ZodURL>>;
    availableForWork: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type ProfileSchemaInput = z.infer<typeof profileSchema>;
//# sourceMappingURL=profile.schema.d.ts.map