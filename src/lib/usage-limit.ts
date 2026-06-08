const STORAGE_KEY = 'mwab_usage'
const DAILY_LIMIT = 10

interface UsageRecord {
  count: number
  date: string
}

export class UsageLimitError extends Error {
  constructor() {
    super('오늘 무료 생성 횟수(10회)를 모두 사용했어요. 내일 다시 시도해주세요.')
    this.name = 'UsageLimitError'
  }
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function readRecord(): UsageRecord {
  if (typeof window === 'undefined') return { count: 0, date: today() }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { count: 0, date: today() }
    const parsed = JSON.parse(raw) as unknown
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      typeof (parsed as Record<string, unknown>).count === 'number' &&
      typeof (parsed as Record<string, unknown>).date === 'string'
    ) {
      return parsed as UsageRecord
    }
  } catch {
    // corrupted storage — treat as fresh
  }
  return { count: 0, date: today() }
}

function writeRecord(record: UsageRecord): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
}

function getRecord(): UsageRecord {
  const record = readRecord()
  // auto-reset when date changes
  if (record.date !== today()) return { count: 0, date: today() }
  return record
}

export function canCall(): boolean {
  return getRecord().count < DAILY_LIMIT
}

export function recordCall(): void {
  const record = getRecord()
  writeRecord({ ...record, count: record.count + 1 })
}

export function getRemainingCalls(): number {
  return Math.max(0, DAILY_LIMIT - getRecord().count)
}
