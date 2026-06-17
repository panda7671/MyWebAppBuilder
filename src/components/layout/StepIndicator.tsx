'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

const STEPS = ['아이디어', '추가 질문', '기획서', '화면 목록', '미리보기']
const STEP_ROUTES = ['input', 'questions', 'plan', 'screens', 'preview']

interface StepIndicatorProps {
  currentStep: number // 0-based
  projectId?: string
  maxUnlockedStep?: number
}

export default function StepIndicator({
  currentStep,
  projectId,
  maxUnlockedStep,
}: StepIndicatorProps) {
  const router = useRouter()
  const [showWarning, setShowWarning] = useState(false)

  const unlocked = maxUnlockedStep ?? currentStep

  function handleStepClick(i: number) {
    if (!projectId || i === currentStep) return
    if (i > unlocked) {
      setShowWarning(true)
      setTimeout(() => setShowWarning(false), 2500)
      return
    }
    router.push(`/projects/${projectId}/${STEP_ROUTES[i]}`)
  }

  return (
    <div className="mb-10">
      <ol className="flex items-center gap-0 w-full max-w-lg mx-auto">
        {STEPS.map((label, i) => {
          const isDone = i < currentStep
          const isActive = i === currentStep
          const isNavigable = !!projectId && i !== currentStep && i <= unlocked
          const isLocked = !!projectId && i > unlocked

          return (
            <li key={label} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleStepClick(i)}
                  disabled={!projectId || isActive}
                  className={[
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors',
                    isDone
                      ? `bg-indigo-600 border-indigo-600 text-white${isNavigable ? ' hover:bg-indigo-700 cursor-pointer' : ' cursor-default'}`
                      : isActive
                        ? 'border-indigo-600 text-indigo-600 bg-white cursor-default'
                        : isNavigable
                          ? 'border-indigo-300 text-indigo-400 bg-white hover:border-indigo-500 cursor-pointer'
                          : 'border-gray-300 text-gray-300 bg-white cursor-not-allowed',
                  ].join(' ')}
                >
                  {isDone ? '✓' : i + 1}
                </button>
                <span
                  className={[
                    'mt-1 text-[10px] whitespace-nowrap',
                    isActive
                      ? 'text-indigo-600 font-medium'
                      : isLocked
                        ? 'text-gray-300'
                        : isDone
                          ? 'text-gray-500'
                          : 'text-gray-400',
                  ].join(' ')}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={[
                    'flex-1 h-0.5 mb-4 mx-1',
                    isDone ? 'bg-indigo-600' : 'bg-gray-200',
                  ].join(' ')}
                />
              )}
            </li>
          )
        })}
      </ol>

      {showWarning && (
        <p className="text-center text-xs text-amber-600 mt-2">
          아직 완료되지 않은 단계예요. 이전 단계를 먼저 완료해주세요.
        </p>
      )}
    </div>
  )
}
