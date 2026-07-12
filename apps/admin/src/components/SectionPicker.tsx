interface Section {
  id: string
  name: string
  slug: string
  color_hex: string
  description: string | null
}

interface Props {
  sections: Section[]
  onSelect: (section: Section) => void
}

export default function SectionPicker({ sections, onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => onSelect(section)}
          className="card group text-left hover:border-primary-300 hover:shadow-md transition-all"
        >
          <div
            className="mb-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
            style={{ backgroundColor: section.color_hex }}
          >
            {section.name}
          </div>
          {section.description && (
            <p className="text-sm text-surface-500">{section.description}</p>
          )}
        </button>
      ))}
    </div>
  )
}
