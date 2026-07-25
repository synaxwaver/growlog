export type RunningTimer = {
  activityId: string | null
  activityName: string
  startedAt: number
  accumulatedSec: number
  lastResumeAt: number | null
}
