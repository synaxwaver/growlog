import type { RunningTimer } from '../../types/timer'

export function getElapsedSec(timer: RunningTimer | null): number {
  if (!timer) return 0
  const runningSec = timer.lastResumeAt !== null ? (Date.now() - timer.lastResumeAt) / 1000 : 0
  return timer.accumulatedSec + runningSec
}
