import { formatDuration } from '../timer/timerMath'
import { assignActivity } from './learningActions'
import type { Activity } from '../../types/activity'
import type { SubtopicOption } from './types'

type UnassignedActivitiesProps = {
  activities: Activity[]
  subtopicOptions: SubtopicOption[]
}

export default function UnassignedActivities({
  activities,
  subtopicOptions,
}: UnassignedActivitiesProps) {
  if (activities.length === 0) return null

  return (
    <div className="w-full rounded-xl border border-neutral-200 bg-white/60 p-4 dark:border-neutral-800 dark:bg-neutral-900/40">
      <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
        Непривязанные активности
      </h2>
      <div className="mt-3 flex flex-col gap-2">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <span className="min-w-0 flex-1 truncate">
              {activity.emoji} {activity.name}
            </span>
            <span className="shrink-0 whitespace-nowrap text-xs text-neutral-500 dark:text-neutral-400">
              {formatDuration(activity.totalSec)}
            </span>
            {subtopicOptions.length > 0 && (
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value) void assignActivity(activity.id, e.target.value)
                }}
                className="shrink-0 rounded-lg border border-neutral-300 bg-white px-1.5 py-1 text-xs focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              >
                <option value="">Поместить в…</option>
                {subtopicOptions.map(({ subtopic, subjectName, subjectEmoji }) => (
                  <option key={subtopic.id} value={subtopic.id}>
                    {subjectEmoji} {subjectName} — {subtopic.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
