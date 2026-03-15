export function AboutSection() {
  return (
    <section className="py-16 px-4 bg-gray-50" id="about">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">About ScamGuard PH</h2>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          ScamGuard PH is an AI-powered scam detection tool built by Filipino youth to protect
          communities from online fraud. Every scam check doubles as an AI literacy lesson —
          teaching Filipinos how artificial intelligence works, one scam at a time.
        </p>
        <p className="text-sm text-gray-600 mb-8 leading-relaxed">
          Built for the{' '}
          <span className="font-semibold">AIRA Youth Challenge 2026</span>, supported by the
          ASEAN Foundation and Google.org. Addressing{' '}
          <span className="font-semibold">Stronger Communities</span> and{' '}
          <span className="font-semibold">Knowledge, Skills & Learning</span>.
        </p>
        <div className="flex items-center justify-center gap-3 text-xs text-gray-400">
          <span>AIRA Youth Challenge 2026</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full" />
          <span>ASEAN Foundation</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full" />
          <span>Google.org</span>
        </div>
      </div>
    </section>
  )
}
