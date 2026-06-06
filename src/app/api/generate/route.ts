import { NextRequest, NextResponse } from 'next/server'
import { AppPlan, QASession, Question, Screen } from '@/types'
import { claudeGenerateQuestions, claudeGeneratePlan, claudeGenerateScreens } from '@/lib/claude'
import { generateQuestions, generatePlan, generateScreens } from '@/lib/mock-ai'

type GenerateRequest =
  | { action: 'questions'; payload: { description: string } }
  | { action: 'plan'; payload: { description: string; qa: QASession } }
  | { action: 'screens'; payload: { plan: AppPlan } }

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
        const questions: Question[] = useAI
          ? await claudeGenerateQuestions(description).catch(() => generateQuestions(description))
          : generateQuestions(description)
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
        const plan: AppPlan = useAI
          ? await claudeGeneratePlan(description, qa).catch(() => generatePlan(stubProject))
          : generatePlan(stubProject)
        return NextResponse.json({ success: true, data: plan })
      }

      case 'screens': {
        const { plan } = body.payload
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
        const screens: Screen[] = useAI
          ? await claudeGenerateScreens(plan).catch(() => generateScreens(stubProject))
          : generateScreens(stubProject)
        return NextResponse.json({ success: true, data: screens })
      }

      default:
        return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 })
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
