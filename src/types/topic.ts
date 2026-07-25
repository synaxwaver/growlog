export type TopicStatus = 'todo' | 'active' | 'done'

export type Topic = {
  id: string
  activityId: string
  name: string
  order: number
  status: TopicStatus
  createdAt: number
}
