import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { TOKEN_STORAGE_KEY, UNAUTHORIZED_EVENT } from '../api/client';

export interface User {
  id: string;
  email: string;
  role?: string;
}

export interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

interface JwtPayload {
  sub?: string;
  id?: string;
  email?: string;
  role?: string;
  exp?: number;
}

interface AuthProviderProps {
  children: ReactNode;
}

function decodeToken(token: string): JwtPayload | null {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join(''),
    );

    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

function isTokenExpired(payload: JwtPayload | null): boolean {
  if (!payload?.exp) return false;
  return payload.exp * 1000 <= Date.now();
}

function toUser(payload: JwtPayload | null): User | null {
  const id = payload?.sub ?? payload?.id;
  if (!payload || !id || !payload.email) return null;
  return { id, email: payload.email, role: payload.role };
}

function readStoredToken(): string | null {
  const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (!stored) return null;

  // Descarta valores que no son un JWT decodificable (ej. "undefined") o que ya expiraron
  const payload = decodeToken(stored);
  if (!payload || isTokenExpired(payload)) {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    return null;
  }

  return stored;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(readStoredToken);

  const login = useCallback((newToken: string) => {
    if (typeof newToken !== 'string' || !decodeToken(newToken)) {
      throw new Error('El servidor no devolvió un token válido.');
    }
    localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
  }, []);

  // Cierra sesión si el cliente HTTP recibe un 401.
  useEffect(() => {
    window.addEventListener(UNAUTHORIZED_EVENT, logout);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, logout);
  }, [logout]);

  // Sincroniza la sesión entre pestañas.
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === TOKEN_STORAGE_KEY) setToken(readStoredToken());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const value = useMemo<AuthContextType>(() => {
    const user = token ? toUser(decodeToken(token)) : null;
    return { token, user, isAuthenticated: token !== null, login, logout };
  }, [token, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un <AuthProvider>.');
  }
  return context;
}
