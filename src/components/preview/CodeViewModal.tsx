'use client'

import { useState, useCallback, useEffect } from 'react'

interface CodeViewModalProps {
  code: string
  onClose: () => void
}

export default function CodeViewModal({ code, onClose }: CodeViewModalProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard API unavailable
    }
  }, [code])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-2xl sm:rounded-2xl shadow-2xl flex flex-col"
        style={{ maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">생성된 코드</h2>
            <p className="text-xs text-gray-400 mt-0.5">React TSX 컴포넌트 (인라인 스타일)</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors text-lg leading-none"
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        {/* Code block */}
        <div className="flex-1 min-h-0 overflow-auto bg-gray-950">
          <pre className="p-5 text-[11px] sm:text-xs text-gray-100 leading-relaxed font-mono whitespace-pre">
            <code>{code}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 shrink-0">
          <span className="text-xs text-gray-400">{code.split('\n').length}줄</span>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              copied ? 'bg-green-500 text-white' : 'bg-gray-900 text-white hover:bg-gray-700'
            }`}
          >
            {copied ? (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path
                    d="M2 7l4 4 6-7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                복사됨!
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <rect
                    x="4"
                    y="1"
                    width="9"
                    height="10"
                    rx="1.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M1 4h2m0 0v8a1 1 0 001 1h7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                복사하기
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
