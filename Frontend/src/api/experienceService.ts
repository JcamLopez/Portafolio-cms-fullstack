import { apiClient } from './client';

// Deben coincidir con los enums ExperienceType y WorkModality de Prisma
export const EXPERIENCE_TYPES = ['JOB', 'TEACHING', 'FREELANCE', 'INTERNSHIP', 'VOLUNTEER'] as const;
export type ExperienceType = (typeof EXPERIENCE_TYPES)[number];

export const WORK_MODALITIES = ['ONSITE', 'REMOTE', 'HYBRID'] as const;
export type WorkModality = (typeof WORK_MODALITIES)[number];

export interface Experience {
  id: number;
  role: string;
  organization: string;
  type: ExperienceType;
  modality: WorkModality | null;
  location: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string;
  highlights: string[] | null;
  companyUrl: string | null;
  logoUrl: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Campos que el cliente puede enviar (id y timestamps los gestiona el servidor).
// Las fechas viajan en formato ISO "YYYY-MM-DD".
export interface ExperienceInput {
  role: string;
  organization: string;
  type: ExperienceType;
  description: string;
  startDate: string;
  endDate?: string | null;
  isCurrent?: boolean;
  modality?: WorkModality | null;
  location?: string | null;
  companyUrl?: string | null;
  logoUrl?: string | null;
  highlights?: string[] | null;
  order?: number;
}

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

// VITE_API_URL ya incluye el prefijo /api, por lo que aquí basta con /experience
export async function getExperiences(): Promise<Experience[]> {
  const { data } = await apiClient.get<ApiSuccessResponse<Experience[]>>('/experience');
  return data.data;
}

export async function createExperience(input: ExperienceInput): Promise<Experience> {
  const { data } = await apiClient.post<ApiSuccessResponse<Experience>>('/experience', input);
  return data.data;
}

export async function updateExperience(id: number, input: ExperienceInput): Promise<Experience> {
  const { data } = await apiClient.put<ApiSuccessResponse<Experience>>(`/experience/${id}`, input);
  return data.data;
}

export async function deleteExperience(id: number): Promise<Experience> {
  const { data } = await apiClient.delete<ApiSuccessResponse<Experience>>(`/experience/${id}`);
  return data.data;
}
