import { Project } from '@/types'

export function createProject(description: string): Project {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    status: 'draft',
    input: { description },
    qa: { questions: [] },
    plan: {
      appName: '',
      purpose: '',
      targetUser: '',
      coreFeatures: [],
      techStack: [],
    },
    screens: [],
  }
}

export function touchProject(project: Project): Project {
  return { ...project, updatedAt: new Date().toISOString() }
}

export function cloneProject(source: Project): Project {
  const now = new Date().toISOString()
  const deep: Project = JSON.parse(JSON.stringify(source))
  return {
    ...deep,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    plan: {
      ...deep.plan,
      appName: deep.plan.appName ? `${deep.plan.appName} (복사본)` : '',
    },
  }
}

const EMPTY_PLAN = {
  appName: '',
  purpose: '',
  targetUser: '',
  coreFeatures: [] as string[],
  techStack: [] as string[],
}

export function clearQaAndBelow(project: Project): Project {
  return {
    ...project,
    qa: { questions: [] },
    plan: { ...EMPTY_PLAN },
    screens: [],
    generatedApp: undefined,
  }
}

export function clearPlanAndBelow(project: Project): Project {
  return { ...project, plan: { ...EMPTY_PLAN }, screens: [], generatedApp: undefined }
}

export function clearScreensAndBelow(project: Project): Project {
  return { ...project, screens: [], generatedApp: undefined }
}

export function clearPreviewOnly(project: Project): Project {
  return { ...project, generatedApp: undefined }
}
