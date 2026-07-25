import { formatDuration } from '../timer/timerMath'
import type { Session } from '../../types/session'

type SessionRowProps = {
  session: Session
  onEdit: () => void
  onDelete: () => void
}

export default function SessionRow({ session, onEdit, onDelete }: SessionRowProps) {
  return (
    <div
      onClick={onEdit}
      className="cursor-pointer rounded-lg border border-neutral-200 bg-white p-4 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium">{session.activityName}</span>
        <span className="whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
          {formatDuration(session.durationSec)}
        </span>
      </div>

      {session.goals.length > 0 && (
        <ul className="mt-2 flex flex-col gap-1 text-sm text-neutral-600 dark:text-neutral-400">
          {session.goals.map((goal) => (
            <li
              key={goal.id}
              className={goal.done ? 'text-neutral-400 line-through dark:text-neutral-500' : ''}
            >
              {goal.done ? '✓ ' : '• '}
              {goal.text}
            </li>
          ))}
        </ul>
      )}

      {session.note && (
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">{session.note}</p>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        className="mt-2 text-xs text-neutral-400 hover:text-rose-600 dark:text-neutral-500"
      >
        Удалить
      </button>
    </div>
  )
}
