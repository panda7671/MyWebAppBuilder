import { Project } from '@/types'
import ProjectCard from './ProjectCard'

interface ProjectListProps {
  projects: Project[]
  onDelete: (id: string) => void
  onRename: (id: string, name: string) => void
  onClone: (project: Project) => void
}

export default function ProjectList({ projects, onDelete, onRename, onClone }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-7 h-7 text-indigo-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <path d="M12 8v8M8 12h8" strokeLinecap="round" />
          </svg>
        </div>
        <p className="text-gray-700 font-medium mb-1">아직 만든 앱이 없어요</p>
        <p className="text-gray-400 text-sm">첫 번째 앱 아이디어를 입력해보세요.</p>
      </div>
    )
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {projects.map((project) => (
        <li key={project.id}>
          <ProjectCard
            project={project}
            onDelete={onDelete}
            onRename={onRename}
            onClone={onClone}
          />
        </li>
      ))}
    </ul>
  )
}
