'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useProject } from '@/hooks/useProject'
import { generateQuestionsAI } from '@/lib/ai-service'
import StepIndicator from '@/components/layout/StepIndicator'

export default function QuestionsPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { project, loading, updateProject } = useProject(id)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showError, setShowError] = useState(false)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    if (!project) return

    if (project.qa.questions.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGenerating(true)
      generateQuestionsAI(project.input.description)
        .then((questions) => {
          updateProject((p) => ({ ...p, qa: { questions } }))
        })
        .finally(() => setGenerating(false))
    } else {
      const initial: Record<string, string> = {}
      project.qa.questions.forEach((q) => {
        initial[q.id] = q.answer
      })
      setAnswers(initial)
    }
  }, [project?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleAnswerChange(qId: string, value: string) {
    setShowError(false)
    setAnswers((prev) => ({ ...prev, [qId]: value }))
  }

  function handleDone() {
    const unanswered = project!.qa.questions.filter((q) => !answers[q.id]?.trim())
    if (unanswered.length > 0) {
      setShowError(true)
      return
    }
    updateProject((p) => ({
      ...p,
      status: 'planned',
      qa: {
        questions: p.qa.questions.map((q) => ({
          ...q,
          answer: answers[q.id] ?? '',
        })),
      },
    }))
    router.push(`/projects/${id}/plan`)
  }

  if (loading || generating) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-gray-400 text-sm animate-pulse">질문을 생성하는 중…</p>
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

  const questions = project.qa.questions

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-12">
      <div className="w-full max-w-lg">
        <StepIndicator currentStep={1} />

        <h1 className="text-2xl font-bold text-gray-900 mb-2">조금 더 알려주세요</h1>
        <p className="text-gray-500 mb-8 text-sm">
          질문에 많이 답할수록 내 앱과 더 잘 맞는 기획서가 나와요.
        </p>

        {showError && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            모든 질문에 답해주세요. 빈칸이 있으면 기획서를 만들 수 없어요.
          </div>
        )}

        <ol className="space-y-6">
          {questions.map((q, i) => {
            const isEmpty = showError && !answers[q.id]?.trim()
            return (
              <li key={q.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <span className="text-indigo-600 font-semibold mr-1">{i + 1}.</span>
                  {q.text}
                </label>
                <input
                  type="text"
                  value={answers[q.id] ?? ''}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  placeholder={q.placeholder ?? '답변을 입력해주세요'}
                  className={[
                    'w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-colors',
                    isEmpty
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-gray-300 focus:ring-indigo-500',
                  ].join(' ')}
                />
              </li>
            )
          })}
        </ol>

        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={() => router.push(`/projects/${id}/input`)}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← 이전
          </button>
          <button
            onClick={handleDone}
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            기획서 만들기 →
          </button>
        </div>
      </div>
    </main>
  )
}
