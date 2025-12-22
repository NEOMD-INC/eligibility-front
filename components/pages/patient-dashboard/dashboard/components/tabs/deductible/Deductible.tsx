'use client'

import ProgressCard from '@/components/ui/cards/ProgressCard/ProgressCard'

export default function Deductible({ deductiblesData }: any) {
  const deductibleData1 =
    deductiblesData?.map((item: any) => {
      const messages = item.messages || []
      const remaining = item.deductible?.remaining || 0
      const met = item.deductible?.met || 0
      const total = item.deductible?.total || 0

      return {
        title: item.benefit_type,
        value: `$${remaining} Remaining`,
        used: met,
        total: total,
        footer: 'Resets on 12/31/2024',
        additionalInfo: {
          timePeriod: 'Year to Date',
          notes: messages[1],
        },
      }
    }) || []

  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Deductible</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {deductibleData1.map((deductible, index) => (
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
