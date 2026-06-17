'use client'

import { useState } from 'react'
import { AppPlan } from '@/types'

interface Props {
  currentPlan: AppPlan
  candidates: AppPlan[]
  hasDownstream: boolean
  onKeepCurrent: () => void
  onSelectCandidate: (plan: AppPlan) => void
}

export default function PlanVersionComparison({
  currentPlan,
  candidates,
  hasDownstream,
  onKeepCurrent,
  onSelectCandidate,
}: Props) {
  const allVersions: AppPlan[] = [currentPlan, ...candidates]
  const [activeTab, setActiveTab] = useState(0)
  const [confirmingIndex, setConfirmingIndex] = useState<number | null>(null)

  function handleSelectClick(index: number) {
    if (index === 0) {
      onKeepCurrent()
      return
    }
    if (hasDownstream) {
      setConfirmingIndex(index)
    } else {
      onSelectCandidate(allVersions[index])
    }
  }

  function handleConfirm() {
    if (confirmingIndex !== null) {
      onSelectCandidate(allVersions[confirmingIndex])
      setConfirmingIndex(null)
    }
  }

  const plan = allVersions[activeTab]

  return (
    <div className="rounded-xl border border-indigo-200 bg-white overflow-hidden">
      <div className="flex border-b border-gray-200 bg-gray-50">
        {allVersions.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setActiveTab(i)
              setConfirmingIndex(null)
            }}
            className={`flex-1 px-3 py-3 text-sm font-medium transition-colors ${
              activeTab === i
                ? 'bg-white text-indigo-600 border-b-2 border-indigo-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            버전 {i + 1}
            {i === 0 && <span className="ml-1 text-xs text-gray-400">(현재)</span>}
          </button>
        ))}
      </div>

      <div className="p-6 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">{plan.appName}</h2>

        <PlanRow label="목적" value={plan.purpose} />
        <PlanRow label="주요 사용자" value={plan.targetUser} />

        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            핵심 기능
          </p>
          <ul className="space-y-1">
            {plan.coreFeatures.map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            기술 스택
          </p>
          <div className="flex flex-wrap gap-2">
            {plan.techStack.map((t, i) => (
              <span key={i} className="px-2.5 py-1 rounded-full bg-gray-100 text-xs text-gray-600">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {confirmingIndex !== null && (
        <div className="mx-6 mb-4 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
          <p>이 버전을 선택하면 기존 화면 목록과 미리보기가 삭제됩니다. 계속할까요?</p>
          <div className="mt-2 flex gap-3">
            <button onClick={handleConfirm} className="font-medium underline hover:no-underline">
              선택
            </button>
            <button
              onClick={() => setConfirmingIndex(null)}
              className="text-amber-600 hover:text-amber-800"
            >
              취소
            </button>
          </div>
        </div>
      )}

      <div className="px-6 pb-6 flex justify-between items-center">
        <button
          onClick={onKeepCurrent}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          비교 닫기
        </button>
        {activeTab === 0 ? (
          <button
            onClick={onKeepCurrent}
            className="px-4 py-2 rounded-lg bg-gray-100 text-sm font-medium text-gray-500 hover:bg-gray-200 transition-colors"
          >
            현재 버전 유지
          </button>
        ) : (
          <button
            onClick={() => handleSelectClick(activeTab)}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            이 버전 사용하기
          </button>
        )}
      </div>
    </div>
  )
}

function PlanRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm text-gray-700">{value}</p>
    </div>
  )
}
