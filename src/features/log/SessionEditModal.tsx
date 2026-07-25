import { useState } from 'react'
import { formatDuration } from '../timer/timerMath'
import GoalEditor from '../session/GoalEditor'
import type { Goal } from '../../types/goal'
import type { Session } from '../../types/session'

type SessionEditModalProps = {
  session: Session
  onCancel: () => void
  onSave: (changes: { goals: Goal[]; note: string }) => Promise<void> | void
}

export default function SessionEditModal({ session, onCancel, onSave }: SessionEditModalProps) {
  const [goals, setGoals] = useState<Goal[]>(session.goals)
  const [note, setNote] = useState(session.note)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await onSave({ goals, note })
  }

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold">{session.activityName}</h2>
        <p className="mt-1 text-sm text-neutral-500">Время: {formatDuration(session.durationSec)}</p>

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

        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
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
