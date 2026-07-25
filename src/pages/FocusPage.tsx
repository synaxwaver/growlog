import TimerControls from '../features/timer/TimerControls'
import TimerDisplay from '../features/timer/TimerDisplay'

export default function FocusPage() {
  return (
    <div className="flex flex-col items-center gap-8 py-12">
      <TimerDisplay />
      <TimerControls />
    </div>
  )
}
