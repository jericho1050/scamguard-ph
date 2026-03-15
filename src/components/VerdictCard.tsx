import type { AnalysisResult } from '@/lib/types'

const verdictConfig = {
  scam: {
    bg: 'bg-red-50 border-red-200',
    badge: 'bg-red-600',
    label: 'SCAM DETECTED',
    icon: (
      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
      </svg>
    ),
  },
  suspicious: {
    bg: 'bg-amber-50 border-amber-200',
    badge: 'bg-amber-500',
    label: 'SUSPICIOUS',
    icon: (
      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
      </svg>
    ),
  },
  safe: {
    bg: 'bg-green-50 border-green-200',
    badge: 'bg-green-600',
    label: 'MUKHANG SAFE',
    icon: (
      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
}

export function VerdictCard({ result }: { result: AnalysisResult }) {
  const config = verdictConfig[result.verdict]

  return (
    <div className={`${config.bg} border rounded-xl p-4`}>
      <div className="flex items-center gap-2 mb-2.5">
        <span className={`${config.badge} w-7 h-7 rounded-full flex items-center justify-center`}>
          {config.icon}
        </span>
        <span className="font-bold text-sm text-gray-900">{config.label}</span>
        <span className="text-xs text-gray-500 ml-auto font-medium">{result.confidence}% confidence</span>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">{result.explanation}</p>
      {result.redFlags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {result.redFlags.map((flag) => (
            <span
              key={flag}
              className="bg-white/80 border border-gray-200 text-[11px] px-2 py-0.5 rounded-full text-gray-600 font-medium"
            >
              {flag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
