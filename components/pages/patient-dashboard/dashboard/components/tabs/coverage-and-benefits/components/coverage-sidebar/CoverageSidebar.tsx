type Props = {
  selected: string
  onSelect: (value: string) => void
}

const items = [
  'Professional (Physician) Visit - Office',
  'Emergency Services',
  'Chiropractic',
  'Hospital',
  'Hospital - Outpatient',
  'Medical Care',
  'Mental Health',
  'Urgent Care',
  'Vision (Optometry)',
]

export default function CoverageSidebar({ selected, onSelect }: Props) {
  return (
    <aside className="w-72 bg-white border-r">
      <h2 className="p-4 font-semibold text-lg">Coverage</h2>

      <ul>
        {items.map(item => (
          <li
            key={item}
            onClick={() => onSelect(item)}
            className={`px-4 py-3 cursor-pointer transition ${
              selected === item ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-100'
            }`}
          >
            {item}
          </li>
        ))}
      </ul>
    </aside>
  )
}
