import { LIMITATIONS } from './home-content'

export default function Limitations() {
  return (
    <section className="w-full max-w-2xl">
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-5">
        <h2 className="text-sm font-semibold text-amber-800 mb-3 flex items-center gap-2">
          <span aria-hidden="true">ℹ️</span>
          지금은 여기까지 제공해요
        </h2>
        <ul className="space-y-2">
          {LIMITATIONS.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-amber-900/80">
              <span
                className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-amber-400"
                aria-hidden="true"
              />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
