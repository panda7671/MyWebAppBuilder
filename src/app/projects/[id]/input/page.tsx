'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useProject } from '@/hooks/useProject'
import ProjectPageHeader from '@/components/layout/ProjectPageHeader'

export default function InputPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { project, loading, updateProject } = useProject(id)
  const [description, setDescription] = useState('')

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (project) setDescription(project.input.description)
  }, [project?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleNext() {
    if (!description.trim()) return
    updateProject((p) => ({ ...p, input: { description: description.trim() } }))
    router.push(`/projects/${id}/questions`)
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
        <ProjectPageHeader currentStep={0} />

        <h1 className="text-2xl font-bold text-gray-900 mb-2">어떤 앱을 만들고 싶나요?</h1>
        <p className="text-gray-500 mb-6 text-sm">
          만들고 싶은 앱을 자유롭게 설명해주세요. 아이디어가 구체적일수록 좋습니다.
        </p>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="예: 우리 동네 주민들이 중고 물건을 사고팔 수 있는 앱을 만들고 싶어요. 사진을 올리고 채팅으로 거래할 수 있으면 좋겠어요."
          rows={6}
          className="w-full rounded-lg border border-gray-300 p-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleNext}
            disabled={!description.trim()}
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            다음 →
          </button>
        </div>
      </div>
    </main>
  )
}
