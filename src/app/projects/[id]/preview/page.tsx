'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { useProject } from '@/hooks/useProject'
import { generateAppAI, UsageLimitError } from '@/lib/ai-service'
import { schemaToTsx } from '@/lib/schema-to-tsx'
import ProjectPageHeader from '@/components/layout/ProjectPageHeader'
import AppPreviewRenderer from '@/components/preview/AppPreviewRenderer'
import CodeViewModal from '@/components/preview/CodeViewModal'

function toFileName(appName: string): string {
  const slug =
    appName
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[/\\:*?"<>|]/g, '') || 'generated-app'
  return `${slug}.tsx`
}

export default function PreviewPage() {
  const { id } = useParams<{ id: string }>()
  const { project, loading, updateProject } = useProject(id)
  const [generating, setGenerating] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const [showCode, setShowCode] = useState(false)

  const generatedCode = useMemo(
    () => (project?.generatedApp ? schemaToTsx(project.generatedApp) : ''),
    [project?.generatedApp]
  )

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
    <>
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

          {process.env.NODE_ENV === 'development' && project.generatedApp && (
            <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-500 font-mono">
              [DEV] 섹션 {project.generatedApp.sections.length}개
              {project.generatedApp.sections.length > 0 && (
                <> — {project.generatedApp.sections.map((s) => s.type).join(' · ')}</>
              )}
            </div>
          )}

          {project.generatedApp && <AppPreviewRenderer schema={project.generatedApp} />}

          {project.generatedApp && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setShowCode(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                  <path
                    d="M4.5 4L1 7.5 4.5 11M10.5 4L14 7.5 10.5 11M8.5 2l-2 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                코드 보기
              </button>
            </div>
          )}
        </div>
      </main>

      {showCode && (
        <CodeViewModal
          code={generatedCode}
          fileName={toFileName(project.generatedApp?.appName ?? 'generated-app')}
          appName={project.generatedApp?.appName ?? 'Generated App'}
          onClose={() => setShowCode(false)}
        />
      )}
    </>
  )
}
