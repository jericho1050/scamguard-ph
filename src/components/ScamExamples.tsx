const examples = [
  {
    category: 'GCash/Maya Phishing',
    text: '"Your GCash account has been flagged for suspicious activity. Verify now: gcash-verify.ph.com"',
    tip: 'Hindi magse-send ang GCash ng link sa text. Pumunta ka directly sa GCash app.',
    color: 'red',
  },
  {
    category: 'Government Impersonation',
    text: '"DSWD Ayuda: Ikaw ay napili bilang beneficiary. I-click ang link para ma-claim ang P10,000."',
    tip: 'Hindi magse-send ang gobyerno ng ayuda links sa text o Messenger.',
    color: 'orange',
  },
  {
    category: 'Job Scam',
    text: '"Hiring! Work from home, earn P5,000/day. No experience needed. Send your name and address."',
    tip: 'Kung too good to be true ang sahod at walang interview, scam yan.',
    color: 'yellow',
  },
  {
    category: 'Prize/Lottery Scam',
    text: '"Congratulations! Nanalo ka ng P100,000 sa Globe promo. Send your GCash number to claim."',
    tip: 'Hindi hihingi ng GCash number ang legit na promo para mag-claim.',
    color: 'purple',
  },
]

const colorMap: Record<string, string> = {
  red: 'border-red-200 bg-red-50',
  orange: 'border-orange-200 bg-orange-50',
  yellow: 'border-yellow-200 bg-yellow-50',
  purple: 'border-purple-200 bg-purple-50',
}

const badgeMap: Record<string, string> = {
  red: 'bg-red-100 text-red-700',
  orange: 'bg-orange-100 text-orange-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  purple: 'bg-purple-100 text-purple-700',
}

export function ScamExamples() {
  return (
    <section className="py-16 px-4" id="examples">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
        Mga Common na Scam sa Pilipinas
      </h2>
      <p className="text-sm text-gray-500 text-center mb-10">
        Alamin ang mga patterns para ma-protect ang sarili mo at pamilya mo
      </p>
      <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {examples.map((ex) => (
          <div key={ex.category} className={`border rounded-xl p-4 ${colorMap[ex.color]}`}>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${badgeMap[ex.color]}`}>
              {ex.category}
            </span>
            <p className="text-sm text-gray-700 mt-3 italic leading-relaxed">{ex.text}</p>
            <div className="mt-3 pt-3 border-t border-gray-200/50">
              <p className="text-xs text-gray-600">
                <span className="font-semibold text-green-700">Tip:</span> {ex.tip}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
