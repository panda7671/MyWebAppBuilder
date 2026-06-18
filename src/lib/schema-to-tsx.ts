import type {
  UISchema,
  UISection,
  HeroSection,
  CardGridSection,
  FormSection,
  ListSection,
  DetailSection,
  ChatSection,
} from '@/types/ui-schema'

function toComponentName(name: string): string {
  const cleaned = name.replace(/[^a-zA-Z0-9]/g, '')
  return (/^\d/.test(cleaned) ? 'App' + cleaned : cleaned) || 'GeneratedApp'
}

function jxt(s: string): string {
  return `{${JSON.stringify(s)}}`
}

function toAppSlug(appName: string): string {
  return (
    appName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '')
      .slice(0, 20) || 'app'
  )
}

type SectionCode = {
  constDecl: string | null
  componentDecl: string
  componentName: string
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function heroCode(s: HeroSection, idx: number): SectionCode {
  const componentName = `Section${idx}_Hero`
  const lines: string[] = [
    `function ${componentName}() {`,
    '  return (',
    '    <section',
    '      style={{',
    '        background: `linear-gradient(135deg, ${PRIMARY_COLOR} 0%, ${PRIMARY_COLOR}cc 100%)`,',
    '        borderRadius: 16,',
    '        padding: 28,',
    "        textAlign: 'center',",
    '      }}',
    '    >',
    "      <h2 style={{ color: 'white', fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>",
    `        ${jxt(s.title || '환영합니다')}`,
    '      </h2>',
  ]

  if (s.subtitle) {
    lines.push(
      "      <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, margin: '0 0 16px' }}>",
      `        ${jxt(s.subtitle)}`,
      '      </p>'
    )
  }

  if (s.ctaText) {
    lines.push(
      '      <button',
      "        onClick={() => alert('시작합니다!')}",
      '        style={{',
      "          background: 'white',",
      '          color: PRIMARY_COLOR,',
      "          border: 'none',",
      '          borderRadius: 9999,',
      "          padding: '10px 32px',",
      '          fontSize: 14,',
      '          fontWeight: 700,',
      "          cursor: 'pointer',",
      '        }}',
      '      >',
      `        ${jxt(s.ctaText)}`,
      '      </button>'
    )
  }

  lines.push('    </section>', '  )', '}')
  return { constDecl: null, componentDecl: lines.join('\n'), componentName }
}

// ─── CardGrid ─────────────────────────────────────────────────────────────────

function cardGridCode(s: CardGridSection, idx: number): SectionCode {
  const componentName = `Section${idx}_CardGrid`
  const constName = `CARDS_${idx}`
  const constDecl = `const ${constName}: Array<{ title: string; description?: string; badge?: string }> = ${JSON.stringify(s.cards ?? [], null, 2)}`

  const lines: string[] = [
    `function ${componentName}() {`,
    '  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)',
    '  return (',
    '    <section>',
  ]

  if (s.title) {
    lines.push(
      "      <h3 style={{ fontSize: 14, fontWeight: 600, color: '#374151', margin: '0 0 12px 4px' }}>",
      `        ${jxt(s.title)}`,
      '      </h3>'
    )
  }

  lines.push(
    "      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>",
    `        {${constName}.map((card, i) => (`,
    '          <button',
    '            key={i}',
    '            onClick={() => setSelectedIdx(i)}',
    '            style={{',
    "              background: 'white',",
    '              borderRadius: 12,',
    '              padding: 16,',
    "              textAlign: 'left',",
    "              width: '100%',",
    "              cursor: 'pointer',",
    "              border: i === selectedIdx ? `2px solid ${PRIMARY_COLOR}` : '1px solid #f3f4f6',",
    '              boxShadow: i === selectedIdx',
    '                ? `0 0 0 3px ${PRIMARY_COLOR}30`',
    "                : '0 1px 3px rgba(0,0,0,0.06)',",
    '            }}',
    '          >',
    '            {card.badge && (',
    '              <span',
    '                style={{',
    '                  color: PRIMARY_COLOR,',
    '                  background: `${PRIMARY_COLOR}18`,',
    '                  fontSize: 10,',
    '                  fontWeight: 600,',
    "                  padding: '2px 8px',",
    '                  borderRadius: 9999,',
    "                  display: 'inline-block',",
    '                  marginBottom: 8,',
    '                }}',
    '              >',
    '                {card.badge}',
    '              </span>',
    '            )}',
    "            <p style={{ fontSize: 14, fontWeight: 600, color: '#1f2937', margin: '0 0 4px' }}>",
    '              {card.title}',
    '            </p>',
    '            {card.description && (',
    "              <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>{card.description}</p>",
    '            )}',
    '          </button>',
    '        ))}',
    '      </div>',
    '      {selectedIdx !== null && (',
    '        <div',
    '          onClick={() => setSelectedIdx(null)}',
    '          style={{',
    "            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',",
    "            zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center',",
    '            padding: 16,',
    '          }}',
    '        >',
    '          <div',
    '            onClick={e => e.stopPropagation()}',
    '            style={{',
    "              background: 'white', borderRadius: 16, padding: 24,",
    "              width: '100%', maxWidth: 320, boxShadow: '0 20px 60px rgba(0,0,0,0.3)',",
    '            }}',
    '          >',
    "            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>",
    "              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1f2937', margin: 0, flex: 1 }}>",
    `                {${constName}[selectedIdx].title}`,
    '              </h3>',
    '              <button',
    '                onClick={() => setSelectedIdx(null)}',
    '                style={{',
    "                  background: 'none', border: 'none', cursor: 'pointer',",
    "                  fontSize: 22, color: '#9ca3af', lineHeight: 1, padding: '0 0 0 12px', flexShrink: 0,",
    '                }}',
    '              >',
    '                ×',
    '              </button>',
    '            </div>',
    `            {${constName}[selectedIdx].badge && (`,
    '              <span',
    '                style={{',
    '                  color: PRIMARY_COLOR, background: `${PRIMARY_COLOR}18`,',
    "                  fontSize: 12, fontWeight: 600, padding: '3px 10px',",
    "                  borderRadius: 9999, display: 'inline-block', marginBottom: 12,",
    '                }}',
    '              >',
    `                {${constName}[selectedIdx].badge}`,
    '              </span>',
    '            )}',
    `            {${constName}[selectedIdx].description ? (`,
    "              <p style={{ fontSize: 14, color: '#6b7280', margin: 0, lineHeight: 1.7 }}>",
    `                {${constName}[selectedIdx].description}`,
    '              </p>',
    '            ) : (',
    "              <p style={{ fontSize: 14, color: '#9ca3af', margin: 0 }}>상세 설명이 없습니다.</p>",
    '            )}',
    '          </div>',
    '        </div>',
    '      )}',
    '    </section>',
    '  )',
    '}'
  )

  return { constDecl, componentDecl: lines.join('\n'), componentName }
}

// ─── List ─────────────────────────────────────────────────────────────────────

function listCode(s: ListSection, idx: number): SectionCode {
  const componentName = `Section${idx}_List`
  const constName = `LIST_ITEMS_${idx}`
  const constDecl = `const ${constName}: Array<{ title: string; subtitle?: string; meta?: string; badge?: string }> = ${JSON.stringify(s.items ?? [], null, 2)}`

  const lines: string[] = [
    `function ${componentName}() {`,
    '  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)',
    '  return (',
    '    <section>',
  ]

  if (s.title) {
    lines.push(
      "      <h3 style={{ fontSize: 14, fontWeight: 600, color: '#374151', margin: '0 0 12px 4px' }}>",
      `        ${jxt(s.title)}`,
      '      </h3>'
    )
  }

  lines.push(
    '      <div',
    '        style={{',
    "          background: 'white',",
    '          borderRadius: 12,',
    "          border: '1px solid #f3f4f6',",
    "          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',",
    "          overflow: 'hidden',",
    '        }}',
    '      >',
    `        {${constName}.map((item, i) => (`,
    '          <button',
    '            key={i}',
    '            onClick={() => setSelectedIdx(i === selectedIdx ? null : i)}',
    '            style={{',
    "              width: '100%',",
    "              display: 'flex',",
    "              alignItems: 'center',",
    '              gap: 12,',
    "              padding: '14px 16px',",
    "              borderTop: i > 0 ? '1px solid #f9fafb' : 'none',",
    "              background: i === selectedIdx ? `${PRIMARY_COLOR}0d` : 'white',",
    "              border: 'none',",
    "              cursor: 'pointer',",
    "              textAlign: 'left',",
    '            }}',
    '          >',
    '            <div',
    '              style={{',
    '                width: 36,',
    '                height: 36,',
    "                borderRadius: '50%',",
    '                background: PRIMARY_COLOR,',
    "                display: 'flex',",
    "                alignItems: 'center',",
    "                justifyContent: 'center',",
    "                color: 'white',",
    '                fontSize: 12,',
    '                fontWeight: 700,',
    '                flexShrink: 0,',
    '              }}',
    '            >',
    "              {item.title?.[0] ?? '?'}",
    '            </div>',
    '            <div style={{ flex: 1, minWidth: 0 }}>',
    "              <p style={{ fontSize: 14, fontWeight: 500, color: '#1f2937', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>",
    '                {item.title}',
    '              </p>',
    '              {item.subtitle && (',
    "                <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>{item.subtitle}</p>",
    '              )}',
    '            </div>',
    "            {item.meta && <span style={{ fontSize: 12, color: '#9ca3af', flexShrink: 0 }}>{item.meta}</span>}",
    '            {item.badge && (',
    '              <span',
    '                style={{',
    '                  color: PRIMARY_COLOR,',
    '                  background: `${PRIMARY_COLOR}18`,',
    '                  fontSize: 10,',
    '                  fontWeight: 600,',
    "                  padding: '2px 6px',",
    '                  borderRadius: 9999,',
    '                  flexShrink: 0,',
    '                }}',
    '              >',
    '                {item.badge}',
    '              </span>',
    '            )}',
    '          </button>',
    '        ))}',
    '      </div>',
    '      {selectedIdx !== null && (',
    '        <div',
    '          style={{',
    '            marginTop: 10,',
    "            background: 'white',",
    '            borderRadius: 12,',
    "            padding: '14px 16px',",
    "            border: `1px solid ${PRIMARY_COLOR}40`,",
    "            boxShadow: `0 0 0 2px ${PRIMARY_COLOR}18`,",
    '          }}',
    '        >',
    "          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>",
    "            <p style={{ fontSize: 14, fontWeight: 600, color: '#1f2937', margin: 0 }}>",
    `              {${constName}[selectedIdx].title}`,
    '            </p>',
    '            <button',
    '              onClick={() => setSelectedIdx(null)}',
    '              style={{',
    "                background: 'none', border: 'none', cursor: 'pointer',",
    "                fontSize: 18, color: '#9ca3af', lineHeight: 1, padding: '0 0 0 8px',",
    '              }}',
    '            >',
    '              ×',
    '            </button>',
    '          </div>',
    `          {${constName}[selectedIdx].subtitle && (`,
    "            <p style={{ fontSize: 13, color: '#6b7280', margin: '4px 0 0' }}>",
    `              {${constName}[selectedIdx].subtitle}`,
    '            </p>',
    '          )}',
    `          {${constName}[selectedIdx].meta && (`,
    "            <p style={{ fontSize: 12, color: '#9ca3af', margin: '4px 0 0' }}>",
    `              {${constName}[selectedIdx].meta}`,
    '            </p>',
    '          )}',
    '        </div>',
    '      )}',
    '    </section>',
    '  )',
    '}'
  )

  return { constDecl, componentDecl: lines.join('\n'), componentName }
}

// ─── Form ─────────────────────────────────────────────────────────────────────

function formCode(s: FormSection, idx: number, storageKey: string): SectionCode {
  const componentName = `Section${idx}_Form`
  const constName = `FORM_FIELDS_${idx}`
  const constDecl = `const ${constName}: Array<{ label: string; type: string; placeholder?: string; required?: boolean; options?: string[] }> = ${JSON.stringify(s.fields ?? [], null, 2)}`

  const lines: string[] = [
    `function ${componentName}() {`,
    `  const FORM_KEY = ${JSON.stringify(storageKey)}`,
    '  const [textValues, setTextValues] = useState<Record<string, string>>({})',
    '  const [toggleValues, setToggleValues] = useState<Record<string, boolean>>({})',
    '  const [savedItems, setSavedItems] = useState<Array<Record<string, string>>>(() => {',
    "    if (typeof window === 'undefined') return []",
    "    try { return JSON.parse(localStorage.getItem(FORM_KEY) || '[]') } catch { return [] }",
    '  })',
    '  const [saved, setSaved] = useState(false)',
    '  const setVal = (label: string, v: string) => setTextValues(p => ({ ...p, [label]: v }))',
    '  const flipToggle = (label: string) => setToggleValues(p => ({ ...p, [label]: !p[label] }))',
    '  const handleSubmit = () => {',
    '    const entry: Record<string, string> = {}',
    `    ${constName}.forEach(f => {`,
    "      entry[f.label] = f.type === 'toggle' ? (toggleValues[f.label] ? '켜짐' : '꺼짐') : (textValues[f.label] ?? '')",
    '    })',
    '    const next = [...savedItems, entry]',
    '    setSavedItems(next)',
    '    localStorage.setItem(FORM_KEY, JSON.stringify(next))',
    '    setTextValues({})',
    '    setToggleValues({})',
    '    setSaved(true)',
    '    setTimeout(() => setSaved(false), 2000)',
    '  }',
    '  return (',
    '    <section',
    '      style={{',
    "        background: 'white',",
    '        borderRadius: 16,',
    '        padding: 20,',
    "        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',",
    "        border: '1px solid #f3f4f6',",
    '      }}',
    '    >',
  ]

  if (s.title) {
    lines.push(
      "      <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1f2937', margin: '0 0 16px' }}>",
      `        ${jxt(s.title)}`,
      '      </h3>'
    )
  }

  lines.push(
    "      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>",
    `        {${constName}.map((field, i) => (`,
    '          <div key={i}>',
    "            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#4b5563', marginBottom: 6 }}>",
    '              {field.label}',
    "              {field.required && <span style={{ color: '#f87171', marginLeft: 2 }}>*</span>}",
    '            </label>',
    "            {field.type === 'textarea' ? (",
    '              <textarea',
    '                placeholder={field.placeholder}',
    '                rows={3}',
    "                value={textValues[field.label] ?? ''}",
    '                onChange={e => setVal(field.label, e.target.value)}',
    '                style={{',
    "                  width: '100%',",
    '                  borderRadius: 12,',
    "                  border: '1px solid #e5e7eb',",
    "                  padding: '10px 12px',",
    '                  fontSize: 14,',
    "                  background: '#f9fafb',",
    "                  resize: 'none',",
    "                  boxSizing: 'border-box',",
    "                  outline: 'none',",
    '                }}',
    '              />',
    "            ) : field.type === 'select' ? (",
    '              <select',
    "                value={textValues[field.label] ?? field.options?.[0] ?? ''}",
    '                onChange={e => setVal(field.label, e.target.value)}',
    '                style={{',
    "                  width: '100%',",
    '                  borderRadius: 12,',
    "                  border: '1px solid #e5e7eb',",
    "                  padding: '10px 12px',",
    '                  fontSize: 14,',
    "                  background: '#f9fafb',",
    "                  boxSizing: 'border-box',",
    '                }}',
    '              >',
    "                {(field.options ?? (field.placeholder ? [field.placeholder] : ['선택하세요'])).map((opt, j) => (",
    '                  <option key={j} value={opt}>{opt}</option>',
    '                ))}',
    '              </select>',
    "            ) : field.type === 'toggle' ? (",
    '              <div',
    '                role="switch"',
    '                aria-checked={toggleValues[field.label] ?? false}',
    '                tabIndex={0}',
    '                onClick={() => flipToggle(field.label)}',
    "                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && flipToggle(field.label)}",
    "                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '4px 0' }}",
    '              >',
    "                <span style={{ fontSize: 14, color: '#4b5563' }}>",
    "                  {field.placeholder ?? '켜기 / 끄기'}",
    '                </span>',
    '                <div',
    '                  style={{',
    '                    width: 44,',
    '                    height: 24,',
    '                    borderRadius: 12,',
    "                    background: toggleValues[field.label] ? PRIMARY_COLOR : '#d1d5db',",
    "                    position: 'relative',",
    "                    transition: 'background 0.2s',",
    '                    flexShrink: 0,',
    '                  }}',
    '                >',
    '                  <div',
    '                    style={{',
    "                      position: 'absolute',",
    '                      top: 2,',
    '                      width: 20,',
    '                      height: 20,',
    '                      borderRadius: 10,',
    "                      background: 'white',",
    "                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',",
    "                      transition: 'transform 0.2s',",
    "                      transform: toggleValues[field.label] ? 'translateX(22px)' : 'translateX(2px)',",
    '                    }}',
    '                  />',
    '                </div>',
    '              </div>',
    '            ) : (',
    '              <input',
    '                type={field.type as React.HTMLInputTypeAttribute}',
    '                placeholder={field.placeholder}',
    "                value={textValues[field.label] ?? ''}",
    '                onChange={e => setVal(field.label, e.target.value)}',
    '                style={{',
    "                  width: '100%',",
    '                  borderRadius: 12,',
    "                  border: '1px solid #e5e7eb',",
    "                  padding: '10px 12px',",
    '                  fontSize: 14,',
    "                  background: '#f9fafb',",
    "                  boxSizing: 'border-box',",
    "                  outline: 'none',",
    '                }}',
    '              />',
    '            )}',
    '          </div>',
    '        ))}',
    '      </div>',
    '      <button',
    '        onClick={handleSubmit}',
    '        style={{',
    "          width: '100%',",
    '          background: PRIMARY_COLOR,',
    "          color: 'white',",
    "          border: 'none',",
    '          borderRadius: 12,',
    "          padding: '12px',",
    '          fontSize: 14,',
    '          fontWeight: 700,',
    "          cursor: 'pointer',",
    '          marginTop: 20,',
    '        }}',
    '      >',
    `        ${jxt(s.submitText ?? '제출')}`,
    '      </button>',
    '      {saved && (',
    '        <div',
    '          style={{',
    '            marginTop: 12,',
    "            padding: '10px 14px',",
    "            background: '#f0fdf4',",
    "            border: '1px solid #86efac',",
    '            borderRadius: 10,',
    '            fontSize: 13,',
    "            color: '#15803d',",
    '            fontWeight: 500,',
    '          }}',
    '        >',
    '          저장되었습니다 ✓',
    '        </div>',
    '      )}',
    '      {savedItems.length > 0 && (',
    '        <div style={{ marginTop: 20 }}>',
    "          <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 10, fontWeight: 500 }}>",
    '            {`저장된 항목 (${savedItems.length})`}',
    '          </p>',
    "          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>",
    '            {savedItems.map((item, i) => (',
    '              <div',
    '                key={i}',
    '                style={{',
    "                  background: '#f9fafb',",
    '                  borderRadius: 10,',
    "                  padding: '10px 14px',",
    "                  border: '1px solid #f3f4f6',",
    '                }}',
    '              >',
    '                {Object.entries(item).map(([k, v]) => (',
    '                  <div',
    '                    key={k}',
    "                    style={{ display: 'flex', gap: 8, fontSize: 12, color: '#374151', marginBottom: 3 }}",
    '                  >',
    "                    <span style={{ color: '#9ca3af', minWidth: 60 }}>{k}</span>",
    "                    <span style={{ fontWeight: 500 }}>{v || '—'}</span>",
    '                  </div>',
    '                ))}',
    '              </div>',
    '            ))}',
    '          </div>',
    '        </div>',
    '      )}',
    '    </section>',
    '  )',
    '}'
  )

  return { constDecl, componentDecl: lines.join('\n'), componentName }
}

// ─── Detail ───────────────────────────────────────────────────────────────────

function detailCode(s: DetailSection, idx: number): SectionCode {
  const componentName = `Section${idx}_Detail`
  const constName = `DETAIL_FIELDS_${idx}`
  const constDecl = `const ${constName}: Array<{ label: string; value: string }> = ${JSON.stringify(s.fields ?? [], null, 2)}`

  const lines: string[] = [
    `function ${componentName}() {`,
    '  return (',
    '    <section',
    '      style={{',
    "        background: 'white',",
    '        borderRadius: 16,',
    '        padding: 20,',
    "        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',",
    "        border: '1px solid #f3f4f6',",
    '      }}',
    '    >',
    "      <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1f2937', margin: '0 0 16px' }}>",
    `        ${jxt(s.title || '상세 정보')}`,
    '      </h3>',
    "      <dl style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>",
    `        {${constName}.map((field, i) => (`,
    "          <div key={i} style={{ display: 'flex', gap: 12 }}>",
    "            <dt style={{ fontSize: 12, color: '#9ca3af', width: 80, flexShrink: 0, paddingTop: 2 }}>",
    '              {field.label}',
    '            </dt>',
    "            <dd style={{ fontSize: 14, color: '#1f2937', fontWeight: 500, margin: 0 }}>",
    '              {field.value}',
    '            </dd>',
    '          </div>',
    '        ))}',
    '      </dl>',
    '    </section>',
    '  )',
    '}',
  ]

  return { constDecl, componentDecl: lines.join('\n'), componentName }
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

function chatCode(s: ChatSection, idx: number, storageKey: string): SectionCode {
  const componentName = `Section${idx}_Chat`
  const constName = `INITIAL_MESSAGES_${idx}`
  const constDecl = `const ${constName}: Array<{ sender: 'user' | 'bot'; text: string }> = ${JSON.stringify(s.messages ?? [], null, 2)}`

  const lines: string[] = [
    `function ${componentName}() {`,
    `  const CHAT_KEY = ${JSON.stringify(storageKey)}`,
    "  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>(() => {",
    "    if (typeof window === 'undefined') return " + constName,
    '    try {',
    '      const stored = localStorage.getItem(CHAT_KEY)',
    `      return stored ? JSON.parse(stored) : ${constName}`,
    '    } catch { return ' + constName + ' }',
    '  })',
    "  const [input, setInput] = useState('')",
    '  const listRef = useRef<HTMLDivElement>(null)',
    '  useEffect(() => {',
    '    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight',
    '  }, [messages.length])',
    '  const handleSend = () => {',
    '    const text = input.trim()',
    '    if (!text) return',
    "    const next = [...messages, { sender: 'user' as const, text }]",
    '    setMessages(next)',
    '    localStorage.setItem(CHAT_KEY, JSON.stringify(next))',
    "    setInput('')",
    '  }',
    '  return (',
    '    <section',
    '      style={{',
    "        background: 'white',",
    '        borderRadius: 16,',
    "        border: '1px solid #f3f4f6',",
    "        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',",
    "        overflow: 'hidden',",
    '      }}',
    '    >',
  ]

  if (s.title) {
    lines.push(
      "      <div style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6' }}>",
      "        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1f2937', margin: 0 }}>",
      `          ${jxt(s.title)}`,
      '        </h3>',
      '      </div>'
    )
  }

  lines.push(
    '      <div',
    '        ref={listRef}',
    '        style={{',
    "          padding: '12px 16px',",
    '          minHeight: 100,',
    '          maxHeight: 260,',
    "          overflowY: 'auto',",
    "          display: 'flex',",
    "          flexDirection: 'column',",
    '          gap: 12,',
    '        }}',
    '      >',
    '        {messages.map((msg, i) => {',
    "          const isUser = msg.sender === 'user'",
    '          return (',
    '            <div',
    '              key={i}',
    "              style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 8 }}",
    '            >',
    '              <div',
    '                style={{',
    "                  background: isUser ? PRIMARY_COLOR : '#f3f4f6',",
    "                  color: isUser ? 'white' : '#1f2937',",
    '                  borderRadius: 16,',
    "                  padding: '8px 14px',",
    "                  maxWidth: '72%',",
    '                  fontSize: 14,',
    '                  lineHeight: 1.5,',
    '                }}',
    '              >',
    '                {msg.text}',
    '              </div>',
    '            </div>',
    '          )',
    '        })}',
    '      </div>',
    '      <div',
    "        style={{ padding: '10px 12px', borderTop: '1px solid #f3f4f6', display: 'flex', gap: 8, alignItems: 'center' }}",
    '      >',
    '        <input',
    `          placeholder={${JSON.stringify(s.inputPlaceholder ?? '메시지를 입력하세요…')}}`,
    '          value={input}',
    '          onChange={e => setInput(e.target.value)}',
    "          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}",
    '          style={{',
    '            flex: 1,',
    '            borderRadius: 9999,',
    "            border: '1px solid #e5e7eb',",
    "            padding: '6px 16px',",
    '            fontSize: 14,',
    "            background: '#f9fafb',",
    "            outline: 'none',",
    '          }}',
    '        />',
    '        <button',
    '          onClick={handleSend}',
    '          aria-label="전송"',
    '          style={{',
    '            background: PRIMARY_COLOR,',
    "            color: 'white',",
    "            border: 'none',",
    '            borderRadius: 9999,',
    '            width: 36,',
    '            height: 36,',
    "            display: 'flex',",
    "            alignItems: 'center',",
    "            justifyContent: 'center',",
    "            cursor: 'pointer',",
    '            flexShrink: 0,',
    '            fontSize: 14,',
    '          }}',
    '        >',
    '          ▶',
    '        </button>',
    '      </div>',
    '    </section>',
    '  )',
    '}'
  )

  return { constDecl, componentDecl: lines.join('\n'), componentName }
}

// ─── Router ───────────────────────────────────────────────────────────────────

function sectionToCode(section: UISection, idx: number, appSlug: string): SectionCode {
  switch (section.type) {
    case 'Hero':
      return heroCode(section, idx)
    case 'CardGrid':
      return cardGridCode(section, idx)
    case 'List':
      return listCode(section, idx)
    case 'Form':
      return formCode(section, idx, `mwab_${appSlug}_form_${idx}`)
    case 'Detail':
      return detailCode(section, idx)
    case 'Chat':
      return chatCode(section, idx, `mwab_${appSlug}_chat_${idx}`)
    default: {
      const _exhaustive: never = section
      void _exhaustive
      return { constDecl: null, componentDecl: '', componentName: '' }
    }
  }
}

// ─── Main assembler ───────────────────────────────────────────────────────────

function makeFallbackSections(appName: string): UISection[] {
  return [
    {
      type: 'Hero',
      title: `${appName}에 오신 것을 환영합니다`,
      subtitle: `${appName}를 소개합니다.`,
      ctaText: '시작하기',
    },
    {
      type: 'List',
      title: '주요 기능',
      items: [
        { title: '핵심 기능 1', subtitle: '앱의 주요 기능입니다', badge: 'NEW' },
        { title: '핵심 기능 2', subtitle: '편리한 기능을 제공합니다' },
        { title: '핵심 기능 3', subtitle: '언제 어디서나 사용 가능합니다' },
      ],
    },
  ]
}

export function schemaToTsx(schema: UISchema): string {
  const appName = schema.appName ?? 'MyApp'
  const compName = toComponentName(appName) + 'App'
  const color = schema.theme?.primaryColor ?? '#6366f1'
  const rawSections = schema.sections ?? []
  const sections: UISection[] = rawSections.length > 0 ? rawSections : makeFallbackSections(appName)
  const appSlug = toAppSlug(appName)

  const needsState = sections.some(
    (s) => s.type === 'CardGrid' || s.type === 'List' || s.type === 'Form' || s.type === 'Chat'
  )
  const needsRef = sections.some((s) => s.type === 'Chat')
  const needsEffect = sections.some((s) => s.type === 'Chat')

  const hookImports = [
    needsState ? 'useState' : null,
    needsRef ? 'useRef' : null,
    needsEffect ? 'useEffect' : null,
  ].filter((h): h is string => h !== null)

  const reactImport =
    hookImports.length > 0
      ? `import React, { ${hookImports.join(', ')} } from 'react'`
      : "import React from 'react'"

  const constDecls: string[] = []
  const componentDecls: string[] = []
  const componentNames: string[] = []

  sections.forEach((section, idx) => {
    const { constDecl, componentDecl, componentName } = sectionToCode(section, idx, appSlug)
    if (constDecl) constDecls.push(constDecl)
    if (componentDecl && componentName) {
      componentDecls.push(componentDecl)
      componentNames.push(componentName)
    }
  })

  const parts: string[] = [
    "'use client'",
    '',
    reactImport,
    '',
    '// Generated by MyWebAppBuilder',
    '//',
    '// [사용 안내] 이 파일은 단독 실행 파일이 아닙니다.',
    '// react, next, typescript 의존성이 있는 프로젝트 폴더 안에 넣어야 정상 인식됩니다.',
    '// 예시 경로: src/components/GeneratedApp.tsx',
    '// ZIP 다운로드로 바로 실행 가능한 Next.js 프로젝트 전체를 받을 수 있습니다.',
    '',
    `const PRIMARY_COLOR = ${JSON.stringify(color)}`,
  ]

  if (constDecls.length > 0) {
    parts.push('', ...constDecls)
  }

  componentDecls.forEach((decl) => parts.push('', decl))

  parts.push(
    '',
    `export default function ${compName}() {`,
    '  return (',
    "    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>",
    '      <header',
    '        style={{',
    '          backgroundColor: PRIMARY_COLOR,',
    "          padding: '12px 16px',",
    "          display: 'flex',",
    "          alignItems: 'center',",
    '        }}',
    '      >',
    `        <h1 style={{ color: 'white', fontSize: 15, fontWeight: 700, margin: 0 }}>{${JSON.stringify(appName)}}</h1>`,
    '      </header>',
    "      <main style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>",
    ...componentNames.map((name) => `        <${name} />`),
    '      </main>',
    '    </div>',
    '  )',
    '}'
  )

  return parts.join('\n')
}
