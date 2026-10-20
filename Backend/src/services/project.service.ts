import { Prisma, PrismaClient } from '@prisma/client';
import type { Project, Skill } from '@prisma/client';

const prisma = new PrismaClient();

// Campos que el cliente puede modificar (id, timestamps, publishedAt y relaciones los gestiona el servidor)
export type ProjectInput = Omit<
  Prisma.ProjectCreateInput,
  'images' | 'skills' | 'publishedAt' | 'createdAt' | 'updatedAt'
>;

// Error de Prisma cuando el registro a actualizar/eliminar no existe
const isNotFoundError = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025';

// Siguiente posición libre: los registros nuevos se añaden al final del orden manual
const nextOrder = async (): Promise<number> => {
  const { _max } = await prisma.project.aggregate({ _max: { order: true } });
  return (_max.order ?? -1) + 1;
};

/**
 * Obtiene los proyectos en el orden manual definido desde el admin (`order` asc).
 * A igual `order`, por id para que el resultado sea estable.
 */
export const getAllProjects = async (): Promise<Project[]> => {
  return prisma.project.findMany({
    orderBy: [{ order: 'asc' }, { id: 'asc' }],
  });
};

/**
 * Obtiene un proyecto por su id (o null si no existe).
 */
export const getProjectById = async (id: number): Promise<Project | null> => {
  return prisma.project.findUnique({ where: { id } });
};

export type ProjectWithSkills = Project & { skills: Skill[] };

/**
 * Obtiene un proyecto por su slug junto con sus tecnologías (o null si no existe).
 * La relación pasa por la tabla intermedia ProjectSkill; se aplana para devolver Skill[].
 */
export const getProjectBySlug = async (slug: string): Promise<ProjectWithSkills | null> => {
  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      skills: {
        include: { skill: true },
        orderBy: [{ skill: { order: 'asc' } }, { skill: { name: 'asc' } }],
      },
    },
  });

  if (!project) return null;

  return { ...project, skills: project.skills.map(({ skill }) => skill) };
};

/**
 * Crea un proyecto (al final del orden si no trae `order`). Si nace publicado, se fija publishedAt a la fecha actual.
 */
export const createProject = async (data: ProjectInput): Promise<Project> => {
  return prisma.project.create({
    data: {
      ...data,
      order: data.order ?? (await nextOrder()),
      publishedAt: data.isPublished ? new Date() : null,
    },
  });
};

/**
 * Actualiza un proyecto (o devuelve null si no existe).
 * publishedAt se fija la primera vez que el proyecto pasa a publicado
 * y se limpia si vuelve a borrador.
 */
export const updateProject = async (id: number, data: ProjectInput): Promise<Project | null> => {
  const existing = await prisma.project.findUnique({
    where: { id },
    select: { publishedAt: true },
  });

  if (!existing) return null;

  let publishedAt = existing.publishedAt;
  if (data.isPublished === true && !publishedAt) publishedAt = new Date();
  if (data.isPublished === false) publishedAt = null;

  try {
    return await prisma.project.update({
      where: { id },
      data: { ...data, publishedAt },
    });
  } catch (error) {
    // el proyecto pudo eliminarse entre la lectura y la escritura
    if (isNotFoundError(error)) return null;
    throw error;
  }
};

/**
 * Elimina un proyecto. Devuelve el proyecto eliminado, o null si no existía.
 */
export const deleteProject = async (id: number): Promise<Project | null> => {
  try {
    return await prisma.project.delete({ where: { id } });
  } catch (error) {
    if (isNotFoundError(error)) return null;
    throw error;
  }
};

/**
 * Guarda el orden manual (drag & drop): el índice de cada id en `ids` pasa a ser su `order`.
 * Todo va en una transacción: si algún id no existe no se aplica ningún cambio y devuelve false.
 */
export const reorderProjects = async (ids: number[]): Promise<boolean> => {
  try {
    await prisma.$transaction(
      ids.map((id, index) => prisma.project.update({ where: { id }, data: { order: index } })),
    );
    return true;
  } catch (error) {
    if (isNotFoundError(error)) return false;
    throw error;
  }
};

/**
 * Activa o desactiva el estado destacado (o devuelve null si no existe).
 */
export const setProjectFeatured = async (id: number, isFeatured: boolean): Promise<Project | null> => {
  try {
    return await prisma.project.update({ where: { id }, data: { isFeatured } });
  } catch (error) {
    if (isNotFoundError(error)) return null;
    throw error;
  }
};
