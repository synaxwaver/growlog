import { useState } from 'react'
import { useLearningData } from '../features/learning/useLearningData'
import { addSubject } from '../features/learning/learningActions'
import SubjectSection from '../features/learning/SubjectSection'
import UnassignedActivities from '../features/learning/UnassignedActivities'
import type { SubtopicOption } from '../features/learning/types'

export default function LearningPage() {
  const { data, loading } = useLearningData()
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleAddSubject = async () => {
    if (!name.trim()) return
    setSubmitting(true)
    try {
      await addSubject(name)
      setName('')
    } finally {
      setSubmitting(false)
    }
  }

  const subtopicOptions: SubtopicOption[] = data.subtopics.map((subtopic) => {
    const subject = data.subjects.find((s) => s.id === subtopic.subjectId)
    return {
      subtopic,
      subjectName: subject?.name ?? '?',
      subjectEmoji: subject?.emoji ?? '',
    }
  })

  const unassignedActivities = data.activities.filter((a) => a.subtopicId === null)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddSubject()}
          placeholder="Новый предмет (например, Python)"
          className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder-neutral-500"
        />
        <button
          onClick={handleAddSubject}
          disabled={submitting || !name.trim()}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Добавить предмет
        </button>
      </div>

      {!loading && data.subjects.length === 0 && (
        <p className="text-center text-sm text-neutral-400 dark:text-neutral-500">
          Пока нет предметов — добавь первый выше
        </p>
      )}

      <div className="flex flex-col gap-3">
        {data.subjects.map((subject, i) => (
          <SubjectSection
            key={subject.id}
            subject={subject}
            subtopics={data.subtopics.filter((t) => t.subjectId === subject.id)}
            activities={data.activities}
            unassignedActivities={unassignedActivities}
            sessions={data.sessions}
            subtopicOptions={subtopicOptions}
            canMoveUp={i > 0}
            canMoveDown={i < data.subjects.length - 1}
          />
        ))}
      </div>

      <UnassignedActivities activities={unassignedActivities} subtopicOptions={subtopicOptions} />
    </div>
  )
}
