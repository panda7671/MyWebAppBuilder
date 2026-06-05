export function HeaderBlock({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200">
      <div className="w-6 h-6 rounded bg-indigo-200 shrink-0" />
      <span className="text-sm font-semibold text-gray-800">{label}</span>
    </div>
  )
}

export function NavBlock({
  label,
  tabs,
  activeTab,
}: {
  label: string
  tabs?: string[]
  activeTab?: string
}) {
  const displayTabs = tabs?.slice(0, 4) ?? ['홈', '탐색', '알림', '프로필']
  return (
    <div
      aria-label={label}
      className="flex items-center justify-around px-2 py-2 bg-white border-t border-gray-200"
    >
      {displayTabs.map((tab, i) => {
        const isActive = activeTab ? tab === activeTab : i === 0
        return (
          <div key={tab} className="flex flex-col items-center gap-0.5">
            <div className={`w-5 h-5 rounded ${isActive ? 'bg-indigo-400' : 'bg-gray-200'}`} />
            <span
              className={`text-[10px] ${isActive ? 'text-indigo-600 font-medium' : 'text-gray-400'}`}
            >
              {tab}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export function ListBlock({ label }: { label: string }) {
  return (
    <div className="px-4 py-3">
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
        {label}
      </p>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0"
        >
          <div className="w-9 h-9 rounded-lg bg-gray-200 shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-2.5 bg-gray-200 rounded-full" style={{ width: `${65 + i * 10}%` }} />
            <div className="h-2 bg-gray-100 rounded-full" style={{ width: `${40 + i * 8}%` }} />
          </div>
          <div className="w-4 h-4 rounded bg-gray-100 shrink-0" />
        </div>
      ))}
    </div>
  )
}

export function CardBlock({ label }: { label: string }) {
  return (
    <div className="mx-4 my-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-3">
        {label}
      </p>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded-full w-3/4" />
        <div className="h-2.5 bg-gray-200 rounded-full w-full" />
        <div className="h-2 bg-gray-100 rounded-full w-2/3" />
      </div>
    </div>
  )
}

export function FormBlock({ label }: { label: string }) {
  return (
    <div className="px-4 py-3 space-y-4">
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
      {[0, 1].map((i) => (
        <div key={i}>
          <div className="h-2 bg-gray-200 rounded-full w-16 mb-1.5" />
          <div className="h-9 rounded-lg border-2 border-gray-200 bg-white" />
        </div>
      ))}
    </div>
  )
}

export function ButtonBlock({ label }: { label: string }) {
  return (
    <div className="px-4 py-2">
      <div className="h-11 rounded-xl bg-indigo-500 flex items-center justify-center shadow-sm">
        <span className="text-sm font-semibold text-white">{label}</span>
      </div>
    </div>
  )
}

export function TextBlock({ label }: { label: string }) {
  return (
    <div className="px-4 py-3">
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
        {label}
      </p>
      <div className="space-y-1.5">
        <div className="h-2 bg-gray-200 rounded-full w-full" />
        <div className="h-2 bg-gray-200 rounded-full w-11/12" />
        <div className="h-2 bg-gray-100 rounded-full w-4/5" />
        <div className="h-2 bg-gray-100 rounded-full w-3/4" />
      </div>
    </div>
  )
}

export function ImagePlaceholderBlock({ label }: { label: string }) {
  return (
    <div className="mx-4 my-3">
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
        {label}
      </p>
      <div className="h-44 rounded-xl bg-gray-200 flex flex-col items-center justify-center gap-2">
        <div className="w-10 h-10 rounded-full bg-gray-300" />
        <div className="space-y-1 text-center">
          <div className="h-2 bg-gray-300 rounded-full w-20 mx-auto" />
          <div className="h-1.5 bg-gray-300 rounded-full w-14 mx-auto" />
        </div>
      </div>
    </div>
  )
}
