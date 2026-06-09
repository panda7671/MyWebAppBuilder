import type { UISchema } from '@/types/ui-schema'
import SectionRenderer from './SectionRenderer'

interface AppPreviewRendererProps {
  schema: UISchema
}

export default function AppPreviewRenderer({ schema }: AppPreviewRendererProps) {
  return (
    <div className="rounded-2xl border border-gray-200 overflow-hidden">
      <div className="bg-white border-b border-gray-100 px-5 py-3 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <span className="ml-2 text-xs text-gray-400 font-mono truncate">{schema.appName}</span>
      </div>
      <div className="bg-gray-50 p-5 space-y-6">
        {schema.sections.map((section, i) => (
          <SectionRenderer key={i} section={section} primaryColor={schema.theme.primaryColor} />
        ))}
      </div>
    </div>
  )
}
