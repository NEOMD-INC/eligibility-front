'use client'

import InfoCard from '@/components/ui/cards/InfoCard/InfoCard'

interface CopayItem {
  title: string
  value: string | number | any
  coverage_level: string | any
  subtitle: string
  footer: string
  messages: string[] | string
  additionalInfo: {
    timePeriod: string
    notes: string[] | string
  }
}
interface RawCopayData {
  benefit_type: string
  copay_value: string | number
  coverage_level: string | any
  messages: (string | string[])[]
}

export default function Copay({ copaysData }: any) {
  const copayData1: CopayItem[] =
    copaysData?.map((item: RawCopayData) => ({
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
            additionalInfo={copay.additionalInfo as {}}
          />
        ))}
      </div>
    </div>
  )
}
