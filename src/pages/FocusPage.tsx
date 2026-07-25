import { useElapsedSec } from '../features/timer/useElapsedSec'
import TimerControls from '../features/timer/TimerControls'
import TimerDisplay from '../features/timer/TimerDisplay'
import Tree from '../features/tree/Tree'

export default function FocusPage() {
  const elapsedSec = useElapsedSec()

  return (
    <div className="flex flex-col items-center gap-8 py-12">
      <Tree elapsedSec={elapsedSec} />
      <TimerDisplay elapsedSec={elapsedSec} />
      <TimerControls />
    </div>
  )
}
