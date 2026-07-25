import { useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../db/db'
import type { Topic, TopicStatus } from '../../types/topic'

export function useTopics(activityId: string) {
  const topics = useLiveQuery(
    () => db.topics.where('activityId').equals(activityId).sortBy('order'),
    [activityId],
  )

  const addTopic = useCallback(
    async (name: string) => {
      const trimmed = name.trim()
      if (!trimmed) return
      const existing = await db.topics.where('activityId').equals(activityId).toArray()
      const maxOrder = existing.reduce((max, t) => Math.max(max, t.order), -1)
      const topic: Topic = {
        id: crypto.randomUUID(),
        activityId,
        name: trimmed,
        order: maxOrder + 1,
        status: 'todo',
        createdAt: Date.now(),
      }
      await db.topics.add(topic)
      return topic
    },
    [activityId],
  )

  const renameTopic = useCallback(async (id: string, name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    await db.topics.update(id, { name: trimmed })
  }, [])

  const setStatus = useCallback(async (id: string, status: TopicStatus) => {
    await db.topics.update(id, { status })
  }, [])

  const deleteTopic = useCallback(async (id: string) => {
    await db.topics.delete(id)
  }, [])

  const moveTopic = useCallback(
    async (id: string, direction: 'up' | 'down') => {
      const list = await db.topics.where('activityId').equals(activityId).sortBy('order')
      const index = list.findIndex((t) => t.id === id)
      const swapIndex = direction === 'up' ? index - 1 : index + 1
      if (index === -1 || swapIndex < 0 || swapIndex >= list.length) return

      const current = list[index]
      const swapWith = list[swapIndex]
      await db.topics.update(current.id, { order: swapWith.order })
      await db.topics.update(swapWith.id, { order: current.order })
    },
    [activityId],
  )

  return {
    topics: topics ?? [],
    loading: topics === undefined,
    addTopic,
    renameTopic,
    setStatus,
    deleteTopic,
    moveTopic,
  }
}
