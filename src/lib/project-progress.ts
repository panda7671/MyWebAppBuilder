import { Project } from '@/types'

export function getProjectProgress(project: Project): number {
  if (project.generatedApp) return 5
  if (project.screens.length > 0) return 4
  if (project.plan.appName) return 3
  if (project.qa.questions.some((q) => q.answer)) return 2
  if (project.input.description) return 1
  return 0
}

export function getResumeHref(id: string, project: Project): string {
  const step = getProjectProgress(project)
  if (step >= 5) return `/projects/${id}/preview`
  if (step >= 4) return `/projects/${id}/screens`
  if (step >= 3) return `/projects/${id}/plan`
  if (step >= 2) return `/projects/${id}/questions`
  return `/projects/${id}/input`
}

export function getStageBadge(progress: number): { label: string; cls: string } {
  if (progress >= 5) return { label: '코드/ZIP 다운로드 가능', cls: 'bg-green-100 text-green-600' }
  if (progress >= 4) return { label: '화면 목록 완료', cls: 'bg-purple-100 text-purple-600' }
  if (progress >= 3) return { label: '기획서 생성 완료', cls: 'bg-blue-100 text-blue-600' }
  return { label: '아이디어만 있음', cls: 'bg-gray-100 text-gray-500' }
}
