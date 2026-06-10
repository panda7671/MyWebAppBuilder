import type { UISchema } from '@/types/ui-schema'
import SectionRenderer from './SectionRenderer'

interface AppPreviewRendererProps {
  schema: UISchema
}

export default function AppPreviewRenderer({ schema }: AppPreviewRendererProps) {
  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-[430px] rounded-[2rem] border-[3px] border-gray-800 shadow-2xl overflow-hidden bg-white">
        {/* Status bar */}
        <div className="bg-gray-900 px-5 py-2 flex items-center justify-between">
          <span className="text-white text-[11px] font-semibold tabular-nums">9:41</span>
          <div className="flex items-center gap-2">
            {/* Signal bars */}
            <svg width="16" height="12" viewBox="0 0 16 12" fill="white" aria-hidden="true">
              <rect x="0" y="9" width="3" height="3" rx="0.5" fillOpacity="0.4" />
              <rect x="4.5" y="6" width="3" height="6" rx="0.5" fillOpacity="0.6" />
              <rect x="9" y="3" width="3" height="9" rx="0.5" fillOpacity="0.8" />
              <rect x="13.5" y="0" width="3" height="12" rx="0.5" />
            </svg>
            {/* Battery */}
            <svg width="22" height="11" viewBox="0 0 22 11" fill="none" aria-hidden="true">
              <rect x="0.5" y="0.5" width="17" height="10" rx="2" stroke="white" strokeOpacity="0.8" />
              <rect x="2" y="2" width="12" height="7" rx="1" fill="white" />
              <path d="M18.5 3.5v4" stroke="white" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* App header */}
        <div
          style={{ backgroundColor: schema.theme.primaryColor }}
          className="px-4 py-3 flex items-center justify-between"
        >
          <span className="text-white font-bold text-[15px] tracking-tight truncate flex-1">
            {schema.appName || '앱'}
          </span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            className="ml-3 shrink-0 opacity-80"
            aria-hidden="true"
          >
            <circle cx="9" cy="3" r="1.5" fill="white" />
            <circle cx="9" cy="9" r="1.5" fill="white" />
            <circle cx="9" cy="15" r="1.5" fill="white" />
          </svg>
        </div>

        {/* Scrollable content */}
        <div className="bg-gray-50 overflow-y-auto" style={{ maxHeight: 580 }}>
          <div className="p-4 space-y-4 pb-8">
            {schema.sections.map((section, i) => (
              <SectionRenderer key={i} section={section} primaryColor={schema.theme.primaryColor} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
