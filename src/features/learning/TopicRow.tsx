import { useState } from 'react'
import { formatDuration } from '../timer/timerMath'
import type { Topic, TopicStatus } from '../../types/topic'

const STATUS_LABELS: Record<TopicStatus, string> = {
  todo: 'Не начато',
  active: 'В процессе',
  done: 'Пройдено',
}

const NEXT_STATUS: Record<TopicStatus, TopicStatus> = {
  todo: 'active',
  active: 'done',
  done: 'todo',
}

type TopicRowProps = {
  topic: Topic
  actualSec: number
  sessionCount: number
  canMoveUp: boolean
  canMoveDown: boolean
  onRename: (name: string) => void
  onSetStatus: (status: TopicStatus) => void
  onMoveUp: () => void
  onMoveDown: () => void
  onDelete: () => void
}

export default function TopicRow({
  topic,
  actualSec,
  sessionCount,
  canMoveUp,
  canMoveDown,
  onRename,
  onSetStatus,
  onMoveUp,
  onMoveDown,
  onDelete,
}: TopicRowProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(topic.name)

  const commitRename = () => {
    setEditing(false)
    if (draft.trim() && draft.trim() !== topic.name) {
      onRename(draft.trim())
    } else {
      setDraft(topic.name)
    }
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 dark:border-neutral-800 dark:bg-neutral-900">
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${
          topic.status === 'active' ? 'bg-emerald-500' : 'bg-transparent'
        }`}
        aria-hidden
      />

      <div className="min-w-0 flex-1">
        {editing ? (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => e.key === 'Enter' && commitRename()}
            className="w-full rounded border border-neutral-300 px-1.5 py-0.5 text-sm focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="truncate text-left text-sm font-medium hover:underline"
          >
            {topic.name}
          </button>
        )}
        <div className="text-xs text-neutral-500 dark:text-neutral-400">
          {formatDuration(actualSec)} · {sessionCount}{' '}
          {sessionCount === 1 ? 'сессия' : 'сессий'}
        </div>
      </div>

      <button
        onClick={() => onSetStatus(NEXT_STATUS[topic.status])}
        className="shrink-0 whitespace-nowrap rounded-full border border-neutral-200 px-2 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
      >
        {STATUS_LABELS[topic.status]}
      </button>

      <div className="flex shrink-0 flex-col">
        <button
          onClick={onMoveUp}
          disabled={!canMoveUp}
          aria-label="Переместить выше"
          className="text-xs text-neutral-400 hover:text-neutral-700 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:text-neutral-200"
        >
          ▲
        </button>
        <button
          onClick={onMoveDown}
          disabled={!canMoveDown}
          aria-label="Переместить ниже"
          className="text-xs text-neutral-400 hover:text-neutral-700 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:text-neutral-200"
        >
          ▼
        </button>
      </div>

      <button
        onClick={onDelete}
        aria-label={`Удалить подглаву ${topic.name}`}
        className="shrink-0 text-neutral-400 hover:text-rose-600"
      >
        ×
      </button>
    </div>
  )
}
