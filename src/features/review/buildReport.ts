import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale/ru'
import { db } from '../../db/db'

export type DayReportItem = {
  activityName: string
  activityEmoji: string
  plannedMin: number
  actualSec: number
}

export type DayReportData = {
  date: string
  items: DayReportItem[]
  plannedTotalMin: number
  actualTotalSec: number
  blockers: string
}

export async function collectDayReport(date: string): Promise<DayReportData> {
  const planItems = await db.plans.where('date').equals(date).toArray()
  const sessions = await db.sessions.where('date').equals(date).toArray()
  const review = await db.reviews.get(date)

  const items: DayReportItem[] = await Promise.all(
    planItems.map(async (planItem) => {
      const activity = await db.activities.get(planItem.activityId)
      const actualSec = sessions
        .filter((s) => s.activityId === planItem.activityId)
        .reduce((sum, s) => sum + s.durationSec, 0)
      return {
        activityName: activity?.name ?? 'Активность удалена',
        activityEmoji: activity?.emoji ?? '❓',
        plannedMin: planItem.plannedMin,
        actualSec,
      }
    }),
  )

  return {
    date,
    items,
    plannedTotalMin: planItems.reduce((sum, p) => sum + p.plannedMin, 0),
    actualTotalSec: items.reduce((sum, i) => sum + i.actualSec, 0),
    blockers: review?.blockers ?? '',
  }
}

function formatHoursMinutes(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60)
  const m = Math.round(totalMinutes % 60)
  return `${h}:${m.toString().padStart(2, '0')}`
}

export function formatReportText(data: DayReportData): string {
  const dateLabel = format(parseISO(data.date), 'd MMMM', { locale: ru })
  const plannedTotalSec = data.plannedTotalMin * 60
  const pct = plannedTotalSec > 0 ? Math.round((data.actualTotalSec / plannedTotalSec) * 100) : 0

  const lines = [
    `📅 Итог за ${dateLabel}`,
    `🎯 План: ${formatHoursMinutes(data.plannedTotalMin)} · Факт: ${formatHoursMinutes(
      data.actualTotalSec / 60,
    )} (${pct}%)`,
  ]

  for (const item of data.items) {
    lines.push(
      `• ${item.activityEmoji} ${item.activityName} — ${formatHoursMinutes(
        item.actualSec / 60,
      )} / ${formatHoursMinutes(item.plannedMin)}`,
    )
  }

  if (data.blockers.trim()) {
    lines.push(`📝 Что мешало: ${data.blockers.trim()}`)
  }

  return lines.join('\n')
}
