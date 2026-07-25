import Dexie, { type EntityTable } from 'dexie'
import type { Activity } from '../types/activity'
import type { Session } from '../types/session'

export const db = new Dexie('growlog') as Dexie & {
  activities: EntityTable<Activity, 'id'>
  sessions: EntityTable<Session, 'id'>
}

db.version(1).stores({
  activities: 'id, name, createdAt',
})

db.version(2).stores({
  activities: 'id, name, createdAt',
  sessions: 'id, date, activityId, startedAt',
})
