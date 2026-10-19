import { apiClient } from './client';

// Deben coincidir con los enums SkillCategory y SkillLevel de Prisma
export const SKILL_CATEGORIES = [
  'LANGUAGE',
  'FRONTEND',
  'BACKEND',
  'DATABASE',
  'DEVOPS',
  'CLOUD',
  'TESTING',
  'IOT',
  'TOOL',
  'OTHER',
] as const;
export type SkillCategory = (typeof SKILL_CATEGORIES)[number];

export const SKILL_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'] as const;
export type SkillLevel = (typeof SKILL_LEVELS)[number];

// Progresión de luminosidad pensada para dark mode
export const LEVEL_COLORS: Record<SkillLevel, string> = {
  BEGINNER: '#64748B',
  INTERMEDIATE: '#0EA5E9',
  ADVANCED: '#8B5CF6',
  EXPERT: '#10B981',
};

export const DEFAULT_SKILL_COLOR = LEVEL_COLORS.BEGINNER;

// Color de la BD; si falta, el del nivel; si tampoco hay nivel, el neutro
export function getSkillColor(skill: Pick<Skill, 'color' | 'level'>): string {
  return skill.color || (skill.level ? LEVEL_COLORS[skill.level] : DEFAULT_SKILL_COLOR);
}

export interface Skill {
  id: number;
  name: string;
  slug: string;
  category: SkillCategory;
  level: SkillLevel | null;
  iconUrl: string | null;
  color: string | null;
  isFeatured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Campos que el cliente puede enviar (id y timestamps los gestiona el servidor)
export interface SkillInput {
  name: string;
  slug: string;
  category: SkillCategory;
  level?: SkillLevel | null;
  iconUrl?: string | null;
  color?: string | null;
  isFeatured?: boolean;
  order?: number;
}

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

// VITE_API_URL ya incluye el prefijo /api, por lo que aquí basta con /skills
export async function getSkills(): Promise<Skill[]> {
  const { data } = await apiClient.get<ApiSuccessResponse<Skill[]>>('/skills');
  return data.data;
}

export async function createSkill(input: SkillInput): Promise<Skill> {
  const { data } = await apiClient.post<ApiSuccessResponse<Skill>>('/skills', input);
  return data.data;
}

export async function updateSkill(id: number, input: SkillInput): Promise<Skill> {
  const { data } = await apiClient.put<ApiSuccessResponse<Skill>>(`/skills/${id}`, input);
  return data.data;
}

export async function deleteSkill(id: number): Promise<Skill> {
  const { data } = await apiClient.delete<ApiSuccessResponse<Skill>>(`/skills/${id}`);
  return data.data;
}
