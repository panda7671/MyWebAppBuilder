import { NextRequest, NextResponse } from 'next/server'
import { AppPlan, QASession, Question, Screen, UISchema } from '@/types'
import {
  claudeGenerateQuestions,
  claudeGeneratePlan,
  claudeGenerateScreens,
  claudeGenerateApp,
} from '@/lib/claude'
import { generateQuestions, generatePlan, generateScreens, generateApp } from '@/lib/mock-ai'

// Accepts both `coreFeatures`/`targetUser` (internal) and `features`/`targetUsers` (client-facing)
type IncomingPlan = {
  appName?: string
  purpose?: string
  targetUser?: string
  targetUsers?: string
  coreFeatures?: string[]
  features?: string[]
  techStack?: string[]
  rawDescription?: string
}

type GenerateRequest =
  | { action: 'questions'; payload: { description: string } }
  | { action: 'plan'; payload: { description: string; qa: QASession } }
  | { action: 'screens'; payload: { plan: IncomingPlan } }
  | { action: 'app'; payload: { plan: IncomingPlan; screens: Screen[] } }

function normalizePlan(raw: IncomingPlan): AppPlan {
  return {
    appName: raw.appName ?? '',
    purpose: raw.purpose ?? '',
    targetUser: raw.targetUser ?? raw.targetUsers ?? '일반 사용자',
    coreFeatures: Array.isArray(raw.coreFeatures)
      ? raw.coreFeatures
      : Array.isArray(raw.features)
        ? raw.features
        : [],
    techStack: Array.isArray(raw.techStack) ? raw.techStack : [],
    rawDescription: raw.rawDescription,
  }
}

const hasApiKey = (): boolean =>
  typeof process.env.ANTHROPIC_API_KEY === 'string' &&
  process.env.ANTHROPIC_API_KEY.trim().length > 0

export async function POST(request: NextRequest) {
  let body: GenerateRequest

  try {
    body = (await request.json()) as GenerateRequest
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const useAI = hasApiKey()

  try {
    switch (body.action) {
      case 'questions': {
        const { description } = body.payload
        let questions: Question[]
        if (useAI) {
          try {
            questions = await claudeGenerateQuestions(description)
            console.log('[AI] Using Claude API: questions')
          } catch {
            console.log('[AI] Falling back to mock-ai: questions')
            questions = generateQuestions(description)
          }
        } else {
          console.log('[AI] Falling back to mock-ai: questions')
          questions = generateQuestions(description)
        }
        return NextResponse.json({ success: true, data: questions })
      }

      case 'plan': {
        const { description, qa } = body.payload
        const stubProject = {
          id: '',
          createdAt: '',
          updatedAt: '',
          status: 'draft' as const,
          input: { description },
          qa,
          plan: { appName: '', purpose: '', targetUser: '', coreFeatures: [], techStack: [] },
          screens: [],
        }
        let plan: AppPlan
        if (useAI) {
          try {
            plan = await claudeGeneratePlan(description, qa)
            console.log('[AI] Using Claude API: plan')
          } catch {
            console.log('[AI] Falling back to mock-ai: plan')
            plan = generatePlan(stubProject)
          }
        } else {
          console.log('[AI] Falling back to mock-ai: plan')
          plan = generatePlan(stubProject)
        }
        return NextResponse.json({ success: true, data: plan })
      }

      case 'screens': {
        if (!body.payload?.plan) {
          return NextResponse.json({ success: false, error: 'plan is required' }, { status: 400 })
        }
        const plan = normalizePlan(body.payload.plan)
        const stubProject = {
          id: '',
          createdAt: '',
          updatedAt: '',
          status: 'planned' as const,
          input: { description: '' },
          qa: { questions: [] },
          plan,
          screens: [],
        }
        let screens: Screen[]
        if (useAI) {
          try {
            screens = await claudeGenerateScreens(plan)
            console.log('[AI] Using Claude API: screens')
          } catch {
            console.log('[AI] Falling back to mock-ai: screens')
            screens = generateScreens(stubProject)
          }
        } else {
          console.log('[AI] Falling back to mock-ai: screens')
          screens = generateScreens(stubProject)
        }
        return NextResponse.json({ success: true, data: screens })
      }

      case 'app': {
        if (!body.payload?.plan) {
          return NextResponse.json({ success: false, error: 'plan is required' }, { status: 400 })
        }
        const plan = normalizePlan(body.payload.plan)
        const screens = Array.isArray(body.payload.screens) ? body.payload.screens : []
        let schema: UISchema
        if (useAI) {
          try {
            schema = await claudeGenerateApp(plan, screens)
            console.log('[AI] Using Claude API: app')
            if (schema.sections.length === 0) {
              console.log('[AI] Claude returned empty sections, falling back to mock-ai: app')
              schema = generateApp(plan)
            }
          } catch {
            console.log('[AI] Falling back to mock-ai: app')
            schema = generateApp(plan)
          }
        } else {
          console.log('[AI] Falling back to mock-ai: app')
          schema = generateApp(plan)
        }
        return NextResponse.json({ success: true, data: schema })
      }

      default:
        return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 })
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
