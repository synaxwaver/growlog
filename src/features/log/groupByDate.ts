import { format, isToday, isYesterday, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale/ru'

export type DateGroup<T> = {
  date: string
  items: T[]
}

export function groupByDate<T extends { date: string }>(items: T[]): DateGroup<T>[] {
  const map = new Map<string, T[]>()
  for (const item of items) {
    const list = map.get(item.date)
    if (list) {
      list.push(item)
    } else {
      map.set(item.date, [item])
    }
  }
  return Array.from(map.entries())
    .map(([date, groupItems]) => ({ date, items: groupItems }))
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function formatDateLabel(dateStr: string): string {
  const date = parseISO(dateStr)
  if (isToday(date)) return 'Сегодня'
  if (isYesterday(date)) return 'Вчера'
  return format(date, 'd MMMM yyyy', { locale: ru })
}
