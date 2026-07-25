import { create } from 'zustand'
import type { RunningTimer } from '../../types/timer'

const STORAGE_KEY = 'growlog:timer'

function loadTimer(): RunningTimer | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as RunningTimer) : null
  } catch {
    return null
  }
}

function saveTimer(timer: RunningTimer | null) {
  if (timer) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(timer))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

type TimerState = {
  timer: RunningTimer | null
  start: (activityName: string) => void
  pause: () => void
  resume: () => void
  stop: () => void
}

export const useTimerStore = create<TimerState>((set, get) => ({
  timer: loadTimer(),

  start: (activityName) => {
    const timer: RunningTimer = {
      activityName,
      startedAt: Date.now(),
      accumulatedSec: 0,
      lastResumeAt: Date.now(),
    }
    saveTimer(timer)
    set({ timer })
  },

  pause: () => {
    const { timer } = get()
    if (!timer || timer.lastResumeAt === null) return
    const accumulatedSec = timer.accumulatedSec + (Date.now() - timer.lastResumeAt) / 1000
    const next: RunningTimer = { ...timer, accumulatedSec, lastResumeAt: null }
    saveTimer(next)
    set({ timer: next })
  },

  resume: () => {
    const { timer } = get()
    if (!timer || timer.lastResumeAt !== null) return
    const next: RunningTimer = { ...timer, lastResumeAt: Date.now() }
    saveTimer(next)
    set({ timer: next })
  },

  stop: () => {
    saveTimer(null)
    set({ timer: null })
  },
}))
