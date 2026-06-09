'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useProject } from '@/hooks/useProject'
import { generateScreensAI, UsageLimitError } from '@/lib/ai-service'
import ScreenCard from '@/components/screens/ScreenCard'
import ProjectPageHeader from '@/components/layout/ProjectPageHeader'

export default function ScreensPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { project, loading, updateProject } = useProject(id)
  const [generating, setGenerating] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)

  useEffect(() => {
    if (!project) return
    if (project.screens.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGenerating(true)
      generateScreensAI(project.plan)
        .then((screens) => updateProject((p) => ({ ...p, screens })))
        .catch((err: unknown) => {
          setAiError(
            err instanceof UsageLimitError
              ? err.message
              : '화면 목록 생성 중 오류가 발생했어요. 다시 시도해주세요.'
          )
        })
        .finally(() => setGenerating(false))
    }
  }, [project?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading || generating) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-gray-400 text-sm animate-pulse">화면 목록을 생성하는 중…</p>
      </main>
    )
  }

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
        <ProjectPageHeader currentStep={3} />

        <h1 className="text-2xl font-bold text-gray-900 mb-2">화면 목록</h1>
        <p className="text-gray-500 mb-6 text-sm">
          기획서를 바탕으로 화면 목록을 구성했어요. 화면을 선택하면 와이어프레임을 볼 수 있어요.
        </p>

        {aiError && (
          <div className="mb-6 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
            {aiError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {project.screens.map((screen) => (
            <ScreenCard key={screen.id} screen={screen} projectId={id} />
          ))}
        </div>

        <div className="mt-8 space-y-3">
          <button
            onClick={() => router.push(`/projects/${id}/preview`)}
            className="w-full flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            앱 미리보기 생성 →
          </button>
          <div className="flex justify-start">
            <button
              onClick={() => router.push(`/projects/${id}/plan`)}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← 이전
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
