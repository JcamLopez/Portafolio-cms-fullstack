import { PrismaClient } from '@prisma/client';
import type { Prisma, Profile } from '@prisma/client';

const prisma = new PrismaClient();

// Campos que el cliente puede modificar (id y timestamps los gestiona Prisma)
export type ProfileInput = Omit<Prisma.ProfileCreateInput, 'socialLinks' | 'createdAt' | 'updatedAt'>;

export interface UpsertProfileResult {
  profile: Profile;
  created: boolean;
}

/**
 * Obtiene el perfil único del portafolio (o null si aún no existe).
 */
export const getProfile = async (): Promise<Profile | null> => {
  return prisma.profile.findFirst({
    orderBy: { id: 'asc' },
    include: { socialLinks: { orderBy: { order: 'asc' } } },
  });
};

/**
 * Crea el perfil si no existe o actualiza el existente.
 * Como el modelo no tiene un campo único de negocio, se resuelve el "upsert"
 * buscando el primer registro y usando su id.
 */
export const upsertProfile = async (data: ProfileInput): Promise<UpsertProfileResult> => {
  const existing = await prisma.profile.findFirst({
    orderBy: { id: 'asc' },
    select: { id: true },
  });

  if (existing) {
    const profile = await prisma.profile.update({
      where: { id: existing.id },
      data,
    });
    return { profile, created: false };
  }

  const profile = await prisma.profile.create({ data });
  return { profile, created: true };
};
