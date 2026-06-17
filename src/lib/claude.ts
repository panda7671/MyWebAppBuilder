import 'server-only'
import Anthropic from '@anthropic-ai/sdk'
import { AppPlan, Question, Screen, QASession, UIComponentType, UISchema } from '@/types'
import type { UISection, ThemeStyle } from '@/types/ui-schema'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const MODEL = 'claude-haiku-4-5-20251001'

function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenced) return fenced[1].trim()
  const start = text.search(/[\[{]/)
  if (start !== -1) return text.slice(start)
  return text.trim()
}

export async function claudeGenerateQuestions(description: string): Promise<Question[]> {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system:
      '당신은 앱 기획 전문가입니다. 사용자 입력을 보고 기획에 필요한 질문을 JSON 배열로만 반환하세요. 다른 텍스트 없이 JSON만 출력하세요.',
    messages: [
      {
        role: 'user',
        content: `앱 설명: "${description}"

다음 5개 질문을 JSON 배열로 생성하세요:
- q1: 타겟 유저 (누가 사용?)
- q2: 핵심 기능 (가장 중요한 기능?)
- q3: 메인 화면 (처음에 무엇을 보여줄까?)
- q4: 주요 행동 (사용자가 앱에서 가장 자주 할 행동?)
- q5: 앱 분위기 (톤앤매너?)

형식:
[
  {"id":"q1","text":"질문 내용","answer":"","placeholder":"예: 예시 답변"},
  {"id":"q2","text":"질문 내용","answer":"","placeholder":"예: 예시 답변"},
  {"id":"q3","text":"질문 내용","answer":"","placeholder":"예: 예시 답변"},
  {"id":"q4","text":"질문 내용","answer":"","placeholder":"예: 물건 올리기, 예약하기, 기록 추가하기, 채팅하기"},
  {"id":"q5","text":"질문 내용","answer":"","placeholder":"예: 심플하고 깔끔한"}
]`,
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  const parsed = JSON.parse(extractJson(text)) as unknown[]

  return parsed.map((q, i) => {
    const item = q as Record<string, unknown>
    return {
      id: typeof item.id === 'string' ? item.id : `q${i + 1}`,
      text: typeof item.text === 'string' ? item.text : '',
      answer: '',
      placeholder: typeof item.placeholder === 'string' ? item.placeholder : undefined,
    }
  })
}

export async function claudeGeneratePlan(description: string, qa: QASession): Promise<AppPlan> {
  const qaText = qa.questions.map((q) => `Q: ${q.text}\nA: ${q.answer}`).join('\n\n')

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system:
      '당신은 앱 기획 전문가입니다. 입력을 보고 앱 기획서를 JSON 객체로만 반환하세요. 다른 텍스트 없이 JSON만 출력하세요.',
    messages: [
      {
        role: 'user',
        content: `앱 설명: "${description}"

Q&A:
${qaText}

다음 형식의 JSON 기획서를 생성하세요:
{
  "appName": "앱 이름 (한국어 2-6자)",
  "purpose": "앱의 목적과 핵심 가치 (1-2문장)",
  "targetUser": "주요 타겟 유저",
  "coreFeatures": ["기능1", "기능2", "기능3", "기능4", "기능5"],
  "techStack": ["기술1", "기술2", "기술3"],
  "techDescriptions": {
    "기술1": "이 앱의 어떤 핵심 기능 구현에 사용되는지 한 줄로 (예: 로그인·회원가입, 채팅 화면 구현에 사용)",
    "기술2": "이 앱의 어떤 핵심 기능 구현에 사용되는지 한 줄로",
    "기술3": "이 앱의 어떤 핵심 기능 구현에 사용되는지 한 줄로"
  }
}`,
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  const parsed = JSON.parse(extractJson(text)) as Record<string, unknown>

  const techDescriptions: Record<string, string> = {}
  if (typeof parsed.techDescriptions === 'object' && parsed.techDescriptions !== null) {
    for (const [k, v] of Object.entries(parsed.techDescriptions)) {
      if (typeof v === 'string') techDescriptions[k] = v
    }
  }

  return {
    appName: typeof parsed.appName === 'string' ? parsed.appName : '나만의 앱',
    purpose: typeof parsed.purpose === 'string' ? parsed.purpose : description,
    targetUser: typeof parsed.targetUser === 'string' ? parsed.targetUser : '일반 사용자',
    coreFeatures: Array.isArray(parsed.coreFeatures)
      ? (parsed.coreFeatures as unknown[]).filter((f): f is string => typeof f === 'string')
      : [],
    techStack: Array.isArray(parsed.techStack)
      ? (parsed.techStack as unknown[]).filter((t): t is string => typeof t === 'string')
      : [],
    techDescriptions: Object.keys(techDescriptions).length > 0 ? techDescriptions : undefined,
  }
}

const SECTION_TYPE_ALIASES: Record<string, UISection['type']> = {
  hero: 'Hero',
  cardgrid: 'CardGrid',
  card_grid: 'CardGrid',
  'card-grid': 'CardGrid',
  form: 'Form',
  list: 'List',
  detail: 'Detail',
  chat: 'Chat',
}

const VALID_APP_SECTION_TYPES = new Set<UISection['type']>([
  'Hero',
  'CardGrid',
  'Form',
  'List',
  'Detail',
  'Chat',
])

function normalizeSectionType(raw: unknown): UISection['type'] | null {
  if (typeof raw !== 'string') return null
  if (VALID_APP_SECTION_TYPES.has(raw as UISection['type'])) return raw as UISection['type']
  const lower = raw.toLowerCase().replace(/\s/g, '')
  return SECTION_TYPE_ALIASES[lower] ?? null
}

export async function claudeGenerateApp(plan: AppPlan, screens: Screen[]): Promise<UISchema> {
  const screenNames = screens.map((s) => s.name).join(', ')

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    system:
      '당신은 앱 UI 전문가입니다. 기획서를 보고 UISchema JSON만 반환하세요. 코드나 다른 텍스트 없이 순수 JSON만 출력하세요.',
    messages: [
      {
        role: 'user',
        content: `앱 이름: "${plan.appName}"
목적: "${plan.purpose}"
타겟 유저: "${plan.targetUser}"
핵심 기능: ${plan.coreFeatures.join(', ')}
화면: ${screenNames || '없음'}

아래 JSON UISchema를 생성하세요. sections의 type은 반드시 Hero, CardGrid, Form, List, Detail, Chat 중 하나여야 합니다:

{
  "appName": "앱이름",
  "theme": {"primaryColor": "#4F46E5", "style": "minimal"},
  "sections": [
    {"type": "Hero", "title": "환영합니다", "subtitle": "앱 설명", "ctaText": "시작하기"},
    {"type": "CardGrid", "title": "핵심 기능", "cards": [{"title": "기능명", "description": "설명", "badge": "추천"}]},
    {"type": "List", "title": "최근 항목", "items": [{"title": "항목", "subtitle": "부제목", "meta": "시간", "badge": "NEW"}]},
    {"type": "Form", "title": "시작하기", "fields": [{"label": "이름", "type": "text", "placeholder": "입력", "required": true}], "submitText": "제출"}
  ]
}`,
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  // JSON.parse errors propagate to route.ts which falls back to mock
  const parsed = JSON.parse(extractJson(text)) as Record<string, unknown>

  const rawSections = Array.isArray(parsed.sections) ? parsed.sections : []
  const sections = (rawSections as unknown[]).flatMap((s): UISection[] => {
    if (typeof s !== 'object' || s === null) return []
    const raw = s as Record<string, unknown>
    const normalizedType = normalizeSectionType(raw.type)
    if (!normalizedType) return []
    return [{ ...raw, type: normalizedType } as UISection]
  })

  const rawTheme =
    typeof parsed.theme === 'object' && parsed.theme !== null
      ? (parsed.theme as Record<string, unknown>)
      : {}

  const VALID_STYLES = new Set<ThemeStyle>(['minimal', 'colorful', 'dark'])

  return {
    appName: typeof parsed.appName === 'string' ? parsed.appName : plan.appName,
    theme: {
      primaryColor: typeof rawTheme.primaryColor === 'string' ? rawTheme.primaryColor : '#4F46E5',
      style: VALID_STYLES.has(rawTheme.style as ThemeStyle)
        ? (rawTheme.style as ThemeStyle)
        : 'minimal',
    },
    sections,
  }
}

const VALID_COMPONENT_TYPES = new Set<UIComponentType>([
  'header',
  'nav',
  'list',
  'card',
  'form',
  'button',
  'text',
  'image-placeholder',
])

function isValidComponentType(value: unknown): value is UIComponentType {
  return typeof value === 'string' && VALID_COMPONENT_TYPES.has(value as UIComponentType)
}

export async function claudeGenerateScreens(plan: AppPlan): Promise<Screen[]> {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    system:
      '당신은 모바일 앱 UI 기획 전문가입니다. 기획서를 보고 화면 목록을 JSON 배열로만 반환하세요. 다른 텍스트 없이 JSON만 출력하세요.',
    messages: [
      {
        role: 'user',
        content: `앱 이름: "${plan.appName}"
목적: "${plan.purpose}"
핵심 기능: ${plan.coreFeatures.join(', ')}

4-7개 화면을 아래 형식의 JSON 배열로 생성하세요. 첫 번째는 반드시 홈 화면:
[
  {
    "id": "home",
    "name": "홈",
    "description": "화면 설명",
    "components": [
      {"type": "header", "label": "${plan.appName}"},
      {"type": "nav", "label": "하단 네비게이션"},
      {"type": "list", "label": "주요 콘텐츠 목록"}
    ]
  }
]

component type은 반드시 다음 중 하나: header, nav, list, card, form, button, text, image-placeholder
각 화면은 2-4개 component를 포함하세요.`,
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  const parsed = JSON.parse(extractJson(text)) as unknown[]

  return parsed.map((s, i) => {
    const screen = s as Record<string, unknown>
    const rawComponents = Array.isArray(screen.components) ? screen.components : []

    return {
      id: typeof screen.id === 'string' ? screen.id : `screen-${i}`,
      name: typeof screen.name === 'string' ? screen.name : `화면 ${i + 1}`,
      description: typeof screen.description === 'string' ? screen.description : '',
      components: (rawComponents as unknown[])
        .filter((c): c is Record<string, unknown> => typeof c === 'object' && c !== null)
        .map((c) => ({
          type: isValidComponentType(c.type) ? c.type : 'text',
          label: typeof c.label === 'string' ? c.label : '',
        })),
    }
  })
}
