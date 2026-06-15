'use client'

import { useRouter } from 'next/navigation'
import StepIndicator from './StepIndicator'

interface ProjectPageHeaderProps {
  currentStep: number
  projectId?: string
}

export default function ProjectPageHeader({ currentStep, projectId }: ProjectPageHeaderProps) {
  const router = useRouter()

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-3">
        {projectId && (
          <button
            onClick={() => router.push(`/projects/${projectId}`)}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← 프로젝트
          </button>
        )}
        <button
          onClick={() => router.push('/')}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          {projectId ? '홈으로' : '← 홈으로'}
        </button>
      </div>
      <StepIndicator currentStep={currentStep} />
    </div>
  )
}
