import { useCallback, useEffect, useState } from 'react'
import { db } from '../../db/db'
import type { Activity } from '../../types/activity'
import type { PlanItem } from '../../types/plan'

export type PlanWithActual = {
  item: PlanItem
  activity: Activity | null
  actualSec: number
}

export function usePlan(date: string) {
  const [items, setItems] = useState<PlanWithActual[]>([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    const planItems = await db.plans.where('date').equals(date).toArray()
    const daySessions = await db.sessions.where('date').equals(date).toArray()

    const withActual = await Promise.all(
      planItems.map(async (item) => {
        const activity = (await db.activities.get(item.activityId)) ?? null
        const actualSec = daySessions
          .filter((s) => s.activityId === item.activityId)
          .reduce((sum, s) => sum + s.durationSec, 0)
        return { item, activity, actualSec }
      }),
    )

    withActual.sort((a, b) => a.item.createdAt - b.item.createdAt)
    setItems(withActual)
    setLoading(false)
  }, [date])

  useEffect(() => {
    reload()
  }, [reload])

  const addItem = useCallback(
    async (activityId: string, plannedMin: number) => {
      const item: PlanItem = {
        id: crypto.randomUUID(),
        date,
        activityId,
        plannedMin,
        createdAt: Date.now(),
      }
      await db.plans.add(item)
      await reload()
    },
    [date, reload],
  )

  const removeItem = useCallback(
    async (id: string) => {
      await db.plans.delete(id)
      await reload()
    },
    [reload],
  )

  const updateItem = useCallback(
    async (id: string, changes: Partial<Pick<PlanItem, 'plannedMin'>>) => {
      await db.plans.update(id, changes)
      await reload()
    },
    [reload],
  )

  return { items, loading, addItem, removeItem, updateItem, reload }
}
