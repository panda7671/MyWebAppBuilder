import { AppPlan, QASession, Question, Screen } from '@/types'
import { canCall, recordCall, UsageLimitError } from '@/lib/usage-limit'

export { UsageLimitError }

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

async function callGenerate<T>(action: string, payload: Record<string, unknown>): Promise<T> {
  if (!canCall()) throw new UsageLimitError()

  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, payload }),
  })

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }

  const json = (await res.json()) as ApiResponse<T>

  if (!json.success || json.data === undefined) {
    throw new Error(json.error ?? 'Unknown API error')
  }

  recordCall()
  return json.data
}

export function generateQuestionsAI(description: string): Promise<Question[]> {
  return callGenerate<Question[]>('questions', { description })
}

export function generatePlanAI(description: string, qa: QASession): Promise<AppPlan> {
  return callGenerate<AppPlan>('plan', { description, qa })
}

export function generateScreensAI(plan: AppPlan): Promise<Screen[]> {
  return callGenerate<Screen[]>('screens', { plan })
}
