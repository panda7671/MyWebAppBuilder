'use client'

import Link from 'next/link'
import { Project } from '@/types'

interface ProjectCardProps {
  project: Project
  onDelete: (id: string) => void
}

const STATUS_LABEL: Record<Project['status'], string> = {
  draft: '초안',
  planned: '기획 완료',
  complete: '완성',
}

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const title = project.plan.appName || project.input.description || '이름 없음'
  const date = new Date(project.updatedAt).toLocaleDateString('ko-KR')
  const status = STATUS_LABEL[project.status]

  function handleDelete(e: React.MouseEvent) {
    e.preventDefault()
    if (confirm(`"${title}" 프로젝트를 삭제할까요?`)) {
      onDelete(project.id)
    }
  }

  return (
    <Link
      href={`/projects/${project.id}`}
      className="flex items-start justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{title}</p>
        <p className="mt-1 text-xs text-gray-400">
          {date} · {status}
        </p>
      </div>
      <button
        onClick={handleDelete}
        className="ml-4 shrink-0 text-sm text-gray-300 hover:text-red-400 transition-colors"
        aria-label="프로젝트 삭제"
      >
        삭제
      </button>
    </Link>
  )
}
