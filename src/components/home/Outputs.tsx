import { OUTPUT_ITEMS } from './home-content'

export default function Outputs() {
  return (
    <section className="w-full max-w-3xl">
      <h2 className="text-xl font-bold text-gray-900 text-center mb-2">결과물로 이런 걸 받아요</h2>
      <p className="text-sm text-gray-500 text-center mb-8">
        기획부터 다운로드 가능한 코드까지 한 번에 만들어집니다.
      </p>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {OUTPUT_ITEMS.map((item) => (
          <li
            key={item.title}
            className="flex items-start gap-3 rounded-xl bg-white border border-gray-100 px-4 py-4 shadow-sm"
          >
            <span className="text-2xl" aria-hidden="true">
              {item.emoji}
            </span>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-0.5">{item.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
