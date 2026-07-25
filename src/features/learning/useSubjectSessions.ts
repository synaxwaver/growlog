import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db/db'
import type { Session } from '../../types/session'

export function useSubjectSessions(activityId: string): Session[] {
  const sessions = useLiveQuery(
    () => db.sessions.where('activityId').equals(activityId).toArray(),
    [activityId],
  )
  return sessions ?? []
}
