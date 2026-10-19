import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient, getApiErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';

interface LoginCredentials {
  email: string;
  password: string;
}

// El backend envuelve la respuesta en { success, data, message }
interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    tokenType: string;
    expiresIn: string;
  };
}

const INITIAL_CREDENTIALS: LoginCredentials = { email: '', password: '' };

export default function Login() {
  const [credentials, setCredentials] = useState<LoginCredentials>(INITIAL_CREDENTIALS);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const { data } = await apiClient.post<LoginResponse>('/auth/login', {
        email: credentials.email.trim(),
        password: credentials.password,
      });

      login(data.data.token);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, 'Credenciales incorrectas. Inténtalo de nuevo.'));
      setCredentials((prev) => ({ ...prev, password: '' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-128 w-lg -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl"
      />

      <section className="relative w-full max-w-md">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-indigo-500/10 ring-1 ring-indigo-500/30">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="size-6 text-indigo-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Panel de Administración</h1>
          <p className="mt-2 text-sm text-slate-400">Inicia sesión para gestionar tu contenido</p>
        </header>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-5 rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/40 backdrop-blur-sm sm:p-8"
        >
          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 size-4 shrink-0">
                <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-slate-300">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={credentials.email}
              onChange={handleChange}
              placeholder="admin@ejemplo.com"
              className="block w-full rounded-lg border border-white/10 bg-slate-950/60 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-slate-300">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={credentials.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="block w-full rounded-lg border border-white/10 bg-slate-950/60 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !credentials.email || !credentials.password}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting && (
              <svg viewBox="0 0 24 24" fill="none" className="size-4 animate-spin">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                <path fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z" className="opacity-75" />
              </svg>
            )}
            {isSubmitting ? 'Iniciando sesión…' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">Acceso restringido a administradores.</p>
      </section>
    </main>
  );
}
