'use client'

export function SharePrompt() {
  const handleShare = async () => {
    const shareText = 'Protektahan ang pamilya mo sa mga scam! Try ScamGuard PH - AI-powered scam detector in Filipino.'
    const shareUrl = typeof window !== 'undefined' ? window.location.origin : ''

    if (navigator.share) {
      try {
        await navigator.share({ title: 'ScamGuard PH', text: shareText, url: shareUrl })
      } catch {
        // cancelled
      }
    } else {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
      alert('Link copied!')
    }
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
      <p className="text-xs text-gray-600 mb-2">
        May kakilala ka bang natatarget ng scam? I-share mo ang ScamGuard!
      </p>
      <button
        onClick={handleShare}
        className="bg-blue-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-blue-700 transition-colors"
      >
        I-share sa Family & Friends
      </button>
    </div>
  )
}
