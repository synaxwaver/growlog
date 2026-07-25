import { useTimerStore } from './useTimerStore'

function formatDuration(totalSec: number): string {
  const sec = Math.floor(totalSec)
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  const pad = (n: number) => n.toString().padStart(2, '0')
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`
}

type TimerDisplayProps = {
  elapsedSec: number
}

export default function TimerDisplay({ elapsedSec }: TimerDisplayProps) {
  const timer = useTimerStore((s) => s.timer)

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
