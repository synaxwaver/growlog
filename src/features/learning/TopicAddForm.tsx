import { useState } from 'react'

type TopicAddFormProps = {
  onAdd: (name: string) => Promise<unknown>
}

export default function TopicAddForm({ onAdd }: TopicAddFormProps) {
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    const trimmed = name.trim()
    if (!trimmed) return
    setSubmitting(true)
    try {
      await onAdd(trimmed)
      setName('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex gap-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        placeholder="Новая подглава"
        className="flex-1 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder-neutral-500"
      />
      <button
        onClick={handleSubmit}
        disabled={submitting || !name.trim()}
        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Добавить
      </button>
    </div>
  )
}
