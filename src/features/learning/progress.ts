import type { Session } from '../../types/session'
import type { Topic } from '../../types/topic'

export type TopicProgress = {
  actualSec: number
  sessionCount: number
}

export function getTopicProgress(topicId: string, sessions: Session[]): TopicProgress {
  let actualSec = 0
  let sessionCount = 0

  for (const session of sessions) {
    if (session.topicIds.length > 0 && session.topicIds.includes(topicId)) {
      actualSec += session.durationSec / session.topicIds.length
      sessionCount += 1
    }
  }

  return { actualSec, sessionCount }
}

export type SubjectProgress = {
  totalSec: number
  doneCount: number
  totalCount: number
}

export function getSubjectProgress(topics: Topic[], sessions: Session[]): SubjectProgress {
  const totalSec = topics.reduce(
    (sum, topic) => sum + getTopicProgress(topic.id, sessions).actualSec,
    0,
  )
  const doneCount = topics.filter((t) => t.status === 'done').length

  return { totalSec, doneCount, totalCount: topics.length }
}
