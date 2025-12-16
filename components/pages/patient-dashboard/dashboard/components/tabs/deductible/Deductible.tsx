'use client'

import ProgressCard from '@/components/ui/cards/ProgressCard/ProgressCard'

const deductibleData = [
  {
    title: 'Health Benefit Plan Coverage',
    value: '$6000 Remaining',
    used: 6000,
    total: 12000,
    footer: 'Resets on 12/31/2024',
    additionalInfo: {
      timePeriod: 'Year to Date',
      notes: 'All In-Network Providers :: DED INCLUDED IN OOP',
    },
  },
  {
    title: 'Hospital - Outpatient',
    value: '$2000 Remaining',
    used: 6000,
    total: 8000,
    footer: 'Resets on 12/31/2024',
    additionalInfo: {
      timePeriod: 'Year to Date',
      notes: 'All In-Network Providers :: DED INCLUDED IN OOP',
    },
  },
  {
    title: 'Emergency Services',
    value: '$5000 Remaining',
    used: 5000,
    total: 10000,
    footer: 'Resets on 12/31/2024',
    additionalInfo: {
      timePeriod: 'Year to Date',
      notes: 'All In-Network Providers :: DED INCLUDED IN OOP',
    },
  },
  {
    title: 'Hospital Outpatient',
    value: '$7000 Remaining',
    used: 3000,
    total: 10000,
    footer: 'Resets on 12/31/2024',
    additionalInfo: {
      timePeriod: 'Year to Date',
      notes: 'All In-Network Providers :: DED INCLUDED IN OOP',
    },
  },
  {
    title: 'Chiropractic',
    value: '$8000 Remaining',
    used: 2000,
    total: 10000,
    footer: 'Resets on 12/31/2024',
    additionalInfo: {
      timePeriod: 'Year to Date',
      notes: 'All In-Network Providers :: DED INCLUDED IN OOP',
    },
  },
  {
    title: 'Mental Health',
    value: '$2000 Remaining',
    used: 8000,
    total: 10000,
    footer: 'Resets on 12/31/2024',
    additionalInfo: {
      timePeriod: 'Year to Date',
      notes: 'All In-Network Providers :: DED INCLUDED IN OOP',
    },
  },
]

export default function Deductible() {
  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Deductible</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {deductibleData.map((deductible, index) => (
          <ProgressCard
            key={index}
            title={deductible.title}
            value={deductible.value}
            used={deductible.used}
            total={deductible.total}
            footer={deductible.footer}
            additionalInfo={deductible.additionalInfo}
          />
        ))}
      </div>
    </div>
  )
}

