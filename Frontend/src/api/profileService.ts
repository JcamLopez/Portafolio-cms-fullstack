import axios from 'axios';
import { apiClient } from './client';

export interface Profile {
  id: number;
  fullName: string;
  headline: string;
  subheadline: string | null;
  bio: string | null;
  location: string | null;
  email: string | null;
  phone: string | null;
  avatarUrl: string | null;
  resumeUrl: string | null;
  availableForWork: boolean;
  createdAt: string;
  updatedAt: string;
}

// Campos que el cliente puede enviar (id y timestamps los gestiona el servidor)
export interface ProfileInput {
  fullName: string;
  headline: string;
  subheadline?: string | null;
  bio?: string | null;
  location?: string | null;
  email?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
  resumeUrl?: string | null;
  availableForWork?: boolean;
}

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

// Devuelve null si el perfil aún no ha sido creado (el backend responde 404)
export async function getProfile(): Promise<Profile | null> {
  try {
    const { data } = await apiClient.get<ApiSuccessResponse<Profile>>('/profile');
    return data.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) return null;
    throw err;
  }
}

// El backend crea el perfil si no existe o actualiza el existente
export async function updateProfile(input: ProfileInput): Promise<Profile> {
  const { data } = await apiClient.put<ApiSuccessResponse<Profile>>('/profile', input);
  return data.data;
}
