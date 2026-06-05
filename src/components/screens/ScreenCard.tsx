import Link from 'next/link'
import { Screen } from '@/types'

interface ScreenCardProps {
  screen: Screen
  projectId: string
}

export default function ScreenCard({ screen, projectId }: ScreenCardProps) {
  return (
    <Link
      href={`/projects/${projectId}/screens/${screen.id}`}
      className="group block rounded-xl border border-gray-200 bg-white p-5 hover:border-indigo-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
          {screen.name}
        </h3>
        <span className="text-xs text-gray-400 shrink-0 ml-2">
          {screen.components.length}가지 요소
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{screen.description}</p>
      <div className="flex flex-wrap gap-1.5">
        {screen.components.slice(0, 3).map((c, i) => (
          <span key={i} className="px-2 py-0.5 rounded bg-gray-100 text-xs text-gray-500">
            {c.label}
          </span>
        ))}
        {screen.components.length > 3 && (
          <span className="px-2 py-0.5 rounded bg-gray-100 text-xs text-gray-400">
            +{screen.components.length - 3}
          </span>
        )}
      </div>
    </Link>
  )
}
