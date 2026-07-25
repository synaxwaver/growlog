import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db/db'
import type { Activity } from '../../types/activity'

export type Subject = {
  activity: Activity
  topicCount: number
}

export function useSubjects() {
  const subjects = useLiveQuery(async () => {
    const activities = await db.activities.toArray()
    const topics = await db.topics.toArray()

    const topicCountByActivity = new Map<string, number>()
    for (const topic of topics) {
      topicCountByActivity.set(topic.activityId, (topicCountByActivity.get(topic.activityId) ?? 0) + 1)
    }

    return activities
      .map((activity) => ({
        activity,
        topicCount: topicCountByActivity.get(activity.id) ?? 0,
      }))
      .sort((a, b) => b.topicCount - a.topicCount || a.activity.name.localeCompare(b.activity.name))
  }, [])

  return { subjects: subjects ?? [], loading: subjects === undefined }
}
