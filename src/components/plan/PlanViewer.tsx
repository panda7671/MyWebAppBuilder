'use client'

import { useState } from 'react'
import { AppPlan } from '@/types'

const TECH_DESCRIPTIONS: Record<string, { role: string; useCase: string }> = {
  React: {
    role: '웹 화면 구성 라이브러리',
    useCase: '버튼, 목록, 폼 등 화면 요소를 재사용 가능하게 만들 때 사용',
  },
  'React.js': {
    role: '웹 화면 구성 라이브러리',
    useCase: '버튼, 목록, 폼 등 화면 요소를 재사용 가능하게 만들 때 사용',
  },
  'React Native': {
    role: '모바일 앱 개발 프레임워크',
    useCase: '하나의 코드로 iPhone과 Android 앱을 동시에 만들 때 사용',
  },
  'Node.js': {
    role: '서버(백엔드) 실행 환경',
    useCase: '사용자 인증, 데이터 저장, API 처리 등 서버 기능을 만들 때 사용',
  },
  'Next.js': {
    role: 'React 기반 웹 개발 프레임워크',
    useCase: '검색엔진에 잘 노출되고 빠른 웹사이트를 만들 때 사용',
  },
  TypeScript: {
    role: '타입 안전성을 갖춘 JavaScript',
    useCase: '코드 오류를 미리 잡아주어 안정적인 앱 개발에 사용',
  },
  JavaScript: {
    role: '웹 기본 프로그래밍 언어',
    useCase: '웹 페이지에 클릭 반응, 애니메이션 등 동적 기능을 추가할 때 사용',
  },
  Python: {
    role: '범용 프로그래밍 언어',
    useCase: '서버 개발, 데이터 분석, AI 모델 구축에 폭넓게 사용',
  },
  FastAPI: {
    role: 'Python 기반 API 서버 프레임워크',
    useCase: '빠르고 가벼운 REST API를 만들 때 사용',
  },
  Django: {
    role: 'Python 기반 웹 프레임워크',
    useCase: '관리자 페이지, 데이터베이스 연동 웹사이트를 빠르게 개발할 때 사용',
  },
  PostgreSQL: {
    role: '관계형 데이터베이스',
    useCase: '회원 정보, 게시글 등 구조화된 데이터를 저장·관리할 때 사용',
  },
  MySQL: {
    role: '관계형 데이터베이스',
    useCase: '표 형태로 데이터를 체계적으로 저장·검색할 때 사용',
  },
  MongoDB: {
    role: '문서형 데이터베이스',
    useCase: '형태가 다양한 JSON 형식의 데이터를 유연하게 저장할 때 사용',
  },
  SQLite: {
    role: '경량 파일 기반 데이터베이스',
    useCase: '별도 서버 없이 앱 안에 작은 데이터베이스가 필요할 때 사용',
  },
  Redis: {
    role: '고속 메모리 데이터 저장소',
    useCase: '로그인 세션 유지, 자주 쓰는 데이터 캐싱 등 빠른 임시 저장에 사용',
  },
  Docker: {
    role: '앱 배포용 컨테이너 플랫폼',
    useCase: '개발 환경을 패키징해 어디서나 동일하게 실행할 수 있게 해줌',
  },
  AWS: {
    role: '클라우드 서버 서비스 (Amazon)',
    useCase: '앱을 인터넷에 올리고 서버·스토리지를 빌려 쓸 때 사용',
  },
  GCP: {
    role: '클라우드 서버 서비스 (Google)',
    useCase: 'Google 인프라를 활용해 앱을 배포하고 운영할 때 사용',
  },
  Azure: {
    role: '클라우드 서버 서비스 (Microsoft)',
    useCase: 'Microsoft 인프라를 활용해 앱을 배포하고 운영할 때 사용',
  },
  Firebase: {
    role: 'Google 앱 개발 플랫폼',
    useCase: '로그인, 실시간 DB, 파일 저장 등을 빠르게 구현할 때 사용',
  },
  Supabase: {
    role: '오픈소스 백엔드 플랫폼',
    useCase: 'DB·인증·스토리지를 한번에 제공해 서버 없이 앱 기능을 구현할 때 사용',
  },
  'Tailwind CSS': {
    role: 'CSS 유틸리티 프레임워크',
    useCase: '클래스 이름만으로 색상, 크기, 배치 등 디자인을 빠르게 적용할 때 사용',
  },
  CSS: {
    role: '웹 디자인 언어',
    useCase: '웹 페이지의 색상, 폰트, 레이아웃 등 외관을 꾸밀 때 사용',
  },
  HTML: {
    role: '웹 페이지 구조 언어',
    useCase: '제목, 본문, 버튼 등 웹 페이지의 뼈대를 만들 때 사용',
  },
  GraphQL: {
    role: 'API 데이터 조회 언어',
    useCase: '필요한 데이터만 정확히 요청하는 유연한 API를 만들 때 사용',
  },
  'REST API': {
    role: '표준 웹 API 방식',
    useCase: '앱의 프론트엔드와 백엔드가 데이터를 주고받는 규칙을 정할 때 사용',
  },
  'Vue.js': {
    role: '웹 화면 구성 프레임워크',
    useCase: '직관적인 문법으로 동적인 웹 화면을 빠르게 만들 때 사용',
  },
  Angular: {
    role: '대규모 웹 앱 프레임워크',
    useCase: '복잡한 기업용 웹 애플리케이션을 체계적으로 개발할 때 사용',
  },
  Flutter: {
    role: 'Google 크로스플랫폼 앱 프레임워크',
    useCase: '하나의 코드로 iOS, Android, 웹 앱을 동시에 만들 때 사용',
  },
  Swift: { role: 'Apple 전용 앱 개발 언어', useCase: 'iPhone, iPad, Mac 전용 앱을 개발할 때 사용' },
  SwiftUI: {
    role: 'Apple UI 프레임워크',
    useCase: 'iPhone/iPad 앱 화면을 선언형으로 빠르게 만들 때 사용',
  },
  Kotlin: { role: 'Android 앱 개발 언어', useCase: 'Android 스마트폰 앱을 개발할 때 사용' },
  Java: {
    role: '범용 프로그래밍 언어',
    useCase: 'Android 앱, 서버 백엔드, 대규모 기업 시스템 개발에 사용',
  },
  'Express.js': {
    role: 'Node.js 웹 서버 프레임워크',
    useCase: '빠르고 간단한 REST API 서버를 만들 때 사용',
  },
  'Spring Boot': {
    role: 'Java 기반 서버 프레임워크',
    useCase: '안정적인 기업용 서버 애플리케이션을 빠르게 개발할 때 사용',
  },
}

interface PlanViewerProps {
  plan: AppPlan
  onChange: (plan: AppPlan) => void
  onEditStart?: () => void
  onEditCancel?: () => void
}

export default function PlanViewer({ plan, onChange, onEditStart, onEditCancel }: PlanViewerProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<AppPlan>(plan)

  function handleEdit() {
    setDraft(plan)
    setEditing(true)
    onEditStart?.()
  }

  function handleSave() {
    const changed = JSON.stringify(draft) !== JSON.stringify(plan)
    if (changed) {
      onChange(draft)
    } else {
      onEditCancel?.()
    }
    setEditing(false)
  }

  function handleCancel() {
    setEditing(false)
    onEditCancel?.()
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
        <Field label="개발에 사용할 기술">
          <div className="flex flex-wrap gap-2 rounded-lg border border-dashed border-gray-200 bg-gray-50 p-3 min-h-[48px]">
            {draft.techStack.map((t) => (
              <span key={t} className="px-2.5 py-1 rounded-full bg-gray-200 text-xs text-gray-500">
                {t}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            기술 스택은 AI가 자동으로 선정하며 직접 수정할 수 없어요.
          </p>
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
        <p className="text-xs text-gray-400 mb-2">기술 위에 마우스를 올리면 설명을 볼 수 있어요.</p>
        <div className="flex flex-wrap gap-2">
          {plan.techStack.map((t) => (
            <TechBadge key={t} tech={t} appDescription={plan.techDescriptions?.[t]} />
          ))}
        </div>
      </div>
    </div>
  )
}

function TechBadge({ tech, appDescription }: { tech: string; appDescription?: string }) {
  const generic = TECH_DESCRIPTIONS[tech]
  const roleLabel = generic?.role ?? tech
  const useCaseLabel = appDescription ?? generic?.useCase ?? '앱 개발에 활용되는 기술이에요.'

  return (
    <div className="relative group">
      <span className="px-2.5 py-1 rounded-full bg-gray-100 text-xs text-gray-600 cursor-default select-none">
        {tech}
      </span>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-56 rounded-lg bg-gray-800 text-white text-xs p-3 z-20 shadow-xl pointer-events-none">
        <p className="font-semibold text-white mb-1">{roleLabel}</p>
        <p className="text-gray-300 leading-relaxed">{useCaseLabel}</p>
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
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
