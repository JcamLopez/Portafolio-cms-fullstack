import { apiClient } from './client';

// Debe coincidir con el enum EducationType de Prisma
export const EDUCATION_TYPES = ['UNDERGRADUATE', 'MASTER', 'DIPLOMADO', 'BOOTCAMP', 'COURSE', 'CERTIFICATION'] as const;
export type EducationType = (typeof EDUCATION_TYPES)[number];

export interface Education {
  id: number;
  institution: string;
  title: string;
  fieldOfStudy: string | null;
  type: EducationType;
  startDate: string | null;
  endDate: string | null;
  isCurrent: boolean;
  description: string | null;
  credentialUrl: string | null;
  logoUrl: string | null;
  isFeatured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Campos que el cliente puede enviar (id y timestamps los gestiona el servidor).
// Las fechas viajan en formato ISO "YYYY-MM-DD".
export interface EducationInput {
  institution: string;
  title: string;
  type: EducationType;
  fieldOfStudy?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  isCurrent?: boolean;
  description?: string | null;
  credentialUrl?: string | null;
  logoUrl?: string | null;
  isFeatured?: boolean;
  order?: number;
}

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

// VITE_API_URL ya incluye el prefijo /api, por lo que aquí basta con /education
export async function getEducations(): Promise<Education[]> {
  const { data } = await apiClient.get<ApiSuccessResponse<Education[]>>('/education');
  return data.data;
}

export async function createEducation(input: EducationInput): Promise<Education> {
  const { data } = await apiClient.post<ApiSuccessResponse<Education>>('/education', input);
  return data.data;
}

export async function updateEducation(id: number, input: EducationInput): Promise<Education> {
  const { data } = await apiClient.put<ApiSuccessResponse<Education>>(`/education/${id}`, input);
  return data.data;
}

export async function deleteEducation(id: number): Promise<Education> {
  const { data } = await apiClient.delete<ApiSuccessResponse<Education>>(`/education/${id}`);
  return data.data;
}

// Guarda el orden manual: `ids` en la nueva posición. Devuelve la lista ya reordenada
export async function reorderEducations(ids: number[]): Promise<Education[]> {
  const { data } = await apiClient.put<ApiSuccessResponse<Education[]>>('/education/reorder', { ids });
  return data.data;
}

export async function setEducationFeatured(id: number, isFeatured: boolean): Promise<Education> {
  const { data } = await apiClient.patch<ApiSuccessResponse<Education>>(`/education/${id}/featured`, { isFeatured });
  return data.data;
}
