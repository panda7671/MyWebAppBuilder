'use client'

import { useRouter } from 'next/navigation'
import StepIndicator from './StepIndicator'

interface ProjectPageHeaderProps {
  currentStep: number
}

export default function ProjectPageHeader({ currentStep }: ProjectPageHeaderProps) {
  const router = useRouter()

  return (
    <div className="w-full">
      <button
        onClick={() => router.push('/')}
        className="mb-3 text-sm text-gray-400 hover:text-gray-600 transition-colors"
      >
        ← 홈으로
      </button>
      <StepIndicator currentStep={currentStep} />
    </div>
  )
}
