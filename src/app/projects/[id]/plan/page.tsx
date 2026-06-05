'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useProject } from '@/hooks/useProject'
import { generatePlan } from '@/lib/mock-ai'
import PlanViewer from '@/components/plan/PlanViewer'
import StepIndicator from '@/components/layout/StepIndicator'
import { AppPlan } from '@/types'

export default function PlanPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { project, loading, updateProject } = useProject(id)

  useEffect(() => {
    if (!project) return
    const isEmpty = !project.plan.appName
    if (isEmpty) {
      const plan = generatePlan(project)
      updateProject((p) => ({ ...p, plan }))
    }
  }, [project?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  function handlePlanChange(plan: AppPlan) {
    updateProject((p) => ({ ...p, plan }))
  }

  function handleRegenerate() {
    if (!project) return
    const plan = generatePlan(project)
    updateProject((p) => ({ ...p, plan }))
  }

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
        <StepIndicator currentStep={2} />

        <h1 className="text-2xl font-bold text-gray-900 mb-2">기획서가 완성됐어요</h1>
        <p className="text-gray-500 mb-6 text-sm">
          내용을 확인하고, 수정이 필요하면 직접 편집할 수 있어요.
        </p>

        <PlanViewer plan={project.plan} onChange={handlePlanChange} />

        <div className="mt-2 flex justify-end">
          <button
            onClick={handleRegenerate}
            className="text-xs text-gray-400 hover:text-indigo-500 transition-colors"
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
