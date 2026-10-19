import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

export const TOKEN_STORAGE_KEY = 'cms_auth_token';
export const UNAUTHORIZED_EVENT = 'auth:unauthorized';

const baseURL: string | undefined = import.meta.env.VITE_API_URL;

if (!baseURL) {
  throw new Error('VITE_API_URL no está definida en las variables de entorno.');
}

export const apiClient = axios.create({
  baseURL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  return config;
});

// Si el backend rechaza el token (expirado/revocado), se notifica al AuthContext
// para cerrar sesión. Se excluye /auth/login para no interferir con credenciales inválidas.
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const isLoginRequest = error.config?.url?.includes('/auth/login') ?? false;

    if (error.response?.status === 401 && !isLoginRequest) {
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }

    return Promise.reject(error);
  },
);

export interface ApiErrorBody {
  message?: string | string[];
  error?: string;
}

export function getApiErrorMessage(error: unknown, fallback = 'Ocurrió un error inesperado.'): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    if (!error.response) {
      return 'No se pudo conectar con el servidor. Verifica tu conexión.';
    }

    const { message, error: errorText } = error.response.data ?? {};
    if (Array.isArray(message)) return message.join(', ');
    return message ?? errorText ?? fallback;
  }

  return fallback;
}
