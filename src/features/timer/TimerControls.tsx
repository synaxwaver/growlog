import { useState } from 'react'
import { useTimerStore } from './useTimerStore'

export default function TimerControls() {
  const timer = useTimerStore((s) => s.timer)
  const start = useTimerStore((s) => s.start)
  const pause = useTimerStore((s) => s.pause)
  const resume = useTimerStore((s) => s.resume)
  const stop = useTimerStore((s) => s.stop)
  const [activityName, setActivityName] = useState('')

  if (!timer) {
    return (
      <div className="flex w-full max-w-sm flex-col gap-3">
        <input
          value={activityName}
          onChange={(e) => setActivityName(e.target.value)}
          placeholder="Чем занимаешься?"
          className="rounded-lg border border-neutral-300 px-4 py-2 text-center focus:border-emerald-500 focus:outline-none"
        />
        <button
          onClick={() => activityName.trim() && start(activityName.trim())}
          disabled={!activityName.trim()}
          className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Start
        </button>
      </div>
    )
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
        onClick={stop}
        className="rounded-lg bg-rose-600 px-6 py-2 font-medium text-white transition-colors hover:bg-rose-700"
      >
        Стоп
      </button>
    </div>
  )
}
