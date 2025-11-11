import type React from "react"

interface ScreenProps {
  children: React.ReactNode
}

export function Screen({ children }: ScreenProps) {
  return (
    <div className="relative mx-[60px] h-screen">
      {/* Cross pattern borders */}
      <div className="absolute inset-y-0 -left-[60px] w-[60px] flex flex-col justify-between py-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <svg key={i} width="24" height="24" viewBox="0 0 24 24" className="mx-auto text-gray-300 dark:text-gray-700">
            <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ))}
      </div>
      <div className="absolute inset-y-0 -right-[60px] w-[60px] flex flex-col justify-between py-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <svg key={i} width="24" height="24" viewBox="0 0 24 24" className="mx-auto text-gray-300 dark:text-gray-700">
            <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ))}
      </div>
      <div className="relative z-10 h-screen flex flex-col bg-white dark:bg-gray-900">{children}</div>
    </div>
  )
}
