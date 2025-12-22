type Props = {
  selected: string
  onSelect: (value: string) => void
  menuOptions: any[]
}

export default function CoverageSidebar({ menuOptions, selected, onSelect }: Props) {
  const getBenefitKey = (item: any) => {
    if (typeof item === 'string') return item
    return `${item.benefit_type}_${item.service_type_code}_${item.coverage_level_code}`
  }

  return (
    <aside className="w-72 bg-white shadow">
      <h2 className="p-4 font-semibold text-lg">Coverage</h2>

      <ul>
        {menuOptions.map((item, index) => {
          const benefitType = item.benefit_type || item
          const uniqueKey = getBenefitKey(item)
          const isSelected = selected === uniqueKey

          return (
            <li
              key={uniqueKey || index}
              onClick={() => onSelect(uniqueKey)}
              className={`px-4 py-3 cursor-pointer transition ${
                isSelected ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-100'
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
