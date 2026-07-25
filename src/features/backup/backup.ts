import { format } from 'date-fns'
import { db } from '../../db/db'
import type { Activity } from '../../types/activity'
import type { Goal } from '../../types/goal'
import type { Session } from '../../types/session'

const INVALID_FILE_MESSAGE = 'Не удалось прочитать файл — проверь, что это экспорт GrowLog'

type BackupData = {
  version: 1
  exportedAt: number
  activities: Activity[]
  sessions: Session[]
}

export type ImportResult = {
  activitiesCount: number
  sessionsCount: number
}

export async function exportData(): Promise<void> {
  const activities = await db.activities.toArray()
  const sessions = await db.sessions.toArray()

  const backup: BackupData = {
    version: 1,
    exportedAt: Date.now(),
    activities,
    sessions,
  }

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `growlog-backup-${format(new Date(), 'yyyy-MM-dd')}.json`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function isGoal(value: unknown): value is Goal {
  if (typeof value !== 'object' || value === null) return false
  const g = value as Record<string, unknown>
  return typeof g.id === 'string' && typeof g.text === 'string' && typeof g.done === 'boolean'
}

function isActivity(value: unknown): value is Activity {
  if (typeof value !== 'object' || value === null) return false
  const a = value as Record<string, unknown>
  return (
    typeof a.id === 'string' &&
    typeof a.name === 'string' &&
    typeof a.emoji === 'string' &&
    typeof a.color === 'string' &&
    typeof a.totalSec === 'number' &&
    typeof a.createdAt === 'number' &&
    typeof a.pinned === 'boolean' &&
    (a.subtopicId === undefined || a.subtopicId === null || typeof a.subtopicId === 'string')
  )
}

function isSession(value: unknown): value is Session {
  if (typeof value !== 'object' || value === null) return false
  const s = value as Record<string, unknown>
  return (
    typeof s.id === 'string' &&
    (typeof s.activityId === 'string' || s.activityId === null) &&
    typeof s.activityName === 'string' &&
    typeof s.startedAt === 'number' &&
    (typeof s.endedAt === 'number' || s.endedAt === null) &&
    typeof s.durationSec === 'number' &&
    Array.isArray(s.goals) &&
    s.goals.every(isGoal) &&
    typeof s.note === 'string' &&
    typeof s.date === 'string'
  )
}

export async function importData(file: File): Promise<ImportResult> {
  let parsed: unknown
  try {
    parsed = JSON.parse(await file.text())
  } catch {
    throw new Error(INVALID_FILE_MESSAGE)
  }

  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error(INVALID_FILE_MESSAGE)
  }

  const { activities, sessions } = parsed as Record<string, unknown>

  if (
    !Array.isArray(activities) ||
    !Array.isArray(sessions) ||
    !activities.every(isActivity) ||
    !sessions.every(isSession)
  ) {
    throw new Error(INVALID_FILE_MESSAGE)
  }

  const normalizedActivities = activities.map((a) => ({ ...a, subtopicId: a.subtopicId ?? null }))

  await db.activities.bulkPut(normalizedActivities)
  await db.sessions.bulkPut(sessions)

  return { activitiesCount: activities.length, sessionsCount: sessions.length }
}
