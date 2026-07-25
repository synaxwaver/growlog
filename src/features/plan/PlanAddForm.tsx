import { useState } from 'react'
import { useActivities } from '../activities/useActivities'

const NEW_ACTIVITY_VALUE = '__new__'

type PlanAddFormProps = {
  onAdd: (activityId: string, plannedMin: number) => Promise<void>
}

export default function PlanAddForm({ onAdd }: PlanAddFormProps) {
  const { activities, createActivity } = useActivities()
  const [selectedId, setSelectedId] = useState('')
  const [newName, setNewName] = useState('')
  const [minutes, setMinutes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isCreatingNew = selectedId === NEW_ACTIVITY_VALUE

  const canSubmit =
    !submitting &&
    !!minutes &&
    Number(minutes) > 0 &&
    (isCreatingNew ? newName.trim().length > 0 : selectedId !== '')

  const handleSubmit = async () => {
    if (!canSubmit) return
    const plannedMin = Math.round(Number(minutes))

    setSubmitting(true)
    try {
      let activityId = selectedId
      if (isCreatingNew) {
        const trimmed = newName.trim()
        const existing = activities.find((a) => a.name.toLowerCase() === trimmed.toLowerCase())
        const activity = existing ?? (await createActivity(trimmed))
        activityId = activity.id
      }
      await onAdd(activityId, plannedMin)
      setSelectedId('')
      setNewName('')
      setMinutes('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        >
          <option value="" disabled>
            Выбери активность
          </option>
          <option value={NEW_ACTIVITY_VALUE}>+ Новая активность</option>
          {activities.map((a) => (
            <option key={a.id} value={a.id}>
              {a.emoji} {a.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          min={1}
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Минут"
          className="w-20 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder-neutral-500"
        />
      </div>

      {isCreatingNew && (
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Название новой активности"
          autoFocus
          className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder-neutral-500"
        />
      )}

      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="self-start rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Добавить в план
      </button>
    </div>
  )
}
