import { formatDuration } from '../timer/timerMath'
import { assignActivity } from './learningActions'
import type { Activity } from '../../types/activity'
import type { Session } from '../../types/session'
import type { SubtopicOption } from './types'

type ActivityInSubtopicRowProps = {
  activity: Activity
  sessions: Session[]
  currentSubtopicId: string
  subtopicOptions: SubtopicOption[]
}

export default function ActivityInSubtopicRow({
  activity,
  sessions,
  currentSubtopicId,
  subtopicOptions,
}: ActivityInSubtopicRowProps) {
  const sessionCount = sessions.filter((s) => s.activityId === activity.id).length
  const moveOptions = subtopicOptions.filter((o) => o.subtopic.id !== currentSubtopicId)

  return (
    <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-900">
      <span className="min-w-0 flex-1 truncate">
        {activity.emoji} {activity.name}
      </span>
      <span className="shrink-0 whitespace-nowrap text-xs text-neutral-500 dark:text-neutral-400">
        {formatDuration(activity.totalSec)} · {sessionCount} {sessionCount === 1 ? 'сессия' : 'сессий'}
      </span>

      <select
        value=""
        onChange={(e) => {
          if (e.target.value) void assignActivity(activity.id, e.target.value)
        }}
        className="shrink-0 rounded-lg border border-neutral-300 bg-white px-1.5 py-1 text-xs focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
      >
        <option value="">Переместить в…</option>
        {moveOptions.map(({ subtopic, subjectName, subjectEmoji }) => (
          <option key={subtopic.id} value={subtopic.id}>
            {subjectEmoji} {subjectName} — {subtopic.name}
          </option>
        ))}
      </select>

      <button
        onClick={() => void assignActivity(activity.id, null)}
        className="shrink-0 whitespace-nowrap text-xs text-neutral-400 hover:text-rose-600"
      >
        Отвязать
      </button>
    </div>
  )
}
