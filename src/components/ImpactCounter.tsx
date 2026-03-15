'use client'

const stats = [
  { label: 'Messages Checked', value: 1247 },
  { label: 'Scams Detected', value: 892 },
  { label: 'Filipinos Educated about AI', value: 1247 },
]

export function ImpactCounter() {
  return (
    <section className="py-16 px-4 bg-blue-600 text-white">
      <h2 className="text-2xl font-bold text-center mb-10">
        Impact
      </h2>
      <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-3xl md:text-4xl font-bold">
              {stat.value.toLocaleString()}
            </div>
            <div className="text-xs text-blue-200 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
