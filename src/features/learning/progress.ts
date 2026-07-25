import type { Activity } from '../../types/activity'
import type { Session } from '../../types/session'
import type { Subtopic } from '../../types/subtopic'

export type SubtopicProgress = {
  totalSec: number
  sessionCount: number
}

export function getSubtopicProgress(
  subtopicActivities: Activity[],
  sessions: Session[],
): SubtopicProgress {
  const activityIds = new Set(subtopicActivities.map((a) => a.id))
  const totalSec = subtopicActivities.reduce((sum, a) => sum + a.totalSec, 0)
  const sessionCount = sessions.filter((s) => s.activityId !== null && activityIds.has(s.activityId)).length
  return { totalSec, sessionCount }
}

export type SubjectProgress = {
  totalSec: number
  doneCount: number
  totalCount: number
}

export function getSubjectProgress(
  subtopics: Subtopic[],
  subtopicProgresses: SubtopicProgress[],
): SubjectProgress {
  const totalSec = subtopicProgresses.reduce((sum, p) => sum + p.totalSec, 0)
  const doneCount = subtopics.filter((t) => t.status === 'done').length
  return { totalSec, doneCount, totalCount: subtopics.length }
}
