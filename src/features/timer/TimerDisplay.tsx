import { useEffect, useState } from 'react'
import { useTimerStore } from './useTimerStore'
import { getElapsedSec } from './timerMath'

function formatDuration(totalSec: number): string {
  const sec = Math.floor(totalSec)
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  const pad = (n: number) => n.toString().padStart(2, '0')
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`
}

export default function TimerDisplay() {
  const timer = useTimerStore((s) => s.timer)
  const [elapsedSec, setElapsedSec] = useState(() => getElapsedSec(timer))

  useEffect(() => {
    setElapsedSec(getElapsedSec(timer))
    if (!timer || timer.lastResumeAt === null) return
    const id = setInterval(() => setElapsedSec(getElapsedSec(timer)), 1000)
    return () => clearInterval(id)
  }, [timer])

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-sm uppercase tracking-wide text-neutral-400">
        {timer ? timer.activityName : 'Нет активной сессии'}
      </span>
      <span className="font-mono text-6xl font-semibold tabular-nums">
        {formatDuration(elapsedSec)}
      </span>
    </div>
  )
}
