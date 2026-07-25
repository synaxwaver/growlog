import type { Goal } from './goal'

export type Session = {
  id: string
  activityId: string | null
  activityName: string
  startedAt: number
  endedAt: number | null
  durationSec: number
  goals: Goal[]
  note: string
  date: string
}
