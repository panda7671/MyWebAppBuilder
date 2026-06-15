'use client'

import { useParams, useRouter } from 'next/navigation'
import { useProject } from '@/hooks/useProject'
import StepIndicator from '@/components/layout/StepIndicator'
import { Project } from '@/types'
import { getProjectProgress, getResumeHref } from '@/lib/project-progress'

const STEP_LABELS = ['앱 설명', '추가 질문', '기획서', '화면 목록', '와이어프레임', '미리보기']

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

  const progress = getProjectProgress(project)
  const appName = project.plan.appName || project.input.description || '이름 없는 앱'
  const updatedDate = new Date(project.updatedAt).toLocaleDateString('ko-KR')
  const { label: statusLabel, cls: statusCls } = STATUS_CONFIG[project.status]

  const hasDescription = !!project.input.description
  const hasQaAnswers = project.qa.questions.some((q) => q.answer)
  const hasPlan = !!project.plan.appName
  const hasScreens = project.screens.length > 0

  const steps = [
    {
      label: STEP_LABELS[0],
      href: `/projects/${id}/input`,
      done: hasDescription,
      enabled: true,
      disabledReason: '',
    },
    {
      label: STEP_LABELS[1],
      href: `/projects/${id}/questions`,
      done: hasQaAnswers,
      enabled: hasDescription,
      disabledReason: '앱 설명을 먼저 입력해주세요',
    },
    {
      label: STEP_LABELS[2],
      href: `/projects/${id}/plan`,
      done: hasPlan,
      enabled: hasQaAnswers || hasPlan,
      disabledReason: '추가 질문을 먼저 완료해주세요',
    },
    {
      label: STEP_LABELS[3],
      href: `/projects/${id}/screens`,
      done: hasScreens,
      enabled: hasPlan || hasScreens,
      disabledReason: '기획서를 먼저 완료해주세요',
    },
    {
      label: STEP_LABELS[4],
      href: hasScreens
        ? `/projects/${id}/screens/${project.screens[0].id}`
        : `/projects/${id}/screens`,
      done: hasScreens,
      enabled: hasScreens,
      disabledReason: '화면 목록을 먼저 생성해주세요',
    },
    {
      label: STEP_LABELS[5],
      href: `/projects/${id}/preview`,
      done: !!project.generatedApp,
      enabled: hasScreens,
      disabledReason: '화면 목록을 먼저 생성해주세요',
    },
  ]

  const RESUME_LABELS = [
    '앱 설명 작성하기',
    '앱 설명 수정하기',
    '추가 질문 보기',
    '기획서 보기',
    '화면 목록 보기',
    '미리보기 보기',
  ]
  const resumeLabel = RESUME_LABELS[progress] ?? '이어가기'

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
              onClick={() => step.enabled && router.push(step.href)}
              disabled={!step.enabled}
              className={`w-full flex items-center gap-4 px-5 py-3.5 text-left transition-colors ${
                step.enabled ? 'hover:bg-gray-50' : 'cursor-not-allowed'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  step.done
                    ? 'bg-indigo-500'
                    : step.enabled
                      ? 'border-2 border-gray-300'
                      : 'border-2 border-gray-200'
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
              <div className="flex-1 min-w-0">
                <span
                  className={`text-sm font-medium ${
                    step.done ? 'text-gray-700' : step.enabled ? 'text-gray-400' : 'text-gray-300'
                  }`}
                >
                  {step.label}
                </span>
                {!step.enabled && (
                  <p className="text-[10px] text-gray-300 mt-0.5">{step.disabledReason}</p>
                )}
              </div>
              {step.enabled && (
                <svg className="w-4 h-4 text-gray-300 shrink-0" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M6 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
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
