'use client'

import { useParams, useRouter } from 'next/navigation'
import { useProject } from '@/hooks/useProject'
import StepIndicator from '@/components/layout/StepIndicator'
import { Project } from '@/types'

function getProgress(project: Project): number {
  if (project.screens.length > 0) return 4
  if (project.plan.appName) return 3
  if (project.qa.questions.some((q) => q.answer)) return 2
  if (project.input.description) return 1
  return 0
}

function getResumeHref(id: string, project: Project): string {
  const step = getProgress(project)
  if (step === 4 && project.screens.length > 0) {
    return `/projects/${id}/screens/${project.screens[0].id}`
  }
  const hrefs = [
    `/projects/${id}/input`,
    `/projects/${id}/questions`,
    `/projects/${id}/plan`,
    `/projects/${id}/screens`,
    `/projects/${id}/screens`,
  ]
  return hrefs[step]
}

const STEP_LABELS = ['앱 설명', '추가 질문', '기획서', '화면 목록', '와이어프레임']

const STATUS_CONFIG: Record<Project['status'], { label: string; cls: string }> = {
  draft: { label: '초안', cls: 'bg-gray-100 text-gray-500' },
  planned: { label: '기획 완료', cls: 'bg-indigo-100 text-indigo-600' },
  complete: { label: '완료', cls: 'bg-green-100 text-green-600' },
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { project, loading } = useProject(id)

  if (loading) {
    return (
      <main className="flex flex-1 flex-col items-center px-4 py-12">
        <div className="w-full max-w-lg space-y-4 animate-pulse">
          <div className="flex items-start justify-between">
            <div className="h-8 bg-gray-200 rounded-lg w-40" />
            <div className="h-6 bg-gray-100 rounded-full w-20" />
          </div>
          <div className="h-3 bg-gray-100 rounded w-28" />
          <div className="h-10 bg-gray-100 rounded-xl mt-4" />
          <div className="rounded-xl border border-gray-200 overflow-hidden mt-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-14 bg-gray-50 flex items-center px-5 gap-3 border-b border-gray-100 last:border-0"
              >
                <div className="w-6 h-6 rounded-full bg-gray-200" />
                <div className="h-3 bg-gray-200 rounded w-24" />
              </div>
            ))}
          </div>
        </div>
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

  const progress = getProgress(project)
  const appName = project.plan.appName || project.input.description || '이름 없는 앱'
  const updatedDate = new Date(project.updatedAt).toLocaleDateString('ko-KR')
  const { label: statusLabel, cls: statusCls } = STATUS_CONFIG[project.status]

  const steps = [
    { label: STEP_LABELS[0], href: `/projects/${id}/input`, done: !!project.input.description },
    {
      label: STEP_LABELS[1],
      href: `/projects/${id}/questions`,
      done: project.qa.questions.some((q) => q.answer),
    },
    { label: STEP_LABELS[2], href: `/projects/${id}/plan`, done: !!project.plan.appName },
    { label: STEP_LABELS[3], href: `/projects/${id}/screens`, done: project.screens.length > 0 },
    {
      label: STEP_LABELS[4],
      href:
        project.screens.length > 0
          ? `/projects/${id}/screens/${project.screens[0].id}`
          : `/projects/${id}/screens`,
      done: false,
    },
  ]

  const resumeLabel = progress >= 4 ? '와이어프레임 보기' : `${STEP_LABELS[progress]} 계속하기`

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-6">
          <div className="flex items-start justify-between mb-1.5">
            <h1 className="text-2xl font-bold text-gray-900 truncate pr-3">{appName}</h1>
            <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${statusCls}`}>
              {statusLabel}
            </span>
          </div>
          <p className="text-xs text-gray-400">마지막 수정: {updatedDate}</p>
        </div>

        <div className="mb-6">
          <StepIndicator currentStep={progress} />
        </div>

        <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100 mb-4">
          {steps.map((step, i) => (
            <button
              key={i}
              onClick={() => router.push(step.href)}
              className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors text-left"
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  step.done ? 'bg-indigo-500' : 'border-2 border-gray-300'
                }`}
              >
                {step.done && (
                  <svg className="w-3 h-3 text-white" viewBox="0 0 12 10" fill="none">
                    <path
                      d="M1 5l3.5 3.5L11 1"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <span
                className={`flex-1 text-sm font-medium ${step.done ? 'text-gray-700' : 'text-gray-400'}`}
              >
                {step.label}
              </span>
              <svg className="w-4 h-4 text-gray-300 shrink-0" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ))}
        </div>

        {project.plan.appName && (
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-5 mb-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">핵심 기능</p>
              <p className="text-lg font-bold text-gray-900">
                {project.plan.coreFeatures.length}개
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">화면 수</p>
              <p className="text-lg font-bold text-gray-900">{project.screens.length}개</p>
            </div>
          </div>
        )}

        <button
          onClick={() => router.push(getResumeHref(id, project))}
          className="w-full flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors mb-4"
        >
          {resumeLabel} →
        </button>

        <button
          onClick={() => router.push('/')}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← 홈으로
        </button>
      </div>
    </main>
  )
}
