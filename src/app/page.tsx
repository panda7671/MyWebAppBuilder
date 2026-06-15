'use client'

import { useRouter } from 'next/navigation'
import { useProjects } from '@/hooks/useProjects'
import ProjectList from '@/components/project/ProjectList'

export default function HomePage() {
  const router = useRouter()
  const { projects, createProject, deleteProject, renameProject, cloneProject } = useProjects()

  function handleNewProject() {
    const project = createProject('')
    router.push(`/projects/${project.id}/input`)
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">내 앱 만들기</h1>
        <p className="text-lg text-gray-500 mb-10">
          코딩 없이, 원하는 앱을 만들어보세요. 아이디어만 있으면 됩니다.
        </p>
        <button
          onClick={handleNewProject}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-base font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          새 앱 만들기
        </button>
      </div>

      <section className="mt-16 w-full max-w-2xl">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
          내 프로젝트
        </h2>
        <ProjectList
          projects={projects}
          onDelete={deleteProject}
          onRename={renameProject}
          onClone={cloneProject}
        />
      </section>
    </main>
  )
}
