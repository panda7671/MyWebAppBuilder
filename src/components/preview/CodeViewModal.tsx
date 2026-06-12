'use client'

import { useState, useCallback, useEffect, useRef } from 'react'

interface CodeViewModalProps {
  code: string
  fileName?: string
  onClose: () => void
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  return `${(bytes / 1024).toFixed(1)} KB`
}

export default function CodeViewModal({
  code,
  fileName = 'generated-app.tsx',
  onClose,
}: CodeViewModalProps) {
  const [copied, setCopied] = useState(false)
  const [inlineCopied, setInlineCopied] = useState(false)
  const codeRef = useRef<HTMLPreElement>(null)

  const lineCount = code.split('\n').length
  const byteSize = formatBytes(new TextEncoder().encode(code).length)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      return true
    } catch {
      return false
    }
  }, [code])

  const handleFooterCopy = useCallback(async () => {
    const ok = await copyCode()
    if (!ok) return
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [copyCode])

  const handleInlineCopy = useCallback(async () => {
    const ok = await copyCode()
    if (!ok) return
    setInlineCopied(true)
    setTimeout(() => setInlineCopied(false), 2000)
  }, [copyCode])

  const handleDownload = useCallback(() => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [code, fileName])

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
            <p className="text-xs text-gray-400 mt-0.5">
              React TSX · {lineCount}줄 · {byteSize}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors text-lg leading-none"
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        {/* Usage info banner */}
        <div className="px-5 py-3 bg-blue-50 border-b border-blue-100 shrink-0 flex items-start gap-2.5">
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            aria-hidden="true"
            className="text-blue-500 mt-0.5 shrink-0"
          >
            <circle cx="7.5" cy="7.5" r="6.5" stroke="currentColor" strokeWidth="1.3" />
            <path
              d="M7.5 6.5v5M7.5 4.5v.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <div className="text-xs text-blue-800 leading-relaxed">
            <p className="font-semibold mb-1">이 파일은 단독으로 실행할 수 없습니다</p>
            <p>
              <code className="font-mono bg-blue-100 px-1 rounded">react</code>,{' '}
              <code className="font-mono bg-blue-100 px-1 rounded">typescript</code> 의존성이 있는
              프로젝트 안에 넣어야 정상 인식됩니다.
            </p>
            <p className="mt-1">
              예시 경로:{' '}
              <code className="font-mono bg-blue-100 px-1 rounded">
                src/components/GeneratedApp.tsx
              </code>
            </p>
            <p className="mt-1 text-blue-500">
              추후 ZIP 다운로드로 package.json과 전체 프로젝트 구조를 함께 제공할 예정입니다.
            </p>
          </div>
        </div>

        {/* Code block */}
        <div className="relative flex-1 min-h-0 overflow-y-auto bg-gray-950 group">
          {/* Inline copy button — visible on hover */}
          <button
            onClick={handleInlineCopy}
            title="코드 복사"
            className={`absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 ${
              inlineCopied
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
            }`}
          >
            {inlineCopied ? (
              <>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path
                    d="M1.5 6l3 3 6-6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                복사됨
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <rect
                    x="3.5"
                    y="0.5"
                    width="8"
                    height="9"
                    rx="1.5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M0.5 3.5h2.5v8a1 1 0 001 1h6"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
                복사
              </>
            )}
          </button>

          <pre
            ref={codeRef}
            className="p-5 text-[11px] sm:text-xs text-gray-100 leading-relaxed font-mono whitespace-pre overflow-x-auto"
          >
            <code>{code}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-100 shrink-0">
          <button
            onClick={handleDownload}
            title={`${fileName} 파일로 다운로드`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M7 1v8M4 6l3 3 3-3M2 11h10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            다운로드
          </button>
          <button
            onClick={handleFooterCopy}
            title="전체 코드를 클립보드에 복사"
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
