import { useState } from 'react'
import { useTopics } from './useTopics'
import { useSubjectSessions } from './useSubjectSessions'
import { getSubjectProgress, getTopicProgress } from './progress'
import { formatDuration } from '../timer/timerMath'
import TopicRow from './TopicRow'
import TopicAddForm from './TopicAddForm'
import type { Activity } from '../../types/activity'

type SubjectCardProps = {
  activity: Activity
}

export default function SubjectCard({ activity }: SubjectCardProps) {
  const [expanded, setExpanded] = useState(false)
  const { topics, addTopic, renameTopic, setStatus, deleteTopic, moveTopic } = useTopics(
    activity.id,
  )
  const sessions = useSubjectSessions(activity.id)
  const progress = getSubjectProgress(topics, sessions)

  const handleDelete = (topicId: string, name: string) => {
    if (window.confirm(`Удалить подглаву «${name}»?`)) {
      void deleteTopic(topicId)
    }
  }

  return (
    <div className="w-full rounded-xl border border-neutral-200 bg-white/60 p-4 dark:border-neutral-800 dark:bg-neutral-900/40">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <span className="flex min-w-0 items-center gap-2 font-medium">
          <span>{activity.emoji}</span>
          <span className="truncate">{activity.name}</span>
        </span>
        <span className="shrink-0 text-xs text-neutral-500 dark:text-neutral-400">
          {progress.totalCount > 0 && (
            <>
              {formatDuration(progress.totalSec)} · {progress.doneCount} из {progress.totalCount}{' '}
              пройдено ·{' '}
            </>
          )}
          {expanded ? '▲' : '▼'}
        </span>
      </button>

      {expanded && (
        <div className="mt-3 flex flex-col gap-2">
          {topics.length === 0 && (
            <p className="text-center text-sm text-neutral-400 dark:text-neutral-500">
              Пока нет подглав — добавь первую ниже
            </p>
          )}
          {topics.map((topic, i) => {
            const topicProgress = getTopicProgress(topic.id, sessions)
            return (
              <TopicRow
                key={topic.id}
                topic={topic}
                actualSec={topicProgress.actualSec}
                sessionCount={topicProgress.sessionCount}
                canMoveUp={i > 0}
                canMoveDown={i < topics.length - 1}
                onRename={(name) => void renameTopic(topic.id, name)}
                onSetStatus={(status) => void setStatus(topic.id, status)}
                onMoveUp={() => void moveTopic(topic.id, 'up')}
                onMoveDown={() => void moveTopic(topic.id, 'down')}
                onDelete={() => handleDelete(topic.id, topic.name)}
              />
            )
          })}
          <TopicAddForm onAdd={addTopic} />
        </div>
      )}
    </div>
  )
}
