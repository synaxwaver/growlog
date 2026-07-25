import { formatDuration } from '../timer/timerMath'
import type { PlanWithActual } from './usePlan'

type PlanListProps = {
  items: PlanWithActual[]
  onStart: (activityName: string, activityId: string) => void
  onRemove: (id: string) => void
  disabled: boolean
}

export default function PlanList({ items, onStart, onRemove, disabled }: PlanListProps) {
  return (
    <div className="flex flex-col gap-2">
      {items.map(({ item, activity, actualSec }) => {
        const plannedSec = item.plannedMin * 60
        const done = actualSec >= plannedSec
        const pct = plannedSec > 0 ? Math.min(100, Math.round((actualSec / plannedSec) * 100)) : 0
        const name = activity?.name ?? 'Активность удалена'
        const emoji = activity?.emoji ?? '❓'
        const startDisabled = disabled || !activity

        return (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white px-3 py-2 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <button
              onClick={() => activity && onStart(activity.name, activity.id)}
              disabled={startDisabled}
              title={disabled ? 'Сначала останови текущую сессию' : undefined}
              aria-label={`Начать ${name}`}
              className="shrink-0 rounded-full bg-emerald-600 px-2.5 py-1 text-sm text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ▶
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-medium">
                  {emoji} {name} {done && '✓'}
                </span>
                <span className="whitespace-nowrap text-xs text-neutral-500 dark:text-neutral-400">
                  {formatDuration(actualSec)} / {formatDuration(plannedSec)}
                </span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                <div
                  className={`h-full rounded-full transition-all ${
                    done ? 'bg-emerald-500' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => onRemove(item.id)}
              aria-label={`Удалить план ${name}`}
              className="shrink-0 text-neutral-400 hover:text-rose-600"
            >
              ×
            </button>
          </div>
        )
      })}
    </div>
  )
}
