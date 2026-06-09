export interface HeroSection {
  type: 'Hero'
  title: string
  subtitle?: string
  ctaText?: string
}

export interface CardItem {
  title: string
  description?: string
  badge?: string
}

export interface CardGridSection {
  type: 'CardGrid'
  title?: string
  cards: CardItem[]
}

export type FormFieldType = 'text' | 'email' | 'textarea' | 'select'

export interface FormField {
  label: string
  type: FormFieldType
  placeholder?: string
  options?: string[]
  required?: boolean
}

export interface FormSection {
  type: 'Form'
  title?: string
  fields: FormField[]
  submitText?: string
}

export interface ListItem {
  title: string
  subtitle?: string
  meta?: string
  badge?: string
}

export interface ListSection {
  type: 'List'
  title?: string
  items: ListItem[]
}

export interface DetailField {
  label: string
  value: string
}

export interface DetailSection {
  type: 'Detail'
  title: string
  fields: DetailField[]
}

export interface ChatMessage {
  sender: 'user' | 'bot'
  text: string
}

export interface ChatSection {
  type: 'Chat'
  title?: string
  messages: ChatMessage[]
  inputPlaceholder?: string
}

export type UISection =
  | HeroSection
  | CardGridSection
  | FormSection
  | ListSection
  | DetailSection
  | ChatSection

export type ThemeStyle = 'minimal' | 'colorful' | 'dark'

export interface UITheme {
  primaryColor: string
  style: ThemeStyle
}

export interface UISchema {
  appName: string
  theme: UITheme
  sections: UISection[]
}
