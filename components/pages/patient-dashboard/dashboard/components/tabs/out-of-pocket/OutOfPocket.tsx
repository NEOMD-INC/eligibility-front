'use client'

import ProgressCard from '@/components/ui/cards/ProgressCard/ProgressCard'

const outOfPocketData = [
  {
    title: 'Health Benefit Plan Coverage',
    value: '$5000 Remaining',
    used: 6000,
    total: 11000,
    footer: 'Resets on 12/31/2024',
    additionalInfo: {
      timePeriod: 'Year to Date',
      notes: 'Amounts apply to in-network and out-of-network',
    },
  },
  {
    title: 'Hospital - Outpatient',
    value: '$3000 Remaining',
    used: 7000,
    total: 10000,
    footer: 'Resets on 12/31/2024',
    additionalInfo: {
      timePeriod: 'Year to Date',
      notes: 'Amounts apply to in-network and out-of-network',
    },
  },
  {
    title: 'Emergency Services',
    value: '$4000 Remaining',
    used: 6000,
    total: 10000,
    footer: 'Resets on 12/31/2024',
    additionalInfo: {
      timePeriod: 'Year to Date',
      notes: 'Amounts apply to in-network and out-of-network',
    },
  },
  {
    title: 'Hospital Outpatient',
    value: '$6000 Remaining',
    used: 4000,
    total: 10000,
    footer: 'Resets on 12/31/2024',
    additionalInfo: {
      timePeriod: 'Year to Date',
      notes: 'Amounts apply to in-network and out-of-network',
    },
  },
  {
    title: 'Chiropractic',
    value: '$7000 Remaining',
    used: 3000,
    total: 10000,
    footer: 'Resets on 12/31/2024',
    additionalInfo: {
      timePeriod: 'Year to Date',
      notes: 'Amounts apply to in-network and out-of-network',
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
      notes: 'Amounts apply to in-network and out-of-network',
    },
  },
]

export default function OutOfPocket() {
  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Out of Pocket</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {outOfPocketData.map((outOfPocket, index) => (
          <ProgressCard
            key={index}
            title={outOfPocket.title}
            value={outOfPocket.value}
            used={outOfPocket.used}
            total={outOfPocket.total}
            footer={outOfPocket.footer}
            additionalInfo={outOfPocket.additionalInfo}
          />
        ))}
      </div>
    </div>
  )
}

