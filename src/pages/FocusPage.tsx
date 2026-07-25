import { useState } from 'react'
import { useElapsedSec } from '../features/timer/useElapsedSec'
import TimerControls from '../features/timer/TimerControls'
import TimerDisplay from '../features/timer/TimerDisplay'
import Tree from '../features/tree/Tree'
import FinishModal from '../features/session/FinishModal'

export default function FocusPage() {
  const elapsedSec = useElapsedSec()
  const [isFinishOpen, setIsFinishOpen] = useState(false)

  return (
    <div className="flex flex-col items-center gap-8 py-12">
      <Tree elapsedSec={elapsedSec} />
      <TimerDisplay elapsedSec={elapsedSec} />
      <TimerControls onStop={() => setIsFinishOpen(true)} />
      {isFinishOpen && (
        <FinishModal elapsedSec={elapsedSec} onClose={() => setIsFinishOpen(false)} />
      )}
    </div>
  )
}
