import type { ReactNode } from 'react'

type ModalShellProps = {
  children: ReactNode
}

export default function ModalShell({ children }: ModalShellProps) {
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-900">
        {children}
      </div>
    </div>
  )
}
