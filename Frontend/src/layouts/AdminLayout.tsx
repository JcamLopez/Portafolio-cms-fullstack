import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/profile', label: 'Perfil', end: false },
  { to: '/admin/projects', label: 'Proyectos', end: false },
  { to: '/admin/skills', label: 'Habilidades', end: false },
  { to: '/admin/experience', label: 'Experiencia', end: false },
  { to: '/admin/education', label: 'Educación', end: false },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-950 md:flex">
        <div className="flex h-16 items-center border-b border-slate-800 px-6">
          <span className="text-lg font-bold tracking-tight text-emerald-400">Portafolio CMS</span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-4">
          {navItems.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/80 px-6 backdrop-blur">
          <h1 className="text-lg font-semibold text-slate-100">Panel de Administración</h1>

          <div className="flex items-center gap-4">
            {user?.email && (
              <span className="hidden text-sm text-slate-400 sm:inline">{user.email}</span>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            >
              Cerrar Sesión
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
