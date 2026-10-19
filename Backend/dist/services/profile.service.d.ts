import type { Prisma, Profile } from '@prisma/client';
export type ProfileInput = Omit<Prisma.ProfileCreateInput, 'socialLinks' | 'createdAt' | 'updatedAt'>;
export interface UpsertProfileResult {
    profile: Profile;
    created: boolean;
}
/**
 * Obtiene el perfil único del portafolio (o null si aún no existe).
 */
export declare const getProfile: () => Promise<Profile | null>;
/**
 * Crea el perfil si no existe o actualiza el existente.
 * Como el modelo no tiene un campo único de negocio, se resuelve el "upsert"
 * buscando el primer registro y usando su id.
 */
export declare const upsertProfile: (data: ProfileInput) => Promise<UpsertProfileResult>;
//# sourceMappingURL=profile.service.d.ts.map