import { useTimerStore } from './useTimerStore'
import { formatDuration } from './timerMath'

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
