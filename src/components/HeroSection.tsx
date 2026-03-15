export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-600 to-blue-700 text-white">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTMwVjBoLTEydjRoMTJ6TTI0IDI0aDEydi0ySDI0djJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
      <div className="relative max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm mb-6">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          AIRA Youth Challenge 2026
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          ScamGuard <span className="text-blue-200">PH</span>
        </h1>
        <p className="text-lg md:text-xl text-blue-100 mb-3 font-medium">
          Protektahan ang pamilya mo sa mga online scam.
        </p>
        <p className="text-sm text-blue-200 max-w-md mx-auto mb-8">
          I-paste ang kahina-hinalang message at alamin kung scam ito — sa Taglish, gamit ang AI. Matututo ka pa kung paano gumagana ang AI.
        </p>
        <a
          href="#chat"
          className="inline-block bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg shadow-blue-900/20"
        >
          I-check ang Suspicious Message
        </a>
      </div>
    </section>
  )
}
