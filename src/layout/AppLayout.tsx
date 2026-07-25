import { useEffect } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useThemeStore } from '../features/theme/useThemeStore'
import { useTimerStore } from '../features/timer/useTimerStore'
import { useElapsedSec } from '../features/timer/useElapsedSec'
import { formatDuration } from '../features/timer/timerMath'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? 'bg-emerald-600 text-white'
      : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
  }`

export default function AppLayout() {
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)
  const timer = useTimerStore((s) => s.timer)
  const elapsedSec = useElapsedSec()

  useEffect(() => {
    document.title = timer
      ? `⏱ ${formatDuration(elapsedSec)} — ${timer.activityName}`
      : 'GrowLog'
  }, [timer, elapsedSec])

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
        <nav className="mx-auto flex max-w-2xl items-center gap-2 px-4 py-3">
          <span className="mr-2 text-lg font-semibold">🌱 GrowLog</span>
          <NavLink to="/" end className={linkClass}>
            Focus
          </NavLink>
          <NavLink to="/log" className={linkClass}>
            Log
          </NavLink>
          <NavLink to="/review" className={linkClass}>
            Итог
          </NavLink>
          <NavLink to="/learning" className={linkClass}>
            Обучение
          </NavLink>
          <div className="ml-auto flex items-center gap-3">
            {timer && (
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                <span className="font-mono tabular-nums">{formatDuration(elapsedSec)}</span>
                <span className="max-w-[8rem] truncate">{timer.activityName}</span>
              </div>
            )}
            <button
              onClick={toggleTheme}
              aria-label="Переключить тему"
              className="rounded-lg px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
