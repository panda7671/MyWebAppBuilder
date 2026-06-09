'use client'

import type { UISection } from '@/types/ui-schema'

interface Props {
  section: UISection
  primaryColor: string
}

export default function SectionRenderer({ section, primaryColor }: Props) {
  switch (section.type) {
    case 'Hero':
      return (
        <section className="rounded-2xl bg-indigo-50 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{section.title}</h2>
          {section.subtitle && (
            <p className="text-sm text-gray-500 mb-5 leading-relaxed">{section.subtitle}</p>
          )}
          {section.ctaText && (
            <button
              style={{ backgroundColor: primaryColor }}
              className="rounded-xl px-6 py-2.5 text-sm font-semibold text-white"
            >
              {section.ctaText}
            </button>
          )}
        </section>
      )

    case 'CardGrid':
      return (
        <section>
          {section.title && (
            <h3 className="text-base font-semibold text-gray-800 mb-3">{section.title}</h3>
          )}
          <div className="grid grid-cols-2 gap-3">
            {section.cards.map((card, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-4">
                {card.badge && (
                  <span
                    style={{ color: primaryColor, backgroundColor: `${primaryColor}18` }}
                    className="text-xs font-medium px-2 py-0.5 rounded-full mb-2 inline-block"
                  >
                    {card.badge}
                  </span>
                )}
                <p className="text-sm font-semibold text-gray-800 mb-0.5">{card.title}</p>
                {card.description && (
                  <p className="text-xs text-gray-500 leading-relaxed">{card.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )

    case 'Form':
      return (
        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          {section.title && (
            <h3 className="text-base font-semibold text-gray-800 mb-4">{section.title}</h3>
          )}
          <div className="space-y-3">
            {section.fields.map((field, i) => (
              <div key={i}>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-400 ml-0.5">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    placeholder={field.placeholder}
                    rows={3}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm resize-none text-gray-400 bg-gray-50"
                    disabled
                  />
                ) : field.type === 'select' ? (
                  <select
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-400 bg-gray-50"
                    disabled
                  >
                    <option>{field.placeholder ?? field.options?.[0] ?? '선택'}</option>
                  </select>
                ) : (
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-400 bg-gray-50"
                    disabled
                  />
                )}
              </div>
            ))}
          </div>
          <button
            style={{ backgroundColor: primaryColor }}
            className="w-full rounded-xl py-2.5 text-sm font-semibold text-white mt-4"
          >
            {section.submitText ?? '제출'}
          </button>
        </section>
      )

    case 'List':
      return (
        <section>
          {section.title && (
            <h3 className="text-base font-semibold text-gray-800 mb-3">{section.title}</h3>
          )}
          <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100">
            {section.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                  {item.subtitle && <p className="text-xs text-gray-400">{item.subtitle}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {item.meta && <span className="text-xs text-gray-400">{item.meta}</span>}
                  {item.badge && (
                    <span
                      style={{ color: primaryColor, backgroundColor: `${primaryColor}18` }}
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )

    case 'Detail':
      return (
        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          <h3 className="text-base font-semibold text-gray-800 mb-4">{section.title}</h3>
          <dl className="space-y-3">
            {section.fields.map((field, i) => (
              <div key={i} className="flex gap-4">
                <dt className="text-xs text-gray-400 w-24 shrink-0 pt-0.5">{field.label}</dt>
                <dd className="text-sm text-gray-800 font-medium">{field.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )

    case 'Chat':
      return (
        <section className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
          {section.title && (
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800">{section.title}</h3>
            </div>
          )}
          <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
            {section.messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  style={msg.sender === 'user' ? { backgroundColor: primaryColor } : {}}
                  className={`rounded-2xl px-4 py-2 max-w-[80%] text-sm ${
                    msg.sender === 'user' ? 'text-white' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
            <input
              placeholder={section.inputPlaceholder ?? '메시지를 입력하세요…'}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-400 bg-gray-50"
              disabled
            />
            <button
              style={{ backgroundColor: primaryColor }}
              className="rounded-lg px-3 py-2 text-sm text-white font-medium"
            >
              전송
            </button>
          </div>
        </section>
      )
  }
}
