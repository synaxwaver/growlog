import { useEffect, useState } from 'react'
import { useTimerStore } from './useTimerStore'
import { getElapsedSec } from './timerMath'

export function useElapsedSec(): number {
  const timer = useTimerStore((s) => s.timer)
  const [elapsedSec, setElapsedSec] = useState(() => getElapsedSec(timer))

  useEffect(() => {
    setElapsedSec(getElapsedSec(timer))
    if (!timer || timer.lastResumeAt === null) return
    const id = setInterval(() => setElapsedSec(getElapsedSec(timer)), 1000)
    return () => clearInterval(id)
  }, [timer])

  return elapsedSec
}
