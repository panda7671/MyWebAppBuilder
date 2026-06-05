'use client'

import { useState } from 'react'
import { AppPlan } from '@/types'

interface PlanViewerProps {
  plan: AppPlan
  onChange: (plan: AppPlan) => void
}

export default function PlanViewer({ plan, onChange }: PlanViewerProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<AppPlan>(plan)

  function handleEdit() {
    setDraft(plan)
    setEditing(true)
  }

  function handleSave() {
    onChange(draft)
    setEditing(false)
  }

  function handleCancel() {
    setEditing(false)
  }

  function setDraftField<K extends keyof AppPlan>(key: K, value: AppPlan[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  if (editing) {
    return (
      <div className="rounded-xl border border-indigo-200 bg-white p-6 space-y-5">
        <Field label="앱 이름">
          <input
            className={inputCls}
            value={draft.appName}
            onChange={(e) => setDraftField('appName', e.target.value)}
          />
        </Field>
        <Field label="앱 목적">
          <textarea
            className={`${inputCls} resize-none`}
            rows={2}
            value={draft.purpose}
            onChange={(e) => setDraftField('purpose', e.target.value)}
          />
        </Field>
        <Field label="주요 사용자">
          <input
            className={inputCls}
            value={draft.targetUser}
            onChange={(e) => setDraftField('targetUser', e.target.value)}
          />
        </Field>
        <Field label="핵심 기능 (한 줄에 하나씩)">
          <textarea
            className={`${inputCls} resize-none`}
            rows={4}
            value={draft.coreFeatures.join('\n')}
            onChange={(e) =>
              setDraftField(
                'coreFeatures',
                e.target.value.split('\n').filter((l) => l.trim())
              )
            }
          />
        </Field>
        <Field label="개발에 사용할 기술 (한 줄에 하나씩)">
          <textarea
            className={`${inputCls} resize-none`}
            rows={3}
            value={draft.techStack.join('\n')}
            onChange={(e) =>
              setDraftField(
                'techStack',
                e.target.value.split('\n').filter((l) => l.trim())
              )
            }
          />
        </Field>
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            저장
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-5">
      <div className="flex items-start justify-between">
        <h2 className="text-xl font-bold text-gray-900">{plan.appName}</h2>
        <button
          onClick={handleEdit}
          className="text-sm text-indigo-500 hover:text-indigo-700 transition-colors"
        >
          수정
        </button>
      </div>

      <PlanRow label="목적" value={plan.purpose} />
      <PlanRow label="주요 사용자" value={plan.targetUser} />

      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
          핵심 기능
        </p>
        <ul className="space-y-1">
          {plan.coreFeatures.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
          개발에 사용할 기술
        </p>
        <p className="text-xs text-gray-400 mb-2">앱 개발 시 활용되는 기술이에요.</p>
        <div className="flex flex-wrap gap-2">
          {plan.techStack.map((t) => (
            <span key={t} className="px-2.5 py-1 rounded-full bg-gray-100 text-xs text-gray-600">
              {t}
            </span>
          ))}
        </div>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputCls =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500'
