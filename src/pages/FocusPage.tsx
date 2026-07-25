import { useRef, useState } from 'react'
import { format, addDays } from 'date-fns'
import { useElapsedSec } from '../features/timer/useElapsedSec'
import { useTimerStore } from '../features/timer/useTimerStore'
import { useInView } from '../features/timer/useInView'
import TimerControls from '../features/timer/TimerControls'
import TimerDisplay from '../features/timer/TimerDisplay'
import CompactTimerBar from '../features/timer/CompactTimerBar'
import Tree from '../features/tree/Tree'
import FinishModal from '../features/session/FinishModal'
import DayPlanSection from '../features/plan/DayPlanSection'

export default function FocusPage() {
  const elapsedSec = useElapsedSec()
  const timer = useTimerStore((s) => s.timer)
  const start = useTimerStore((s) => s.start)
  const [isFinishOpen, setIsFinishOpen] = useState(false)
  const mainTimerRef = useRef<HTMLDivElement>(null)
  const isMainTimerVisible = useInView(mainTimerRef)
  const handleStop = () => setIsFinishOpen(true)

  const today = format(new Date(), 'yyyy-MM-dd')
  const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd')

  const handleStartFromPlan = (activityName: string, activityId: string) => {
    if (timer) return
    start(activityName, activityId)
  }

  return (
    <div className="flex flex-col gap-4">
      {timer && !isMainTimerVisible && (
        <CompactTimerBar elapsedSec={elapsedSec} onStop={handleStop} />
      )}

      <div className="flex flex-col items-center gap-4">
        <DayPlanSection
          date={today}
          title="План на сегодня"
          emptyHint="Наметь, чем займёшься сегодня"
          onStart={handleStartFromPlan}
          hasActiveTimer={!!timer}
        />
        <DayPlanSection
          date={tomorrow}
          title="План на завтра"
          emptyHint="Добавь то, что хочешь сделать завтра"
          onStart={handleStartFromPlan}
          hasActiveTimer={!!timer}
          collapsible
          defaultCollapsed
        />
      </div>

      <div ref={mainTimerRef} className="flex flex-col items-center gap-8 py-12">
        <Tree elapsedSec={elapsedSec} />
        <TimerDisplay elapsedSec={elapsedSec} />
        <TimerControls onStop={handleStop} />
      </div>
      {isFinishOpen && (
        <FinishModal elapsedSec={elapsedSec} onClose={() => setIsFinishOpen(false)} />
      )}
    </div>
  )
}
