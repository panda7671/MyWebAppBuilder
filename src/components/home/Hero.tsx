import { HERO_CONTENT } from './home-content'

interface HeroProps {
  onStart: () => void
}

export default function Hero({ onStart }: HeroProps) {
  return (
    <section className="w-full max-w-2xl text-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
        {HERO_CONTENT.title}
      </h1>
      <p className="text-base sm:text-lg text-gray-500 leading-relaxed mb-8">
        {HERO_CONTENT.description}
      </p>
      <button
        onClick={onStart}
        className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-7 py-3 text-base font-medium text-white hover:bg-indigo-700 transition-colors"
      >
        {HERO_CONTENT.cta}
      </button>
      <p className="mt-4 text-sm text-gray-400">{HERO_CONTENT.trustLine}</p>
    </section>
  )
}
