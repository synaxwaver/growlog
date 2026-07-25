import { useCallback, useEffect, useState } from 'react'
import { db } from '../../db/db'
import type { Goal } from '../../types/goal'
import type { Session } from '../../types/session'

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    const all = await db.sessions.orderBy('startedAt').reverse().toArray()
    setSessions(all)
    setLoading(false)
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const deleteSession = useCallback(
    async (session: Session) => {
      await db.sessions.delete(session.id)
      if (session.activityId) {
        const activity = await db.activities.get(session.activityId)
        if (activity) {
          await db.activities.update(session.activityId, {
            totalSec: Math.max(0, activity.totalSec - session.durationSec),
          })
        }
      }
      await reload()
    },
    [reload],
  )

  const updateSession = useCallback(
    async (id: string, changes: Partial<{ goals: Goal[]; note: string }>) => {
      await db.sessions.update(id, changes)
      await reload()
    },
    [reload],
  )

  return { sessions, loading, deleteSession, updateSession, reload }
}
