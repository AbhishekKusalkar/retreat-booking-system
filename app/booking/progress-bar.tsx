interface ProgressBarProps {
  current: number
  total: number
  steps: string[]
}

export function ProgressBar({ current, total, steps }: ProgressBarProps) {
  return (
    <div className="w-full bg-white shadow-sm border-b border-border">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step} className="flex flex-1 items-center">
              <div className="relative flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold text-sm transition-colors ${
                    index < current
                      ? "bg-primary text-white"
                      : index === current
                        ? "bg-primary text-white ring-2 ring-secondary ring-offset-2"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {index < current ? "✓" : index + 1}
                </div>
                <div className="mt-2 text-xs font-medium text-gray-600 text-center">{step}</div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-2 transition-colors ${index < current - 1 ? "bg-primary" : "bg-gray-200"}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
