export type ProjectStatus = 'draft' | 'planned' | 'complete'

export type UIComponentType =
  | 'header'
  | 'nav'
  | 'list'
  | 'card'
  | 'form'
  | 'button'
  | 'text'
  | 'image-placeholder'

export interface UIComponent {
  type: UIComponentType
  label: string
  props?: Record<string, string>
}

export interface Screen {
  id: string
  name: string
  description: string
  components: UIComponent[]
}

export interface Question {
  id: string
  text: string
  answer: string
  placeholder?: string
}

export interface QASession {
  questions: Question[]
}

export interface UserInput {
  description: string
}

export interface AppPlan {
  appName: string
  purpose: string
  targetUser: string
  coreFeatures: string[]
  techStack: string[]
}

export interface Project {
  id: string
  createdAt: string
  updatedAt: string
  status: ProjectStatus
  input: UserInput
  qa: QASession
  plan: AppPlan
  screens: Screen[]
}
