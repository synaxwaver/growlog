import { useState } from 'react'
import { format } from 'date-fns'
import { useTimerStore } from '../timer/useTimerStore'
import { formatDuration } from '../timer/timerMath'
import { useActivities } from '../activities/useActivities'
import { db } from '../../db/db'
import type { Goal } from '../../types/goal'
import type { Session } from '../../types/session'

type FinishModalProps = {
  elapsedSec: number
  onClose: () => void
}

export default function FinishModal({ elapsedSec, onClose }: FinishModalProps) {
  const timer = useTimerStore((s) => s.timer)
  const stop = useTimerStore((s) => s.stop)
  const { activities, loading: activitiesLoading } = useActivities()
  const [goals, setGoals] = useState<Goal[]>([])
  const [goalDraft, setGoalDraft] = useState('')
  const [note, setNote] = useState('')
  const [pinActivity, setPinActivity] = useState(false)
  const [saving, setSaving] = useState(false)

  if (!timer) return null

  const activity = activities.find((a) => a.id === timer.activityId)
  const alreadyPinned = activity?.pinned ?? false

  const addGoal = () => {
    const text = goalDraft.trim()
    if (!text) return
    setGoals((prev) => [...prev, { id: crypto.randomUUID(), text, done: false }])
    setGoalDraft('')
  }

  const toggleGoal = (id: string) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, done: !g.done } : g)))
  }

  const removeGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id))
  }

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

        <div className="mt-4 flex flex-col gap-2">
          <span className="text-sm font-medium text-neutral-600">Цели</span>
          {goals.map((goal) => (
            <label key={goal.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={goal.done} onChange={() => toggleGoal(goal.id)} />
              <span className={goal.done ? 'flex-1 text-neutral-400 line-through' : 'flex-1'}>
                {goal.text}
              </span>
              <button
                onClick={() => removeGoal(goal.id)}
                aria-label={`Удалить цель ${goal.text}`}
                className="text-neutral-400 hover:text-rose-600"
              >
                ×
              </button>
            </label>
          ))}
          <div className="flex gap-2">
            <input
              value={goalDraft}
              onChange={(e) => setGoalDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addGoal()}
              placeholder="Например: выучил циклы в Python"
              className="flex-1 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none"
            />
            <button
              onClick={addGoal}
              className="rounded-lg bg-neutral-100 px-3 py-1.5 text-sm font-medium hover:bg-neutral-200"
            >
              +
            </button>
          </div>
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
