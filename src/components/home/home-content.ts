// 랜딩페이지 카피/데이터 상수 — 한 곳에서 문구를 관리한다.

export interface HowItWorksStep {
  title: string
  description: string
}

export interface AppExample {
  emoji: string
  label: string
  description: string
}

export interface OutputItem {
  emoji: string
  title: string
  description: string
}

export const HERO_CONTENT = {
  title: '아이디어만 적으면, 앱 초안이 완성됩니다.',
  description:
    '코딩 없이 만들고 싶은 앱을 설명해보세요. AI가 추가 질문을 통해 기획을 정리하고, 화면 구성과 모바일 미리보기, 다운로드 가능한 앱 코드까지 만들어줍니다.',
  cta: '내 앱 만들기',
  trustLine: '코딩 없이 · 약 5단계 · 무료로 시작',
} as const

export const HOW_IT_WORKS_STEPS: readonly HowItWorksStep[] = [
  {
    title: '앱 아이디어 입력',
    description: '만들고 싶은 앱을 한두 문장으로 자유롭게 적어요.',
  },
  {
    title: '추가 질문 답변',
    description: 'AI가 필요한 내용을 물어보면 골라서 답하기만 하면 돼요.',
  },
  {
    title: '기획서 자동 생성',
    description: '핵심 기능과 사용자 흐름이 정리된 기획서가 만들어져요.',
  },
  {
    title: '화면 미리보기 확인',
    description: '실제 모바일 화면처럼 구성된 미리보기를 확인해요.',
  },
  {
    title: '코드와 ZIP 다운로드',
    description: '완성된 앱 초안을 코드와 프로젝트 파일로 받아가요.',
  },
]

export const APP_EXAMPLES: readonly AppExample[] = [
  { emoji: '🛍️', label: '중고거래 앱', description: '물건을 올리고 사고파는 거래 앱' },
  { emoji: '📅', label: '예약 앱', description: '날짜와 시간을 골라 예약하는 앱' },
  { emoji: '✅', label: '할 일 앱', description: '해야 할 일을 정리하는 체크리스트 앱' },
  { emoji: '💰', label: '가계부 앱', description: '수입과 지출을 기록하는 가계부 앱' },
  { emoji: '💬', label: '커뮤니티 앱', description: '글을 쓰고 함께 이야기하는 모임 앱' },
  { emoji: '🏃', label: '운동 기록 앱', description: '운동과 기록을 남기는 트래킹 앱' },
]

export const OUTPUT_ITEMS: readonly OutputItem[] = [
  {
    emoji: '📝',
    title: '기획서',
    description: '핵심 기능과 사용자 흐름이 정리된 문서',
  },
  {
    emoji: '🗂️',
    title: '화면 목록',
    description: '앱을 구성하는 화면들의 전체 구성',
  },
  {
    emoji: '📱',
    title: '모바일 미리보기',
    description: '실제 화면처럼 보이는 인터랙티브 미리보기',
  },
  {
    emoji: '⚛️',
    title: 'React TSX 파일',
    description: '화면별로 바로 쓸 수 있는 React 코드',
  },
  {
    emoji: '📦',
    title: 'Next.js ZIP 프로젝트',
    description: '내려받아 실행할 수 있는 전체 프로젝트',
  },
]

export const LIMITATIONS: readonly string[] = [
  '생성된 ZIP은 localStorage 기반의 데모 앱입니다.',
  '실제 DB, 로그인, 결제, 서버 API는 포함되지 않습니다.',
  '실제 서비스 출시용 기능은 이후 개발 단계에서 추가가 필요합니다.',
]
