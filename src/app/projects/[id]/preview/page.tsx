'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useProject } from '@/hooks/useProject'
import { generateAppAI, UsageLimitError } from '@/lib/ai-service'
import ProjectPageHeader from '@/components/layout/ProjectPageHeader'
import AppPreviewRenderer from '@/components/preview/AppPreviewRenderer'

export default function PreviewPage() {
  const { id } = useParams<{ id: string }>()
  const { project, loading, updateProject } = useProject(id)
  const [generating, setGenerating] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)

  useEffect(() => {
    if (!project) return
    if (!project.generatedApp) {
      setGenerating(true)
      generateAppAI(project.plan, project.screens)
        .then((generatedApp) => updateProject((p) => ({ ...p, generatedApp })))
        .catch((err: unknown) => {
          setAiError(
            err instanceof UsageLimitError
              ? err.message
              : '미리보기 생성 중 오류가 발생했어요. 다시 시도해주세요.'
          )
        })
        .finally(() => setGenerating(false))
    }
  }, [project?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading || generating) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-gray-400 text-sm animate-pulse">앱 미리보기를 생성하는 중…</p>
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
        <ProjectPageHeader currentStep={4} />

        <h1 className="text-2xl font-bold text-gray-900 mb-2">앱 미리보기</h1>
        <p className="text-gray-500 mb-6 text-sm">
          기획서를 바탕으로 앱의 UI를 미리볼 수 있습니다.
        </p>

        {aiError && (
          <div className="mb-6 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
            {aiError}
          </div>
        )}

        {project.generatedApp && <AppPreviewRenderer schema={project.generatedApp} />}
      </div>
    </main>
  )
}
