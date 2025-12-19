type Props = {
  selected: string
  onSelect: (value: string) => void
  menuOptions: any[]
}

export default function CoverageSidebar({ menuOptions, selected, onSelect }: Props) {
  return (
    <aside className="w-72 bg-white shadow">
      <h2 className="p-4 font-semibold text-lg">Coverage</h2>

      <ul>
        {menuOptions.map((item, index) => {
          const benefitType = item.benefit_type || item
          return (
            <li
              key={index}
              onClick={() => onSelect(benefitType)}
              className={`px-4 py-3 cursor-pointer transition ${
                selected === benefitType
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'hover:bg-gray-100'
              }`}
            >
              {benefitType}
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
