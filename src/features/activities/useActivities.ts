import { useCallback, useEffect, useState } from 'react'
import { db } from '../../db/db'
import type { Activity } from '../../types/activity'

const EMOJIS = ['🌱', '📚', '💻', '🎨', '🏃', '🧘', '🎸', '✍️', '🔬', '🌍']
const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash
}

function pickForName<T>(name: string, options: T[]): T {
  return options[hashString(name) % options.length]
}

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    const all = await db.activities.orderBy('createdAt').reverse().toArray()
    setActivities(all)
    setLoading(false)
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const createActivity = useCallback(
    async (name: string): Promise<Activity> => {
      const activity: Activity = {
        id: crypto.randomUUID(),
        name,
        emoji: pickForName(name, EMOJIS),
        color: pickForName(name, COLORS),
        totalSec: 0,
        createdAt: Date.now(),
      }
      await db.activities.add(activity)
      await reload()
      return activity
    },
    [reload],
  )

  return { activities, loading, createActivity }
}
