import { useState } from 'react'
import { usePlan } from './usePlan'
import PlanList from './PlanList'
import PlanAddForm from './PlanAddForm'

type DayPlanSectionProps = {
  date: string
  title: string
  emptyHint: string
  onStart: (activityName: string, activityId: string) => void
  hasActiveTimer: boolean
  collapsible?: boolean
  defaultCollapsed?: boolean
}

export default function DayPlanSection({
  date,
  title,
  emptyHint,
  onStart,
  hasActiveTimer,
  collapsible = false,
  defaultCollapsed = false,
}: DayPlanSectionProps) {
  const { items, loading, addItem, removeItem } = usePlan(date)
  const [collapsed, setCollapsed] = useState(defaultCollapsed)

  return (
    <div className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white/60 p-4 dark:border-neutral-800 dark:bg-neutral-900/40">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">{title}</h2>
        {collapsible && (
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
          >
            {collapsed ? 'Показать' : 'Свернуть'}
          </button>
        )}
      </div>

      {!collapsed && (
        <div className="mt-3 flex flex-col gap-3">
          {!loading && items.length === 0 && (
            <p className="text-center text-sm text-neutral-400 dark:text-neutral-500">
              {emptyHint}
            </p>
          )}
          {items.length > 0 && (
            <PlanList
              items={items}
              onStart={onStart}
              onRemove={removeItem}
              disabled={hasActiveTimer}
            />
          )}
          <PlanAddForm onAdd={addItem} />
        </div>
      )}
    </div>
  )
}
