'use client'

import { useState } from 'react'

export function ReportButton() {
  const [reported, setReported] = useState(false)

  if (reported) {
    return (
      <p className="text-xs text-gray-500 text-center py-1.5">
        Salamat sa feedback mo! Nakakatulong ito para ma-improve ang ScamGuard.
      </p>
    )
  }

  return (
    <div className="flex items-center justify-center gap-2 py-1.5">
      <span className="text-xs text-gray-500">Tama ba ang result?</span>
      <button
        onClick={() => setReported(true)}
        className="text-xs font-medium bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 transition-colors"
      >
        Oo
      </button>
      <button
        onClick={() => setReported(true)}
        className="text-xs font-medium bg-red-100 text-red-700 px-3 py-1 rounded-full hover:bg-red-200 transition-colors"
      >
        Hindi
      </button>
    </div>
  )
}
