import { useState } from 'react'
import { useActivities } from './useActivities'
import type { Activity } from '../../types/activity'

type ActivityPickerProps = {
  onSelect: (activity: Activity) => void
}

export default function ActivityPicker({ onSelect }: ActivityPickerProps) {
  const { activities, loading, createActivity, deleteActivity } = useActivities()
  const [name, setName] = useState('')

  const pinned = activities.filter((a) => a.pinned)

  const handleCreateOrSelect = async () => {
    const trimmed = name.trim()
    if (!trimmed) return
    const existing = activities.find((a) => a.name.toLowerCase() === trimmed.toLowerCase())
    const activity = existing ?? (await createActivity(trimmed))
    onSelect(activity)
  }

  const handleDelete = (activity: Activity) => {
    if (window.confirm(`Удалить активность «${activity.name}» с экрана таймера?`)) {
      void deleteActivity(activity.id)
    }
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      {!loading && pinned.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {pinned.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-1.5 rounded-full border bg-white py-1.5 pl-3 pr-1.5 text-sm font-medium transition-colors hover:bg-neutral-50 dark:bg-neutral-800 dark:hover:bg-neutral-700"
              style={{ borderColor: `${activity.color}55` }}
            >
              <button onClick={() => onSelect(activity)} className="flex items-center gap-1.5">
                <span>{activity.emoji}</span>
                <span>{activity.name}</span>
              </button>
              <button
                onClick={() => handleDelete(activity)}
                aria-label={`Удалить ${activity.name}`}
                className="rounded-full px-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-rose-600 dark:hover:bg-neutral-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {!loading && pinned.length === 0 && (
        <p className="text-center text-sm text-neutral-400 dark:text-neutral-500">
          Ещё нет сохранённых активностей — начни с ввода ниже
        </p>
      )}

      <div className="flex flex-col gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreateOrSelect()}
          placeholder="Чем занимаешься?"
          className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-center focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder-neutral-500"
        />
        <button
          onClick={handleCreateOrSelect}
          disabled={!name.trim()}
          className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Start
        </button>
      </div>
    </div>
  )
}
