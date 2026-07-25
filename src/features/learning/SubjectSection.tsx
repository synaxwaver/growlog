import { useState } from 'react'
import { formatDuration } from '../timer/timerMath'
import { getSubjectProgress, getSubtopicProgress } from './progress'
import { renameSubject, moveSubject, deleteSubject, addSubtopic } from './learningActions'
import SubtopicSection from './SubtopicSection'
import type { Subject } from '../../types/subject'
import type { Subtopic } from '../../types/subtopic'
import type { Activity } from '../../types/activity'
import type { Session } from '../../types/session'
import type { SubtopicOption } from './types'

type SubjectSectionProps = {
  subject: Subject
  subtopics: Subtopic[]
  activities: Activity[]
  unassignedActivities: Activity[]
  sessions: Session[]
  subtopicOptions: SubtopicOption[]
  canMoveUp: boolean
  canMoveDown: boolean
}

export default function SubjectSection({
  subject,
  subtopics,
  activities,
  unassignedActivities,
  sessions,
  subtopicOptions,
  canMoveUp,
  canMoveDown,
}: SubjectSectionProps) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(subject.name)
  const [newSubtopicName, setNewSubtopicName] = useState('')

  const subtopicProgresses = subtopics.map((t) =>
    getSubtopicProgress(
      activities.filter((a) => a.subtopicId === t.id),
      sessions,
    ),
  )
  const progress = getSubjectProgress(subtopics, subtopicProgresses)

  const commitRename = () => {
    setEditing(false)
    if (draft.trim() && draft.trim() !== subject.name) {
      void renameSubject(subject.id, draft.trim())
    } else {
      setDraft(subject.name)
    }
  }

  const handleDelete = () => {
    if (
      window.confirm(
        `Удалить предмет «${subject.name}» вместе с его подтемами? Активности станут непривязанными.`,
      )
    ) {
      void deleteSubject(subject.id)
    }
  }

  const handleAddSubtopic = async () => {
    if (!newSubtopicName.trim()) return
    await addSubtopic(subject.id, newSubtopicName)
    setNewSubtopicName('')
  }

  return (
    <div className="w-full rounded-xl border border-neutral-200 bg-white/60 p-4 dark:border-neutral-800 dark:bg-neutral-900/40">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setExpanded((e) => !e)}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
        >
          <span>{subject.emoji}</span>
          {editing ? (
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => e.key === 'Enter' && commitRename()}
              onClick={(e) => e.stopPropagation()}
              className="min-w-0 flex-1 rounded border border-neutral-300 px-1.5 py-0.5 text-sm focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            />
          ) : (
            <span className="truncate font-medium">{subject.name}</span>
          )}
        </button>

        <span className="shrink-0 whitespace-nowrap text-xs text-neutral-500 dark:text-neutral-400">
          {progress.totalCount > 0 && (
            <>
              {formatDuration(progress.totalSec)} · {progress.doneCount} из {progress.totalCount}{' '}
              пройдено
            </>
          )}
        </span>

        <div className="flex shrink-0 flex-col">
          <button
            onClick={() => void moveSubject(subject.id, 'up')}
            disabled={!canMoveUp}
            aria-label="Переместить предмет выше"
            className="text-xs text-neutral-400 hover:text-neutral-700 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:text-neutral-200"
          >
            ▲
          </button>
          <button
            onClick={() => void moveSubject(subject.id, 'down')}
            disabled={!canMoveDown}
            aria-label="Переместить предмет ниже"
            className="text-xs text-neutral-400 hover:text-neutral-700 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:text-neutral-200"
          >
            ▼
          </button>
        </div>

        <button
          onClick={() => setEditing(true)}
          aria-label="Переименовать предмет"
          className="shrink-0 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
        >
          ✎
        </button>
        <button
          onClick={handleDelete}
          aria-label={`Удалить предмет ${subject.name}`}
          className="shrink-0 text-neutral-400 hover:text-rose-600"
        >
          ×
        </button>
      </div>

      {expanded && (
        <div className="mt-3 flex flex-col gap-2">
          {subtopics.length === 0 && (
            <p className="text-center text-sm text-neutral-400 dark:text-neutral-500">
              Пока нет подтем — добавь первую ниже
            </p>
          )}
          {subtopics.map((subtopic, i) => (
            <SubtopicSection
              key={subtopic.id}
              subtopic={subtopic}
              activitiesInSubtopic={activities.filter((a) => a.subtopicId === subtopic.id)}
              unassignedActivities={unassignedActivities}
              sessions={sessions}
              subtopicOptions={subtopicOptions}
              canMoveUp={i > 0}
              canMoveDown={i < subtopics.length - 1}
            />
          ))}
          <div className="flex gap-2">
            <input
              value={newSubtopicName}
              onChange={(e) => setNewSubtopicName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSubtopic()}
              placeholder="Новая подтема"
              className="flex-1 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder-neutral-500"
            />
            <button
              onClick={handleAddSubtopic}
              disabled={!newSubtopicName.trim()}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Добавить подтему
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
