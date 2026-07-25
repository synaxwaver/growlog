import ActivityPicker from '../activities/ActivityPicker'
import { useTimerStore } from './useTimerStore'

type TimerControlsProps = {
  onStop: () => void
}

export default function TimerControls({ onStop }: TimerControlsProps) {
  const timer = useTimerStore((s) => s.timer)
  const start = useTimerStore((s) => s.start)
  const pause = useTimerStore((s) => s.pause)
  const resume = useTimerStore((s) => s.resume)

  if (!timer) {
    return <ActivityPicker onSelect={(activity) => start(activity.name, activity.id)} />
  }

  const isRunning = timer.lastResumeAt !== null

  return (
    <div className="flex gap-3">
      <button
        onClick={() => (isRunning ? pause() : resume())}
        className="rounded-lg bg-amber-500 px-6 py-2 font-medium text-white transition-colors hover:bg-amber-600"
      >
        {isRunning ? 'Пауза' : 'Продолжить'}
      </button>
      <button
        onClick={() => {
          pause()
          onStop()
        }}
        className="rounded-lg bg-rose-600 px-6 py-2 font-medium text-white transition-colors hover:bg-rose-700"
      >
        Стоп
      </button>
    </div>
  )
}
