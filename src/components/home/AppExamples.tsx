import { APP_EXAMPLES } from './home-content'

export default function AppExamples() {
  return (
    <section className="w-full max-w-3xl">
      <h2 className="text-xl font-bold text-gray-900 text-center mb-2">이런 앱을 만들 수 있어요</h2>
      <p className="text-sm text-gray-500 text-center mb-8">
        아래 예시처럼, 떠오르는 아이디어를 그대로 적어보세요.
      </p>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {APP_EXAMPLES.map((example) => (
          <li
            key={example.label}
            className="flex items-center gap-3 rounded-xl bg-white border border-gray-100 px-4 py-3 shadow-sm"
          >
            <span className="text-2xl" aria-hidden="true">
              {example.emoji}
            </span>
            <div>
              <p className="text-sm font-semibold text-gray-900">{example.label}</p>
              <p className="text-xs text-gray-500">{example.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
