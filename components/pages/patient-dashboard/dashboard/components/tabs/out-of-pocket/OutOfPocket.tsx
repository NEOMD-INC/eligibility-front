'use client'

import ProgressCard from '@/components/ui/cards/ProgressCard/ProgressCard'

export default function OutOfPocket({ outOfPocketData }: any) {
  const outOfPocketData1 =
    outOfPocketData?.map((item: any) => {
      const messages = item.messages || []
      const remaining = item.out_of_pocket?.remaining || 0
      const met = item.out_of_pocket?.met || 0
      const total = item.out_of_pocket?.total || 0

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
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Out of Pocket</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {outOfPocketData1.map((outOfPocket, index) => (
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
