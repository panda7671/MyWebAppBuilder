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
