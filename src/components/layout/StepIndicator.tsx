const STEPS = ['아이디어', '추가 질문', '기획서', '화면 목록', '미리보기']

interface StepIndicatorProps {
  currentStep: number // 0-based
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <ol className="flex items-center gap-0 w-full max-w-lg mx-auto mb-10">
      {STEPS.map((label, i) => {
        const isDone = i < currentStep
        const isActive = i === currentStep

        return (
          <li key={label} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <span
                className={[
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2',
                  isDone
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : isActive
                      ? 'border-indigo-600 text-indigo-600 bg-white'
                      : 'border-gray-300 text-gray-300 bg-white',
                ].join(' ')}
              >
                {isDone ? '✓' : i + 1}
              </span>
              <span
                className={[
                  'mt-1 text-[10px] whitespace-nowrap',
                  isActive ? 'text-indigo-600 font-medium' : 'text-gray-400',
                ].join(' ')}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={[
                  'flex-1 h-0.5 mb-4 mx-1',
                  isDone ? 'bg-indigo-600' : 'bg-gray-200',
                ].join(' ')}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
