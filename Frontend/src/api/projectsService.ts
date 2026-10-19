import { apiClient } from './client';
import type { Skill } from './skillsService';

export interface Project {
  id: number;
  title: string;
  slug: string;
  summary: string | null;
  description: string;
  coverImageUrl: string | null;
  repoUrl: string | null;
  demoUrl: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  publishedAt: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectDetail extends Project {
  skills: Skill[];
}

// Campos que el cliente puede enviar (id, timestamps y publishedAt los gestiona el servidor)
export interface ProjectInput {
  title: string;
  slug: string;
  summary?: string | null;
  description: string;
  coverImageUrl?: string | null;
  repoUrl?: string | null;
  demoUrl?: string | null;
  isPublished?: boolean;
  isFeatured?: boolean;
  order?: number;
}

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

// VITE_API_URL ya incluye el prefijo /api, por lo que aquí basta con /projects
export async function getProjects(): Promise<Project[]> {
  const { data } = await apiClient.get<ApiSuccessResponse<Project[]>>('/projects');
  return data.data;
}

export async function getProjectBySlug(slug: string): Promise<ProjectDetail> {
  const { data } = await apiClient.get<ApiSuccessResponse<ProjectDetail>>(
    `/projects/slug/${encodeURIComponent(slug)}`,
  );
  return data.data;
}

export async function createProject(input: ProjectInput): Promise<Project> {
  const { data } = await apiClient.post<ApiSuccessResponse<Project>>('/projects', input);
  return data.data;
}

export async function updateProject(id: number, input: ProjectInput): Promise<Project> {
  const { data } = await apiClient.put<ApiSuccessResponse<Project>>(`/projects/${id}`, input);
  return data.data;
}

export async function deleteProject(id: number): Promise<Project> {
  const { data } = await apiClient.delete<ApiSuccessResponse<Project>>(`/projects/${id}`);
  return data.data;
}
