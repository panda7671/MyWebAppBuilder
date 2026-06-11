'use client'

import { useState, useRef, useEffect } from 'react'
import type {
  UISection,
  HeroSection,
  CardGridSection,
  FormSection,
  ListSection,
  DetailSection,
  ChatSection,
  ChatMessage,
} from '@/types/ui-schema'

interface Props {
  section: UISection
  primaryColor: string
  onToast: (message: string) => void
}

interface ViewProps<T> {
  section: T
  primaryColor: string
  onToast: (message: string) => void
}

function safeArr<T>(value: T[] | undefined | null): T[] {
  return Array.isArray(value) ? value : []
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 bg-white py-8 text-center">
      <p className="text-xs text-gray-400">{message}</p>
    </div>
  )
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function HeroView({ section, primaryColor, onToast }: ViewProps<HeroSection>) {
  return (
    <section
      className="rounded-2xl p-7 text-center overflow-hidden relative"
      style={{
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}cc 100%)`,
      }}
    >
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute -bottom-14 -left-10 w-52 h-52 rounded-full bg-white/5 pointer-events-none" />

      <div className="relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-white/20 mx-auto mb-4 flex items-center justify-center">
          <span className="text-white text-2xl font-bold select-none">
            {(section.title || '앱')[0]}
          </span>
        </div>
        <h2 className="text-xl font-bold text-white mb-2 leading-snug">
          {section.title || '환영합니다'}
        </h2>
        {section.subtitle && (
          <p className="text-sm text-white/80 mb-5 leading-relaxed">{section.subtitle}</p>
        )}
        {section.ctaText && (
          <button
            style={{ color: primaryColor }}
            className="rounded-full px-8 py-2.5 text-sm font-bold bg-white shadow-sm active:scale-95 transition-transform"
            onClick={() => onToast('시작합니다!')}
          >
            {section.ctaText}
          </button>
        )}
      </div>
    </section>
  )
}

// ─── CardGrid ─────────────────────────────────────────────────────────────────

function CardGridView({ section, primaryColor, onToast }: ViewProps<CardGridSection>) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const cards = safeArr(section.cards)

  return (
    <section>
      {section.title && (
        <h3 className="text-sm font-semibold text-gray-700 mb-3 px-1">{section.title}</h3>
      )}
      {cards.length === 0 ? (
        <EmptyState message="기능 정보가 없습니다" />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {cards.map((card, i) => (
            <button
              key={i}
              onClick={() => {
                const next = i === selectedIdx ? null : i
                setSelectedIdx(next)
                if (next !== null) onToast(`"${card.title}" 선택됨`)
              }}
              className="rounded-xl bg-white p-4 shadow-sm text-left w-full transition-all active:scale-95 border"
              style={{
                borderColor: i === selectedIdx ? primaryColor : '#f3f4f6',
                boxShadow:
                  i === selectedIdx
                    ? `0 0 0 2px ${primaryColor}40, 0 1px 4px rgba(0,0,0,0.06)`
                    : '0 1px 4px rgba(0,0,0,0.06)',
              }}
            >
              {card.badge && (
                <span
                  style={{ color: primaryColor, backgroundColor: `${primaryColor}18` }}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full mb-3 inline-block"
                >
                  {card.badge}
                </span>
              )}
              <div
                className="w-9 h-9 rounded-xl mb-3 flex items-center justify-center"
                style={{ backgroundColor: `${primaryColor}18` }}
                aria-hidden="true"
              >
                <div className="w-4 h-4 rounded-md" style={{ backgroundColor: primaryColor }} />
              </div>
              <p className="text-sm font-semibold text-gray-800 leading-snug">
                {card.title || '기능'}
              </p>
              {card.description && (
                <p className="text-xs text-gray-400 mt-1 leading-relaxed line-clamp-2">
                  {card.description}
                </p>
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

// ─── List ─────────────────────────────────────────────────────────────────────

function ListSectionView({ section, primaryColor, onToast }: ViewProps<ListSection>) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const items = safeArr(section.items)

  return (
    <section>
      {section.title && (
        <h3 className="text-sm font-semibold text-gray-700 mb-3 px-1">{section.title}</h3>
      )}
      {items.length === 0 ? (
        <EmptyState message="항목이 없습니다" />
      ) : (
        <div className="rounded-xl bg-white shadow-sm border border-gray-100 divide-y divide-gray-50 overflow-hidden">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                const next = i === selectedIdx ? null : i
                setSelectedIdx(next)
                if (next !== null) onToast(`"${item.title}" 선택됨`)
              }}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors"
              style={{
                backgroundColor: i === selectedIdx ? `${primaryColor}0d` : undefined,
              }}
            >
              <div
                className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white select-none"
                style={{ backgroundColor: primaryColor }}
              >
                {(item.title || '?')[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{item.title || '항목'}</p>
                {item.subtitle && <p className="text-xs text-gray-400 mt-0.5">{item.subtitle}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {item.meta && <span className="text-xs text-gray-400">{item.meta}</span>}
                {item.badge && (
                  <span
                    style={{ color: primaryColor, backgroundColor: `${primaryColor}18` }}
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                  >
                    {item.badge}
                  </span>
                )}
                <svg
                  width="6"
                  height="10"
                  viewBox="0 0 6 10"
                  fill="none"
                  className="transition-transform"
                  style={{
                    color: i === selectedIdx ? primaryColor : '#d1d5db',
                    transform: i === selectedIdx ? 'rotate(90deg)' : undefined,
                  }}
                  aria-hidden="true"
                >
                  <path
                    d="M1 1l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

// ─── Form ─────────────────────────────────────────────────────────────────────

function FormSectionView({ section, primaryColor, onToast }: ViewProps<FormSection>) {
  const [textValues, setTextValues] = useState<Record<string, string>>({})
  const [toggleValues, setToggleValues] = useState<Record<string, boolean>>({})
  const fields = safeArr(section.fields)

  const setTextValue = (label: string, value: string) =>
    setTextValues((prev) => ({ ...prev, [label]: value }))

  const flipToggle = (label: string) =>
    setToggleValues((prev) => ({ ...prev, [label]: !prev[label] }))

  return (
    <section className="rounded-2xl bg-white shadow-sm border border-gray-100 p-5">
      {section.title && (
        <h3 className="text-sm font-semibold text-gray-800 mb-4">{section.title}</h3>
      )}
      {fields.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-3">입력 필드가 없습니다</p>
      ) : (
        <div className="space-y-4">
          {fields.map((field, i) => (
            <div key={i}>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                {field.label}
                {field.required && <span className="text-red-400 ml-0.5">*</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  placeholder={field.placeholder}
                  rows={3}
                  value={textValues[field.label] ?? ''}
                  onChange={(e) => setTextValue(field.label, e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm resize-none text-gray-700 bg-white focus:outline-none focus:border-gray-300 transition-colors"
                />
              ) : field.type === 'select' ? (
                <select
                  value={textValues[field.label] ?? field.options?.[0] ?? ''}
                  onChange={(e) => setTextValue(field.label, e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none"
                >
                  {(
                    field.options ?? (field.placeholder ? [field.placeholder] : ['선택하세요'])
                  ).map((opt, j) => (
                    <option key={j} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : field.type === 'toggle' ? (
                <div
                  role="switch"
                  aria-checked={toggleValues[field.label] ?? false}
                  tabIndex={0}
                  onClick={() => flipToggle(field.label)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && flipToggle(field.label)}
                  className="flex items-center justify-between py-1 cursor-pointer select-none"
                >
                  <span className="text-sm text-gray-600">
                    {field.placeholder ?? '켜기 / 끄기'}
                  </span>
                  <div
                    className="relative w-11 h-6 rounded-full transition-colors duration-200"
                    style={{
                      backgroundColor: toggleValues[field.label] ? primaryColor : '#d1d5db',
                    }}
                  >
                    <div
                      className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200"
                      style={{
                        transform: toggleValues[field.label]
                          ? 'translateX(20px)'
                          : 'translateX(2px)',
                      }}
                    />
                  </div>
                </div>
              ) : (
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={textValues[field.label] ?? ''}
                  onChange={(e) => setTextValue(field.label, e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:border-gray-300 transition-colors"
                />
              )}
            </div>
          ))}
        </div>
      )}
      <button
        onClick={() => onToast('저장되었습니다 ✓')}
        style={{ backgroundColor: primaryColor }}
        className="w-full rounded-xl py-3 text-sm font-bold text-white mt-5 active:opacity-80 transition-opacity"
      >
        {section.submitText ?? '제출'}
      </button>
    </section>
  )
}

// ─── Detail ───────────────────────────────────────────────────────────────────

function DetailView({ section }: ViewProps<DetailSection>) {
  const fields = safeArr(section.fields)
  return (
    <section className="rounded-2xl bg-white shadow-sm border border-gray-100 p-5">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">{section.title || '상세 정보'}</h3>
      {fields.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-3">정보가 없습니다</p>
      ) : (
        <dl className="space-y-3">
          {fields.map((field, i) => (
            <div key={i} className="flex gap-3">
              <dt className="text-xs text-gray-400 w-20 shrink-0 pt-px">{field.label}</dt>
              <dd className="text-sm text-gray-800 font-medium flex-1">{field.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  )
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

function ChatSectionView({ section, primaryColor }: ViewProps<ChatSection>) {
  const [messages, setMessages] = useState<ChatMessage[]>(safeArr(section.messages))
  const [input, setInput] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages.length])

  const handleSend = () => {
    const text = input.trim()
    if (!text) return
    setMessages((prev) => [...prev, { sender: 'user', text }])
    setInput('')
  }

  return (
    <section className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
      {section.title && (
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ backgroundColor: primaryColor }}
            aria-hidden="true"
          >
            💬
          </div>
          <h3 className="text-sm font-semibold text-gray-800">{section.title}</h3>
        </div>
      )}
      <div
        ref={listRef}
        className="px-4 py-3 space-y-3 min-h-[100px] max-h-[260px] overflow-y-auto"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-20">
            <p className="text-xs text-gray-400">메시지가 없습니다</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isUser = msg.sender === 'user'
            return (
              <div
                key={i}
                className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div
                    className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ backgroundColor: primaryColor }}
                    aria-hidden="true"
                  >
                    B
                  </div>
                )}
                <div
                  style={isUser ? { backgroundColor: primaryColor } : undefined}
                  className={`rounded-2xl px-3.5 py-2 max-w-[72%] text-sm leading-relaxed ${
                    isUser ? 'rounded-br-sm text-white' : 'rounded-bl-sm bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            )
          })
        )}
      </div>
      <div className="px-3 py-2.5 border-t border-gray-100 flex gap-2 items-center">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          placeholder={section.inputPlaceholder ?? '메시지를 입력하세요…'}
          className="flex-1 rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:border-gray-300 transition-colors"
        />
        <button
          onClick={handleSend}
          style={{ backgroundColor: primaryColor }}
          className="rounded-full w-9 h-9 flex items-center justify-center shrink-0 text-white active:opacity-80 transition-opacity"
          aria-label="전송"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M12.5 7L1.5 1.5l2.5 5.5-2.5 5.5 11-5.5z" fill="currentColor" />
          </svg>
        </button>
      </div>
    </section>
  )
}

// ─── Router ───────────────────────────────────────────────────────────────────

export default function SectionRenderer({ section, primaryColor, onToast }: Props) {
  switch (section.type) {
    case 'Hero':
      return <HeroView section={section} primaryColor={primaryColor} onToast={onToast} />
    case 'CardGrid':
      return <CardGridView section={section} primaryColor={primaryColor} onToast={onToast} />
    case 'List':
      return <ListSectionView section={section} primaryColor={primaryColor} onToast={onToast} />
    case 'Form':
      return <FormSectionView section={section} primaryColor={primaryColor} onToast={onToast} />
    case 'Detail':
      return <DetailView section={section} primaryColor={primaryColor} onToast={onToast} />
    case 'Chat':
      return <ChatSectionView section={section} primaryColor={primaryColor} onToast={onToast} />
    default: {
      const _exhaustive: never = section
      void _exhaustive
      return null
    }
  }
}
