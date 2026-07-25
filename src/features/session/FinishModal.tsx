import { useState } from 'react'
import { format } from 'date-fns'
import { useTimerStore } from '../timer/useTimerStore'
import { formatDuration } from '../timer/timerMath'
import { useActivities } from '../activities/useActivities'
import { db } from '../../db/db'
import type { Goal } from '../../types/goal'
import type { Session } from '../../types/session'
import GoalEditor from './GoalEditor'

type FinishModalProps = {
  elapsedSec: number
  onClose: () => void
}

export default function FinishModal({ elapsedSec, onClose }: FinishModalProps) {
  const timer = useTimerStore((s) => s.timer)
  const stop = useTimerStore((s) => s.stop)
  const { activities, loading: activitiesLoading } = useActivities()
  const [goals, setGoals] = useState<Goal[]>([])
  const [note, setNote] = useState('')
  const [pinActivity, setPinActivity] = useState(false)
  const [saving, setSaving] = useState(false)

  if (!timer) return null

  const activity = activities.find((a) => a.id === timer.activityId)
  const alreadyPinned = activity?.pinned ?? false

  const handleSave = async () => {
    setSaving(true)
    const durationSec = Math.round(elapsedSec)
    const session: Session = {
      id: crypto.randomUUID(),
      activityId: timer.activityId,
      activityName: timer.activityName,
      startedAt: timer.startedAt,
      endedAt: Date.now(),
      durationSec,
      goals,
      note,
      date: format(new Date(timer.startedAt), 'yyyy-MM-dd'),
    }
    await db.sessions.add(session)

    if (timer.activityId) {
      const currentActivity = await db.activities.get(timer.activityId)
      if (currentActivity) {
        await db.activities.update(timer.activityId, {
          totalSec: currentActivity.totalSec + durationSec,
          ...(pinActivity ? { pinned: true } : {}),
        })
      }
    }

    stop()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold">{timer.activityName}</h2>
        <p className="mt-1 text-sm text-neutral-500">Время: {formatDuration(elapsedSec)}</p>

        <div className="mt-4">
          <GoalEditor goals={goals} onChange={setGoals} />
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <span className="text-sm font-medium text-neutral-600">Заметка</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {!activitiesLoading && !alreadyPinned && (
          <label className="mt-4 flex items-center gap-2 text-sm text-neutral-600">
            <input
              type="checkbox"
              checked={pinActivity}
              onChange={(e) => setPinActivity(e.target.checked)}
            />
            Показывать эту активность на экране таймера
          </label>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-neutral-300 px-4 py-2 font-medium text-neutral-600 transition-colors hover:bg-neutral-50"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  )
}
