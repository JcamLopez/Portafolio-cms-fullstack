import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

const navItems = [
  { href: '/#inicio', label: 'Inicio' },
  { href: '/#proyectos', label: 'Proyectos' },
  { href: '/#habilidades', label: 'Habilidades' },
  { href: '/#experiencia', label: 'Experiencia' },
  { href: '/#educacion', label: 'Educación' },
  { href: '/#contacto', label: 'Contacto' },
];

function LockIcon({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
      />
    </svg>
  );
}

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const year = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-slate-950 text-slate-100 antialiased">
      <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/70 backdrop-blur-lg">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="group flex items-center gap-2 text-lg font-bold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-emerald-400 to-cyan-500 text-sm font-black text-slate-950">
              JC
            </span>
            <span className="text-slate-100 transition-colors group-hover:text-emerald-400">
              Juan Camilo<span className="text-emerald-400">.</span>
            </span>
          </Link>

          <ul className="hidden items-center gap-8 md:flex">
            {navItems.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className="text-sm font-medium text-slate-400 transition-colors hover:text-emerald-400"
                >
                  {label}
                </a>
              </li>
            ))}
            {/* Acceso discreto al CMS */}
            <li className="border-l border-slate-800 pl-6">
              <Link
                to="/admin"
                title="Acceso administrador"
                aria-label="Acceso administrador"
                className="flex items-center rounded-md border border-slate-800 p-1.5 text-slate-600 transition-colors hover:border-slate-600 hover:text-slate-300"
              >
                <LockIcon className="h-4 w-4" />
              </Link>
            </li>
          </ul>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100 md:hidden"
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {menuOpen && (
          <ul className="flex flex-col gap-1 max-h-[calc(100svh-4rem)] overflow-y-auto border-t border-slate-800/60 px-4 py-4 sm:px-6 md:hidden">
            {navItems.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-emerald-400"
                >
                  {label}
                </a>
              </li>
            ))}
            <li className="mt-2 border-t border-slate-800/60 pt-2">
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-300"
              >
                <LockIcon className="h-3.5 w-3.5" />
                Admin
              </Link>
            </li>
          </ul>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-800/60 bg-slate-950">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <p className="text-center text-sm text-slate-500 sm:text-left">
            © {year} Juan Camilo López Marín. Todos los derechos reservados.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-500 transition-colors hover:text-emerald-400"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-500 transition-colors hover:text-emerald-400"
            >
              LinkedIn
            </a>
            {/* Acceso discreto al CMS */}
            <Link
              to="/login"
              title="Acceso administrador"
              aria-label="Acceso administrador"
              className="text-slate-700 transition-colors hover:text-slate-400"
            >
              <LockIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
