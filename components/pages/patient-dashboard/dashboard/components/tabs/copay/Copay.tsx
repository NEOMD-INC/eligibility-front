'use client'

import InfoCard from '@/components/ui/cards/InfoCard/InfoCard'

export default function Copay({ copaysData }: any) {
  const copayData1 =
    copaysData?.map((item: any) => ({
      title: item.benefit_type,
      value: item.copay_value,
      coverage_level: item.coverage_level,
      subtitle: item.messages[2],
      footer: 'Per Visit',
      messages: item.messages[1] || [],
      additionalInfo: {
        timePeriod: 'Per Visit',
        notes: item.messages[1],
      },
    })) || []
  return (
    <div className="p-6 bg-gray-50 min-h-[500px]">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Copay</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {copayData1.map((copay, index) => (
          <InfoCard
            key={index}
            title={copay.title}
            value={copay.value}
            coverage_level={copay.coverage_level}
            subtitle={copay.subtitle}
            footer={copay.footer}
            additionalInfo={copay.additionalInfo}
          />
        ))}
      </div>
    </div>
  )
}
