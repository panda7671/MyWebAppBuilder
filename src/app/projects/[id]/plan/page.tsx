'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useProject } from '@/hooks/useProject'
import { generatePlanAI, UsageLimitError } from '@/lib/ai-service'
import PlanViewer from '@/components/plan/PlanViewer'
import ProjectPageHeader from '@/components/layout/ProjectPageHeader'
import { AppPlan } from '@/types'
import { clearScreensAndBelow } from '@/lib/project-factory'

export default function PlanPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { project, loading, updateProject } = useProject(id)
  const [generating, setGenerating] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)

  useEffect(() => {
    if (!project) return
    const isEmpty = !project.plan.appName
    if (isEmpty) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGenerating(true)
      generatePlanAI(project.input.description, project.qa)
        .then((plan) => updateProject((p) => clearScreensAndBelow({ ...p, plan })))
        .catch((err: unknown) => {
          setAiError(
            err instanceof UsageLimitError
              ? err.message
              : '기획서 생성 중 오류가 발생했어요. 다시 시도해주세요.'
          )
        })
        .finally(() => setGenerating(false))
    }
  }, [project?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  function handlePlanChange(plan: AppPlan) {
    updateProject((p) => clearScreensAndBelow({ ...p, plan }))
  }

  async function handleRegenerate() {
    if (!project) return
    setGenerating(true)
    setAiError(null)
    try {
      const plan = await generatePlanAI(project.input.description, project.qa)
      updateProject((p) => clearScreensAndBelow({ ...p, plan }))
    } catch (err: unknown) {
      setAiError(
        err instanceof UsageLimitError
          ? err.message
          : '기획서 생성 중 오류가 발생했어요. 다시 시도해주세요.'
      )
    } finally {
      setGenerating(false)
    }
  }

  if (loading || generating) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-gray-400 text-sm animate-pulse">기획서를 생성하는 중…</p>
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
        <ProjectPageHeader currentStep={2} projectId={id} />

        <h1 className="text-2xl font-bold text-gray-900 mb-2">기획서가 완성됐어요</h1>
        <p className="text-gray-500 mb-6 text-sm">
          내용을 확인하고, 수정이 필요하면 직접 편집할 수 있어요.
        </p>

        {aiError && (
          <div className="mb-6 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
            {aiError}
          </div>
        )}

        <PlanViewer plan={project.plan} onChange={handlePlanChange} />

        <div className="mt-2 flex justify-end">
          <button
            onClick={handleRegenerate}
            disabled={generating}
            className="text-xs text-gray-400 hover:text-indigo-500 transition-colors disabled:opacity-40"
          >
            ↻ 기획서 재생성
          </button>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => router.push(`/projects/${id}/questions`)}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← 이전
          </button>
          <button
            onClick={() => router.push(`/projects/${id}/screens`)}
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            화면 목록 보기 →
          </button>
        </div>
      </div>
    </main>
  )
}
