import { useState } from 'react'
import type { Goal } from '../../types/goal'

type GoalEditorProps = {
  goals: Goal[]
  onChange: (goals: Goal[]) => void
}

export default function GoalEditor({ goals, onChange }: GoalEditorProps) {
  const [draft, setDraft] = useState('')

  const addGoal = () => {
    const text = draft.trim()
    if (!text) return
    onChange([...goals, { id: crypto.randomUUID(), text, done: false }])
    setDraft('')
  }

  const toggleGoal = (id: string) => {
    onChange(goals.map((g) => (g.id === id ? { ...g, done: !g.done } : g)))
  }

  const removeGoal = (id: string) => {
    onChange(goals.filter((g) => g.id !== id))
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-neutral-600">Цели</span>
      {goals.map((goal) => (
        <label key={goal.id} className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={goal.done} onChange={() => toggleGoal(goal.id)} />
          <span className={goal.done ? 'flex-1 text-neutral-400 line-through' : 'flex-1'}>
            {goal.text}
          </span>
          <button
            onClick={() => removeGoal(goal.id)}
            aria-label={`Удалить цель ${goal.text}`}
            className="text-neutral-400 hover:text-rose-600"
          >
            ×
          </button>
        </label>
      ))}
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addGoal()}
          placeholder="Например: выучил циклы в Python"
          className="flex-1 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none"
        />
        <button
          onClick={addGoal}
          className="rounded-lg bg-neutral-100 px-3 py-1.5 text-sm font-medium hover:bg-neutral-200"
        >
          +
        </button>
      </div>
    </div>
  )
}
