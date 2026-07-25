import { useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db/db'
import { collectDayReport } from './buildReport'

export function useDayReview(date: string) {
  const report = useLiveQuery(() => collectDayReport(date), [date])

  const saveBlockers = useCallback(
    async (text: string) => {
      await db.reviews.put({ date, blockers: text, updatedAt: Date.now() })
    },
    [date],
  )

  return {
    report: report ?? null,
    loading: report === undefined,
    saveBlockers,
  }
}
