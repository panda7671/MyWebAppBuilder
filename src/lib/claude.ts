import 'server-only'
import Anthropic from '@anthropic-ai/sdk'
import { AppPlan, Question, Screen, QASession, UIComponentType } from '@/types'

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
- q4: 사용 기기 (스마트폰/컴퓨터/둘 다?)
- q5: 앱 분위기 (톤앤매너?)

형식:
[
  {"id":"q1","text":"질문 내용","answer":"","placeholder":"예: 예시 답변"},
  {"id":"q2","text":"질문 내용","answer":"","placeholder":"예: 예시 답변"},
  {"id":"q3","text":"질문 내용","answer":"","placeholder":"예: 예시 답변"},
  {"id":"q4","text":"질문 내용","answer":"","placeholder":"예: 스마트폰, 컴퓨터, 또는 둘 다"},
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
  "techStack": ["기술1", "기술2", "기술3"]
}`,
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  const parsed = JSON.parse(extractJson(text)) as Record<string, unknown>

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
