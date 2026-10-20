import { useEffect, useState } from 'react';
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

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
      {navItems.map(({ to, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
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
  );
}

const brand = <span className="text-lg font-bold tracking-tight text-emerald-400">Portafolio CMS</span>;

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Mientras el drawer está abierto: Escape lo cierra y se bloquea el scroll del fondo
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen overflow-x-clip bg-slate-900 text-slate-100">
      {/* Sidebar fijo en escritorio */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-950 lg:flex">
        <div className="flex h-16 items-center border-b border-slate-800 px-6">{brand}</div>
        <NavLinks />
      </aside>

      {/* Drawer lateral en móvil y tablet */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${menuOpen ? '' : 'pointer-events-none'}`}
        aria-hidden={!menuOpen}
      >
        <div
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <aside
          id="admin-mobile-nav"
          className={`absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-slate-800 bg-slate-950 shadow-2xl transition-transform duration-200 ${
            menuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          inert={!menuOpen}
        >
          <div className="flex h-16 items-center justify-between border-b border-slate-800 px-4">
            {brand}
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Cerrar menú"
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100"
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <NavLinks onNavigate={() => setMenuOpen(false)} />
          {user?.email && (
            <p className="truncate border-t border-slate-800 px-6 py-4 text-xs text-slate-500">{user.email}</p>
          )}
        </aside>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-slate-800 bg-slate-900/80 px-4 backdrop-blur md:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
              aria-expanded={menuOpen}
              aria-controls="admin-mobile-nav"
              className="-ml-2 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100 lg:hidden"
            >
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="truncate text-base font-semibold text-slate-100 sm:text-lg">Panel de Administración</h1>
          </div>

          <div className="flex shrink-0 items-center gap-4">
            {user?.email && (
              <span className="hidden text-sm text-slate-400 md:inline">{user.email}</span>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 sm:px-4"
            >
              <span className="sm:hidden">Salir</span>
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
