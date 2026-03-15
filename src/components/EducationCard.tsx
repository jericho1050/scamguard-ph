interface EducationCardProps {
  card: {
    title: string
    content: string
  }
}

export function EducationCard({ card }: EducationCardProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
          AI Learn
        </span>
        <span className="text-sm font-semibold text-blue-900">{card.title}</span>
      </div>
      <p className="text-sm text-blue-800 leading-relaxed">{card.content}</p>
    </div>
  )
}
