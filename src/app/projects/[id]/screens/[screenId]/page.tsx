'use client'

import { useParams, useRouter } from 'next/navigation'
import { useProject } from '@/hooks/useProject'
import WireframeRenderer from '@/components/wireframe/WireframeRenderer'
import ProjectPageHeader from '@/components/layout/ProjectPageHeader'

export default function WireframePage() {
  const { id, screenId } = useParams<{ id: string; screenId: string }>()
  const router = useRouter()
  const { project, loading } = useProject(id)

  if (loading) return null

  if (!project) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-gray-400">프로젝트를 찾을 수 없습니다.</p>
      </main>
    )
  }

  const screenIndex = project.screens.findIndex((s) => s.id === screenId)
  const screen = project.screens[screenIndex]

  if (!screen) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-gray-400">화면을 찾을 수 없습니다.</p>
      </main>
    )
  }

  const prevScreen = screenIndex > 0 ? project.screens[screenIndex - 1] : null
  const nextScreen =
    screenIndex < project.screens.length - 1 ? project.screens[screenIndex + 1] : null

  const NAV_EXCLUDED = new Set(['login', 'payment'])
  const navTabs = project.screens
    .filter((s) => !NAV_EXCLUDED.has(s.id))
    .slice(0, 4)
    .map((s) => s.name)

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-12">
      <div className="w-full max-w-lg">
        <ProjectPageHeader currentStep={4} projectId={id} />

        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">{screen.name}</h1>
            <span className="text-sm text-gray-400">
              {screenIndex + 1} / {project.screens.length}
            </span>
          </div>
          <p className="text-gray-500 text-sm">{screen.description}</p>
        </div>

        <WireframeRenderer
          components={screen.components}
          navTabs={navTabs}
          activeTab={screen.name}
        />

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => router.push(`/projects/${id}/screens`)}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← 화면 목록
          </button>
          <div className="flex gap-2">
            {prevScreen && (
              <button
                onClick={() => router.push(`/projects/${id}/screens/${prevScreen.id}`)}
                className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
              >
                ← {prevScreen.name}
              </button>
            )}
            {nextScreen && (
              <button
                onClick={() => router.push(`/projects/${id}/screens/${nextScreen.id}`)}
                className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
              >
                {nextScreen.name} →
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
