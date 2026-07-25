import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db/db'
import type { Subject } from '../../types/subject'
import type { Subtopic } from '../../types/subtopic'
import type { Activity } from '../../types/activity'
import type { Session } from '../../types/session'

export type LearningData = {
  subjects: Subject[]
  subtopics: Subtopic[]
  activities: Activity[]
  sessions: Session[]
}

export function useLearningData() {
  const data = useLiveQuery<LearningData>(async () => {
    const [subjects, subtopics, activities, sessions] = await Promise.all([
      db.subjects.orderBy('order').toArray(),
      db.subtopics.orderBy('order').toArray(),
      db.activities.toArray(),
      db.sessions.toArray(),
    ])
    return { subjects, subtopics, activities, sessions }
  }, [])

  return {
    data: data ?? { subjects: [], subtopics: [], activities: [], sessions: [] },
    loading: data === undefined,
  }
}
