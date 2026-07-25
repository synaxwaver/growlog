import { useState } from 'react'
import { formatDuration } from '../timer/timerMath'
import { getSubtopicProgress } from './progress'
import {
  renameSubtopic,
  setSubtopicStatus,
  moveSubtopic,
  deleteSubtopic,
  assignActivity,
  createActivityInSubtopic,
} from './learningActions'
import ActivityInSubtopicRow from './ActivityInSubtopicRow'
import type { Subtopic, SubtopicStatus } from '../../types/subtopic'
import type { Activity } from '../../types/activity'
import type { Session } from '../../types/session'
import type { SubtopicOption } from './types'

const STATUS_LABELS: Record<SubtopicStatus, string> = {
  todo: 'Не начато',
  active: 'В процессе',
  done: 'Пройдено',
}

const NEXT_STATUS: Record<SubtopicStatus, SubtopicStatus> = {
  todo: 'active',
  active: 'done',
  done: 'todo',
}

type SubtopicSectionProps = {
  subtopic: Subtopic
  activitiesInSubtopic: Activity[]
  unassignedActivities: Activity[]
  sessions: Session[]
  subtopicOptions: SubtopicOption[]
  canMoveUp: boolean
  canMoveDown: boolean
}

export default function SubtopicSection({
  subtopic,
  activitiesInSubtopic,
  unassignedActivities,
  sessions,
  subtopicOptions,
  canMoveUp,
  canMoveDown,
}: SubtopicSectionProps) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(subtopic.name)
  const [newActivityName, setNewActivityName] = useState('')

  const progress = getSubtopicProgress(activitiesInSubtopic, sessions)

  const commitRename = () => {
    setEditing(false)
    if (draft.trim() && draft.trim() !== subtopic.name) {
      void renameSubtopic(subtopic.id, draft.trim())
    } else {
      setDraft(subtopic.name)
    }
  }

  const handleDelete = () => {
    if (
      window.confirm(
        `Удалить подтему «${subtopic.name}»? Активности внутри неё станут непривязанными.`,
      )
    ) {
      void deleteSubtopic(subtopic.id)
    }
  }

  const handleAddNewActivity = async () => {
    if (!newActivityName.trim()) return
    await createActivityInSubtopic(newActivityName, subtopic.id)
    setNewActivityName('')
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-white px-3 py-2 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-center gap-2">
        <span
          className={`h-2 w-2 shrink-0 rounded-full ${
            subtopic.status === 'active' ? 'bg-emerald-500' : 'bg-transparent'
          }`}
          aria-hidden
        />

        <button
          onClick={() => setExpanded((e) => !e)}
          className="min-w-0 flex-1 text-left"
        >
          {editing ? (
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => e.key === 'Enter' && commitRename()}
              onClick={(e) => e.stopPropagation()}
              className="w-full rounded border border-neutral-300 px-1.5 py-0.5 text-sm focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            />
          ) : (
            <span className="truncate text-sm font-medium">{subtopic.name}</span>
          )}
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {formatDuration(progress.totalSec)} · {progress.sessionCount}{' '}
            {progress.sessionCount === 1 ? 'сессия' : 'сессий'}
          </div>
        </button>

        <button
          onClick={() => void setSubtopicStatus(subtopic.id, NEXT_STATUS[subtopic.status])}
          className="shrink-0 whitespace-nowrap rounded-full border border-neutral-200 px-2 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          {STATUS_LABELS[subtopic.status]}
        </button>

        <div className="flex shrink-0 flex-col">
          <button
            onClick={() => void moveSubtopic(subtopic.id, subtopic.subjectId, 'up')}
            disabled={!canMoveUp}
            aria-label="Переместить подтему выше"
            className="text-xs text-neutral-400 hover:text-neutral-700 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:text-neutral-200"
          >
            ▲
          </button>
          <button
            onClick={() => void moveSubtopic(subtopic.id, subtopic.subjectId, 'down')}
            disabled={!canMoveDown}
            aria-label="Переместить подтему ниже"
            className="text-xs text-neutral-400 hover:text-neutral-700 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:text-neutral-200"
          >
            ▼
          </button>
        </div>

        <button
          onClick={() => setEditing(true)}
          aria-label="Переименовать подтему"
          className="shrink-0 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
        >
          ✎
        </button>
        <button
          onClick={handleDelete}
          aria-label={`Удалить подтему ${subtopic.name}`}
          className="shrink-0 text-neutral-400 hover:text-rose-600"
        >
          ×
        </button>
      </div>

      {expanded && (
        <div className="mt-2 flex flex-col gap-2 pl-4">
          {activitiesInSubtopic.length === 0 && (
            <p className="text-center text-xs text-neutral-400 dark:text-neutral-500">
              Пока нет активностей в этой подтеме
            </p>
          )}
          {activitiesInSubtopic.map((activity) => (
            <ActivityInSubtopicRow
              key={activity.id}
              activity={activity}
              sessions={sessions}
              currentSubtopicId={subtopic.id}
              subtopicOptions={subtopicOptions}
            />
          ))}

          <div className="flex flex-wrap gap-2">
            <input
              value={newActivityName}
              onChange={(e) => setNewActivityName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddNewActivity()}
              placeholder="Новая активность"
              className="min-w-0 flex-1 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder-neutral-500"
            />
            <button
              onClick={handleAddNewActivity}
              disabled={!newActivityName.trim()}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Создать
            </button>
          </div>

          {unassignedActivities.length > 0 && (
            <select
              value=""
              onChange={(e) => {
                if (e.target.value) void assignActivity(e.target.value, subtopic.id)
              }}
              className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            >
              <option value="">Или выбери непривязанную активность…</option>
              {unassignedActivities.map((activity) => (
                <option key={activity.id} value={activity.id}>
                  {activity.emoji} {activity.name}
                </option>
              ))}
            </select>
          )}
        </div>
      )}
    </div>
  )
}
