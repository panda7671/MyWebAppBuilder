'use client'

import { useRouter } from 'next/navigation'
import StepIndicator from './StepIndicator'
import { useProject } from '@/hooks/useProject'
import { getProjectProgress } from '@/lib/project-progress'

interface ProjectPageHeaderProps {
  currentStep: number
  projectId?: string
}

export default function ProjectPageHeader({ currentStep, projectId }: ProjectPageHeaderProps) {
  const router = useRouter()
  const { project } = useProject(projectId ?? '')

  const maxUnlockedStep = project
    ? Math.max(currentStep, getProjectProgress(project) - 1)
    : currentStep

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
      <StepIndicator
        currentStep={currentStep}
        projectId={projectId}
        maxUnlockedStep={maxUnlockedStep}
      />
    </div>
  )
}
