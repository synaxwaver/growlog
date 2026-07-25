export type RunningTimer = {
  activityName: string
  startedAt: number
  accumulatedSec: number
  lastResumeAt: number | null
}
