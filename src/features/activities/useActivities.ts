import { useCallback, useEffect, useState } from 'react'
import { db } from '../../db/db'
import { getActivityDefaults } from './activityDefaults'
import type { Activity } from '../../types/activity'

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
        ...getActivityDefaults(name),
        totalSec: 0,
        createdAt: Date.now(),
        pinned: false,
        subtopicId: null,
      }
      await db.activities.add(activity)
      await reload()
      return activity
    },
    [reload],
  )

  const setPinned = useCallback(
    async (id: string, pinned: boolean) => {
      await db.activities.update(id, { pinned })
      await reload()
    },
    [reload],
  )

  const deleteActivity = useCallback(
    async (id: string) => {
      await db.activities.delete(id)
      await reload()
    },
    [reload],
  )

  return { activities, loading, createActivity, setPinned, deleteActivity }
}
