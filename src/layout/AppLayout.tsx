import { NavLink, Outlet } from 'react-router-dom'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive ? 'bg-emerald-600 text-white' : 'text-neutral-600 hover:bg-neutral-100'
  }`

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/80 backdrop-blur">
        <nav className="mx-auto flex max-w-2xl items-center gap-2 px-4 py-3">
          <span className="mr-2 text-lg font-semibold">🌱 GrowLog</span>
          <NavLink to="/" end className={linkClass}>
            Focus
          </NavLink>
          <NavLink to="/log" className={linkClass}>
            Log
          </NavLink>
        </nav>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
