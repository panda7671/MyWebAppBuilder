import React from 'react'

interface MobileFrameProps {
  children: React.ReactNode
  footer?: React.ReactNode
}

export default function MobileFrame({ children, footer }: MobileFrameProps) {
  return (
    <div className="flex justify-center">
      <div
        className="relative rounded-[2.75rem] border-[6px] border-gray-900 bg-white shadow-2xl overflow-hidden flex flex-col"
        style={{ width: 300, height: 620 }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-gray-900 rounded-b-2xl z-10" />

        {/* Status bar */}
        <div className="flex items-center justify-between px-5 pt-7 pb-1 shrink-0">
          <span className="text-[10px] font-bold text-gray-900">9:41</span>
          <div className="flex items-center gap-1.5">
            <div className="flex gap-px items-end" style={{ height: 10 }}>
              {[3, 5, 7, 9].map((h) => (
                <div key={h} className="w-1 bg-gray-900 rounded-sm" style={{ height: h }} />
              ))}
            </div>
            <div className="w-4 h-2.5 rounded-sm border border-gray-900 relative flex items-center px-0.5">
              <div className="w-2 h-1.5 bg-gray-900 rounded-sm" />
              <div className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-0.5 h-1.5 bg-gray-900 rounded-r-sm" />
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">{children}</div>

        {/* Pinned footer (nav bar) */}
        {footer}

        {/* Home indicator */}
        <div className="shrink-0 py-2 flex justify-center">
          <div className="w-20 h-1 bg-gray-900 rounded-full" />
        </div>
      </div>
    </div>
  )
}
