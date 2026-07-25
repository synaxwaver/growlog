import { useState } from 'react'
import { useSessions } from '../features/log/useSessions'
import { groupByDate, formatDateLabel } from '../features/log/groupByDate'
import { formatDuration } from '../features/timer/timerMath'
import SessionRow from '../features/log/SessionRow'
import SessionEditModal from '../features/log/SessionEditModal'
import type { Goal } from '../types/goal'
import type { Session } from '../types/session'

export default function LogPage() {
  const { sessions, loading, deleteSession, updateSession } = useSessions()
  const [editingSession, setEditingSession] = useState<Session | null>(null)

  if (!loading && sessions.length === 0) {
    return (
      <div className="text-center text-neutral-400">
        <p>Пока пусто — здесь появится история твоих сессий.</p>
      </div>
    )
  }

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

  return (
    <div className="flex flex-col gap-8">
      {groups.map((group) => {
        const dayTotal = group.items.reduce((sum, s) => sum + s.durationSec, 0)
        return (
          <div key={group.date}>
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                {formatDateLabel(group.date)}
              </h2>
              <span className="text-xs text-neutral-400">{formatDuration(dayTotal)}</span>
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
