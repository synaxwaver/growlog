import { useState } from 'react'
import { useActivities } from './useActivities'
import type { Activity } from '../../types/activity'

type ActivityPickerProps = {
  onSelect: (activity: Activity) => void
}

export default function ActivityPicker({ onSelect }: ActivityPickerProps) {
  const { activities, loading, createActivity } = useActivities()
  const [name, setName] = useState('')

  const handleCreateOrSelect = async () => {
    const trimmed = name.trim()
    if (!trimmed) return
    const existing = activities.find((a) => a.name.toLowerCase() === trimmed.toLowerCase())
    const activity = existing ?? (await createActivity(trimmed))
    onSelect(activity)
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      {!loading && activities.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {activities.map((activity) => (
            <button
              key={activity.id}
              onClick={() => onSelect(activity)}
              className="flex items-center gap-1.5 rounded-full border bg-white px-3 py-1.5 text-sm font-medium transition-colors hover:bg-neutral-50"
              style={{ borderColor: `${activity.color}55` }}
            >
              <span>{activity.emoji}</span>
              <span>{activity.name}</span>
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreateOrSelect()}
          placeholder="Чем занимаешься?"
          className="rounded-lg border border-neutral-300 px-4 py-2 text-center focus:border-emerald-500 focus:outline-none"
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
