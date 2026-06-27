import { HOW_IT_WORKS_STEPS } from './home-content'

export default function HowItWorks() {
  return (
    <section className="w-full max-w-3xl">
      <h2 className="text-xl font-bold text-gray-900 text-center mb-2">이렇게 만들어요</h2>
      <p className="text-sm text-gray-500 text-center mb-8">
        다섯 단계만 따라오면 앱 초안이 완성됩니다.
      </p>

      <ol className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        {HOW_IT_WORKS_STEPS.map((step, i) => (
          <li
            key={step.title}
            className="flex sm:flex-col items-start sm:items-center gap-3 sm:text-center"
          >
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
              {i + 1}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">{step.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
