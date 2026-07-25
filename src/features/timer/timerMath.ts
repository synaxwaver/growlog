import type { RunningTimer } from '../../types/timer'

export function getElapsedSec(timer: RunningTimer | null): number {
  if (!timer) return 0
  const runningSec = timer.lastResumeAt !== null ? (Date.now() - timer.lastResumeAt) / 1000 : 0
  return timer.accumulatedSec + runningSec
}

export function formatDuration(totalSec: number): string {
  const sec = Math.floor(totalSec)
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  const pad = (n: number) => n.toString().padStart(2, '0')
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`
}
