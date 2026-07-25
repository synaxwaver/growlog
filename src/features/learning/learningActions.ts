import { db } from '../../db/db'
import { getActivityDefaults } from '../activities/activityDefaults'
import type { Subject } from '../../types/subject'
import type { Subtopic, SubtopicStatus } from '../../types/subtopic'

async function nextOrder(current: { order: number }[]): Promise<number> {
  return current.reduce((max, item) => Math.max(max, item.order), -1) + 1
}

export async function addSubject(name: string): Promise<Subject | null> {
  const trimmed = name.trim()
  if (!trimmed) return null

  const existing = await db.subjects.toArray()
  const subject: Subject = {
    id: crypto.randomUUID(),
    name: trimmed,
    ...getActivityDefaults(trimmed),
    order: await nextOrder(existing),
    createdAt: Date.now(),
  }
  await db.subjects.add(subject)
  return subject
}

export async function renameSubject(id: string, name: string): Promise<void> {
  const trimmed = name.trim()
  if (!trimmed) return
  await db.subjects.update(id, { name: trimmed })
}

export async function moveSubject(id: string, direction: 'up' | 'down'): Promise<void> {
  const siblings = await db.subjects.orderBy('order').toArray()
  const index = siblings.findIndex((s) => s.id === id)
  const swapIndex = direction === 'up' ? index - 1 : index + 1
  if (index === -1 || swapIndex < 0 || swapIndex >= siblings.length) return

  const current = siblings[index]
  const swapWith = siblings[swapIndex]
  await db.subjects.update(current.id, { order: swapWith.order })
  await db.subjects.update(swapWith.id, { order: current.order })
}

export async function deleteSubject(id: string): Promise<void> {
  const subtopics = await db.subtopics.where('subjectId').equals(id).toArray()
  for (const subtopic of subtopics) {
    await unassignActivitiesOfSubtopic(subtopic.id)
    await db.subtopics.delete(subtopic.id)
  }
  await db.subjects.delete(id)
}

async function unassignActivitiesOfSubtopic(subtopicId: string): Promise<void> {
  const activities = await db.activities.where('subtopicId').equals(subtopicId).toArray()
  await Promise.all(activities.map((a) => db.activities.update(a.id, { subtopicId: null })))
}

export async function addSubtopic(subjectId: string, name: string): Promise<Subtopic | null> {
  const trimmed = name.trim()
  if (!trimmed) return null

  const existing = await db.subtopics.where('subjectId').equals(subjectId).toArray()
  const subtopic: Subtopic = {
    id: crypto.randomUUID(),
    subjectId,
    name: trimmed,
    order: await nextOrder(existing),
    status: 'todo',
    createdAt: Date.now(),
  }
  await db.subtopics.add(subtopic)
  return subtopic
}

export async function renameSubtopic(id: string, name: string): Promise<void> {
  const trimmed = name.trim()
  if (!trimmed) return
  await db.subtopics.update(id, { name: trimmed })
}

export async function setSubtopicStatus(id: string, status: SubtopicStatus): Promise<void> {
  await db.subtopics.update(id, { status })
}

export async function moveSubtopic(
  id: string,
  subjectId: string,
  direction: 'up' | 'down',
): Promise<void> {
  const siblings = await db.subtopics.where('subjectId').equals(subjectId).sortBy('order')
  const index = siblings.findIndex((s) => s.id === id)
  const swapIndex = direction === 'up' ? index - 1 : index + 1
  if (index === -1 || swapIndex < 0 || swapIndex >= siblings.length) return

  const current = siblings[index]
  const swapWith = siblings[swapIndex]
  await db.subtopics.update(current.id, { order: swapWith.order })
  await db.subtopics.update(swapWith.id, { order: current.order })
}

export async function deleteSubtopic(id: string): Promise<void> {
  await unassignActivitiesOfSubtopic(id)
  await db.subtopics.delete(id)
}

export async function assignActivity(activityId: string, subtopicId: string | null): Promise<void> {
  await db.activities.update(activityId, { subtopicId })
}

export async function createActivityInSubtopic(name: string, subtopicId: string): Promise<void> {
  const trimmed = name.trim()
  if (!trimmed) return
  await db.activities.add({
    id: crypto.randomUUID(),
    name: trimmed,
    ...getActivityDefaults(trimmed),
    totalSec: 0,
    createdAt: Date.now(),
    pinned: false,
    subtopicId,
  })
}
