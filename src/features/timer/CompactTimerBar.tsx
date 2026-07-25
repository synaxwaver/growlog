import { useTimerStore } from './useTimerStore'
import { formatDuration } from './timerMath'

type CompactTimerBarProps = {
  elapsedSec: number
  onStop: () => void
}

export default function CompactTimerBar({ elapsedSec, onStop }: CompactTimerBarProps) {
  const timer = useTimerStore((s) => s.timer)
  const pause = useTimerStore((s) => s.pause)
  const resume = useTimerStore((s) => s.resume)

  if (!timer) return null

  const isRunning = timer.lastResumeAt !== null

  return (
    <div className="sticky top-14 z-10 flex items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white/95 px-4 py-2 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/95">
      <div className="flex min-w-0 items-center gap-2">
        <span className="truncate text-sm font-medium">{timer.activityName}</span>
        <span className="whitespace-nowrap font-mono text-sm tabular-nums text-neutral-500 dark:text-neutral-400">
          {formatDuration(elapsedSec)}
        </span>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          onClick={() => (isRunning ? pause() : resume())}
          className="rounded-md bg-amber-500 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-amber-600"
        >
          {isRunning ? 'Пауза' : 'Продолжить'}
        </button>
        <button
          onClick={() => {
            pause()
            onStop()
          }}
          className="rounded-md bg-rose-600 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-rose-700"
        >
          Стоп
        </button>
      </div>
    </div>
  )
}
