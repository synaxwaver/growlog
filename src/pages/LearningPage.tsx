import { useSubjects } from '../features/learning/useSubjects'
import SubjectCard from '../features/learning/SubjectCard'

export default function LearningPage() {
  const { subjects, loading } = useSubjects()

  if (!loading && subjects.length === 0) {
    return (
      <div className="text-center text-neutral-400 dark:text-neutral-500">
        <p>Пока нет активностей — начни сессию на Focus, чтобы появился первый предмет.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {subjects.map(({ activity }) => (
        <SubjectCard key={activity.id} activity={activity} />
      ))}
    </div>
  )
}
