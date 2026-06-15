'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Project } from '@/types'
import { getProjectProgress, getResumeHref, getStageBadge } from '@/lib/project-progress'
import DeleteConfirmModal from './DeleteConfirmModal'

interface ProjectCardProps {
  project: Project
  onDelete: (id: string) => void
  onRename: (id: string, name: string) => void
  onClone: (project: Project) => void
}

export default function ProjectCard({ project, onDelete, onRename, onClone }: ProjectCardProps) {
  const router = useRouter()
  const [isRenaming, setIsRenaming] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const title = project.plan.appName || project.input.description || '이름 없음'
  const date = new Date(project.updatedAt).toLocaleDateString('ko-KR')
  const progress = getProjectProgress(project)
  const { label: stageLabel, cls: stageCls } = getStageBadge(progress)
  const detailHref = `/projects/${project.id}`
  const resumeHref = getResumeHref(project.id, project)
  const previewHref = `/projects/${project.id}/preview`

  function handleCardClick() {
    if (!isRenaming) {
      router.push(detailHref)
    }
  }

  function handleResume(e: React.MouseEvent) {
    e.stopPropagation()
    router.push(resumeHref)
  }

  function handlePreview(e: React.MouseEvent) {
    e.stopPropagation()
    router.push(previewHref)
  }

  function startRename(e: React.MouseEvent) {
    e.stopPropagation()
    setNameInput(title)
    setIsRenaming(true)
  }

  function commitRename() {
    const trimmed = nameInput.trim()
    if (trimmed && trimmed !== title) {
      onRename(project.id, trimmed)
    }
    setIsRenaming(false)
  }

  function handleRenameKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') commitRename()
    if (e.key === 'Escape') setIsRenaming(false)
  }

  function handleClone(e: React.MouseEvent) {
    e.stopPropagation()
    onClone(project)
  }

  function handleDeleteClick(e: React.MouseEvent) {
    e.stopPropagation()
    setShowDeleteModal(true)
  }

  function handleDeleteConfirm() {
    setShowDeleteModal(false)
    onDelete(project.id)
  }

  return (
    <>
      <div
        onClick={handleCardClick}
        className="flex flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="flex-1 min-w-0 mb-3">
          {isRenaming ? (
            <input
              autoFocus
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={commitRename}
              onKeyDown={handleRenameKeyDown}
              onClick={(e) => e.stopPropagation()}
              className="w-full text-sm font-medium text-gray-900 border border-indigo-300 rounded px-2 py-0.5 outline-none focus:ring-1 focus:ring-indigo-400 mb-1"
            />
          ) : (
            <p className="font-medium text-gray-900 truncate text-sm mb-1">{title}</p>
          )}
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${stageCls}`}
            >
              {stageLabel}
            </span>
            <span className="text-[10px] text-gray-400">{date}</span>
          </div>
        </div>

        <div
          className="flex flex-col gap-2 pt-2 border-t border-gray-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 빠른 이동 버튼 */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleResume}
              className="flex-1 flex items-center justify-center gap-1 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md py-1.5 transition-colors"
            >
              <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
                <path d="M3 2l7 4-7 4V2z" />
              </svg>
              이어가기
            </button>
            {project.generatedApp && (
              <button
                onClick={handlePreview}
                className="flex-1 flex items-center justify-center gap-1 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md py-1.5 transition-colors"
              >
                <svg
                  className="w-3 h-3"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M1 6s2-3.5 5-3.5S11 6 11 6s-2 3.5-5 3.5S1 6 1 6z" />
                  <circle cx="6" cy="6" r="1.5" />
                </svg>
                미리보기
              </button>
            )}
          </div>

          {/* 관리 버튼 */}
          <div className="flex items-center gap-1">
            <button
              onClick={startRename}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-indigo-500 px-2 py-1 rounded hover:bg-gray-50 transition-colors"
            >
              <svg
                className="w-3 h-3"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M11.5 2.5l2 2-8 8H3.5v-2l8-8z" strokeLinejoin="round" />
              </svg>
              이름수정
            </button>
            <button
              onClick={handleClone}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-indigo-500 px-2 py-1 rounded hover:bg-gray-50 transition-colors"
            >
              <svg
                className="w-3 h-3"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="5" y="5" width="8" height="8" rx="1.5" />
                <path d="M11 5V4a1 1 0 00-1-1H4a1 1 0 00-1 1v6a1 1 0 001 1h1" />
              </svg>
              복제
            </button>
            <button
              onClick={handleDeleteClick}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 px-2 py-1 rounded hover:bg-gray-50 transition-colors ml-auto"
            >
              <svg
                className="w-3 h-3"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M3 5h10M6 5V3h4v2M7 8v4M9 8v4" strokeLinecap="round" />
                <rect x="4" y="5" width="8" height="8" rx="1" />
              </svg>
              삭제
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <DeleteConfirmModal
          projectName={title}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </>
  )
}
