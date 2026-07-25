import Dexie, { type EntityTable } from 'dexie'
import type { Activity } from '../types/activity'

export const db = new Dexie('growlog') as Dexie & {
  activities: EntityTable<Activity, 'id'>
}

db.version(1).stores({
  activities: 'id, name, createdAt',
})
