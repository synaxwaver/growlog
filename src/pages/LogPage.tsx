import { useRef, useState, type ChangeEvent } from 'react'
import { useSessions } from '../features/log/useSessions'
import { groupByDate, formatDateLabel } from '../features/log/groupByDate'
import { formatDuration } from '../features/timer/timerMath'
import { exportData, importData } from '../features/backup/backup'
import SessionRow from '../features/log/SessionRow'
import SessionEditModal from '../features/log/SessionEditModal'
import type { Goal } from '../types/goal'
import type { Session } from '../types/session'

type Feedback = {
  type: 'success' | 'error'
  message: string
}

export default function LogPage() {
  const { sessions, loading, deleteSession, updateSession, reload } = useSessions()
  const [editingSession, setEditingSession] = useState<Session | null>(null)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const groups = groupByDate(sessions)

  const handleDelete = (session: Session) => {
    if (window.confirm(`Удалить запись «${session.activityName}»?`)) {
      void deleteSession(session)
    }
  }

  const handleSaveEdit = async (changes: { goals: Goal[]; note: string }) => {
    if (!editingSession) return
    await updateSession(editingSession.id, changes)
    setEditingSession(null)
  }

  const handleExport = async () => {
    try {
      await exportData()
    } catch {
      setFeedback({ type: 'error', message: 'Не удалось создать файл экспорта' })
    }
  }

  const handleImportClick = () => fileInputRef.current?.click()

  const handleImportFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    try {
      const result = await importData(file)
      await reload()
      setFeedback({
        type: 'success',
        message: `Импортировано: активностей — ${result.activitiesCount}, сессий — ${result.sessionsCount}`,
      })
    } catch (err) {
      setFeedback({
        type: 'error',
        message:
          err instanceof Error ? err.message : 'Не удалось прочитать файл — проверь, что это экспорт GrowLog',
      })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-end gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          onChange={handleImportFile}
          className="hidden"
        />
        <button
          onClick={handleImportClick}
          className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          Импорт
        </button>
        <button
          onClick={handleExport}
          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          Экспорт
        </button>
      </div>

      {feedback && (
        <p
          className={`text-sm ${
            feedback.type === 'error'
              ? 'text-rose-600 dark:text-rose-400'
              : 'text-emerald-600 dark:text-emerald-400'
          }`}
        >
          {feedback.message}
        </p>
      )}

      {!loading && sessions.length === 0 ? (
        <div className="text-center text-neutral-400 dark:text-neutral-500">
          <p>Пока пусто — здесь появится история твоих сессий.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {groups.map((group) => {
            const dayTotal = group.items.reduce((sum, s) => sum + s.durationSec, 0)
            return (
              <div key={group.date}>
                <div className="mb-3 flex items-baseline justify-between">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                    {formatDateLabel(group.date)}
                  </h2>
                  <span className="text-xs text-neutral-400 dark:text-neutral-500">
                    {formatDuration(dayTotal)}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {group.items.map((session) => (
                    <SessionRow
                      key={session.id}
                      session={session}
                      onEdit={() => setEditingSession(session)}
                      onDelete={() => handleDelete(session)}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {editingSession && (
        <SessionEditModal
          session={editingSession}
          onCancel={() => setEditingSession(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  )
}
