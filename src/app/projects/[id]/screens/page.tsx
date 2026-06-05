'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useProject } from '@/hooks/useProject'
import { generateScreens } from '@/lib/mock-ai'
import ScreenCard from '@/components/screens/ScreenCard'
import StepIndicator from '@/components/layout/StepIndicator'

export default function ScreensPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { project, loading, updateProject } = useProject(id)

  useEffect(() => {
    if (!project) return
    const screens = generateScreens(project)
    updateProject((p) => ({ ...p, screens }))
  }, [project?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return null

  if (!project) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-gray-400">프로젝트를 찾을 수 없습니다.</p>
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-12">
      <div className="w-full max-w-lg">
        <StepIndicator currentStep={3} />

        <h1 className="text-2xl font-bold text-gray-900 mb-2">화면 목록</h1>
        <p className="text-gray-500 mb-6 text-sm">
          기획서를 바탕으로 화면 목록을 구성했어요. 화면을 선택하면 와이어프레임을 볼 수 있어요.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {project.screens.map((screen) => (
            <ScreenCard key={screen.id} screen={screen} projectId={id} />
          ))}
        </div>

        <div className="mt-8 flex justify-start">
          <button
            onClick={() => router.push(`/projects/${id}/plan`)}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← 이전
          </button>
        </div>
      </div>
    </main>
  )
}
