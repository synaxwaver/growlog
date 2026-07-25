import { useEffect, useRef, useState } from 'react'
import { addDays, format } from 'date-fns'
import { useDayReview } from '../features/review/useDayReview'
import { formatReportText } from '../features/review/buildReport'
import { formatDateLabel } from '../features/log/groupByDate'
import { formatDuration } from '../features/timer/timerMath'

export default function ReviewPage() {
  const [dayOffset, setDayOffset] = useState(0)
  const date = format(addDays(new Date(), dayOffset), 'yyyy-MM-dd')
  const { report, loading, saveBlockers } = useDayReview(date)

  const [draft, setDraft] = useState('')
  const [copied, setCopied] = useState(false)
  const initializedDateRef = useRef<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (report && initializedDateRef.current !== date) {
      setDraft(report.blockers)
      initializedDateRef.current = date
    }
  }, [report, date])

  useEffect(() => {
    setCopied(false)
  }, [date])

  const handleDraftChange = (value: string) => {
    setDraft(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      void saveBlockers(value)
    }, 600)
  }

  const handleBlur = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    void saveBlockers(draft)
  }

  const handleCopy = async () => {
    if (!report) return
    await navigator.clipboard.writeText(formatReportText(report))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const plannedTotalSec = (report?.plannedTotalMin ?? 0) * 60
  const pct =
    plannedTotalSec > 0 ? Math.min(100, Math.round(((report?.actualTotalSec ?? 0) / plannedTotalSec) * 100)) : 0

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setDayOffset((o) => o - 1)}
          aria-label="Предыдущий день"
          className="rounded-lg px-2 py-1 text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
        >
          ◀
        </button>
        <span className="min-w-[10rem] text-center text-sm font-medium">
          {formatDateLabel(date)}
        </span>
        <button
          onClick={() => setDayOffset((o) => Math.min(0, o + 1))}
          disabled={dayOffset === 0}
          aria-label="Следующий день"
          className="rounded-lg px-2 py-1 text-neutral-500 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-30 dark:text-neutral-400 dark:hover:bg-neutral-800"
        >
          ▶
        </button>
      </div>

      <div className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white/60 p-4 dark:border-neutral-800 dark:bg-neutral-900/40">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">🎯 План: {formatDuration(plannedTotalSec)}</span>
          <span className="text-neutral-500 dark:text-neutral-400">
            Факт: {formatDuration(report?.actualTotalSec ?? 0)} ({pct}%)
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
          <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
        </div>

        {!loading && report && report.items.length === 0 && (
          <p className="mt-4 text-center text-sm text-neutral-400 dark:text-neutral-500">
            На этот день нет плана — добавь пункты в «План дня» на Focus.
          </p>
        )}

        {report && report.items.length > 0 && (
          <div className="mt-4 flex flex-col gap-2">
            {report.items.map((item, i) => {
              const itemPlannedSec = item.plannedMin * 60
              const itemPct =
                itemPlannedSec > 0 ? Math.min(100, Math.round((item.actualSec / itemPlannedSec) * 100)) : 0
              const done = item.actualSec >= itemPlannedSec
              return (
                <div key={i}>
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="truncate">
                      {item.activityEmoji} {item.activityName} {done && '✓'}
                    </span>
                    <span className="whitespace-nowrap text-xs text-neutral-500 dark:text-neutral-400">
                      {formatDuration(item.actualSec)} / {formatDuration(itemPlannedSec)}
                    </span>
                  </div>
                  <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                    <div
                      className={`h-full rounded-full transition-all ${done ? 'bg-emerald-500' : 'bg-emerald-400'}`}
                      style={{ width: `${itemPct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="w-full max-w-sm">
        <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
          Что мешало / как прошло
        </label>
        <textarea
          value={draft}
          onChange={(e) => handleDraftChange(e.target.value)}
          onBlur={handleBlur}
          rows={3}
          placeholder="Например: отвлекался на телефон"
          className="mt-2 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />
      </div>

      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            Текст отчёта
          </span>
          <button
            onClick={handleCopy}
            disabled={!report}
            className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {copied ? 'Скопировано' : 'Скопировать'}
          </button>
        </div>
        <pre className="mt-2 whitespace-pre-wrap rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm dark:border-neutral-800 dark:bg-neutral-900">
          {report ? formatReportText(report) : ''}
        </pre>
      </div>
    </div>
  )
}
