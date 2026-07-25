import Dexie, { type EntityTable } from 'dexie'
import type { Activity } from '../types/activity'
import type { Session } from '../types/session'
import type { PlanItem } from '../types/plan'
import type { DayReview } from '../types/review'
import type { Subject } from '../types/subject'
import type { Subtopic } from '../types/subtopic'

export const db = new Dexie('growlog') as Dexie & {
  activities: EntityTable<Activity, 'id'>
  sessions: EntityTable<Session, 'id'>
  plans: EntityTable<PlanItem, 'id'>
  reviews: EntityTable<DayReview, 'date'>
  subjects: EntityTable<Subject, 'id'>
  subtopics: EntityTable<Subtopic, 'id'>
}

db.version(1).stores({
  activities: 'id, name, createdAt',
})

db.version(2).stores({
  activities: 'id, name, createdAt',
  sessions: 'id, date, activityId, startedAt',
})

db.version(3).stores({
  activities: 'id, name, createdAt',
  sessions: 'id, date, activityId, startedAt',
  plans: 'id, date, activityId',
})

db.version(4).stores({
  activities: 'id, name, createdAt',
  sessions: 'id, date, activityId, startedAt',
  plans: 'id, date, activityId',
  reviews: 'date',
})

db.version(5)
  .stores({
    activities: 'id, name, createdAt',
    sessions: 'id, date, activityId, startedAt, *topicIds',
    plans: 'id, date, activityId',
    reviews: 'date',
    topics: 'id, activityId, order',
  })
  .upgrade(async (tx) => {
    await tx
      .table('sessions')
      .toCollection()
      .modify((session) => {
        if (!session.topicIds) session.topicIds = []
      })
  })

// Reverts the v5 experiment: activities/topics is replaced by
// Subject -> Subtopic -> Activity, with sessions linking in only via activityId.
db.version(6)
  .stores({
    activities: 'id, name, createdAt, subtopicId',
    sessions: 'id, date, activityId, startedAt',
    plans: 'id, date, activityId',
    reviews: 'date',
    topics: null,
    subjects: 'id, order',
    subtopics: 'id, subjectId, order',
  })
  .upgrade(async (tx) => {
    await tx
      .table('activities')
      .toCollection()
      .modify((activity) => {
        if (activity.subtopicId === undefined) activity.subtopicId = null
      })
    await tx
      .table('sessions')
      .toCollection()
      .modify((session) => {
        delete session.topicIds
      })
  })
