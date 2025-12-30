'use client'

import InfoCard from '@/components/ui/cards/InfoCard/InfoCard'
import { themeColors } from '@/theme'

import { CopayItem, RawCopayData } from './types/types'

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
    <div className="p-6 min-h-[500px]" style={{ backgroundColor: themeColors.gray[50] }}>
      <h1 className="text-2xl font-semibold mb-6" style={{ color: themeColors.text.primary }}>
        Copay
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {copayData1.map((copay, index) => (
          <InfoCard
            key={index}
            title={copay.title}
            value={copay.value}
            coverage_level={copay.coverage_level}
            subtitle={copay.subtitle}
            footer={copay.footer}
            additionalInfo={copay.additionalInfo as any}
          />
        ))}
      </div>
    </div>
  )
}
