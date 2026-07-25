export type SubtopicStatus = 'todo' | 'active' | 'done'

export type Subtopic = {
  id: string
  subjectId: string
  name: string
  order: number
  status: SubtopicStatus
  createdAt: number
}
