'use client'

import InfoCard from '@/components/ui/cards/InfoCard/InfoCard'

export default function Coinsurance({ coinsuranceData }: any) {
  const coinsuranceData1 =
    coinsuranceData?.map((item: any) => {
      const messages = item.messages || []
      const subtitle =
        messages.length > 2
          ? messages[2]
          : messages[0] || 'Primary Care Visit. Copay Included in OOP'
      const allMessages =
        messages.length > 0 ? messages.join('; ') : 'Up to 30% of Hospital Charges'

      return {
        title: item.benefit_type,
        value:
          typeof item.coinsurance_value === 'string'
            ? item.coinsurance_value.includes('%')
              ? item.coinsurance_value
              : `${item.coinsurance_value}%`
            : `${item.coinsurance_value}%`,
        subtitle: subtitle,
        footer: 'Calendar Year',
        additionalInfo: {
          timePeriod: 'Calendar Year',
          notes: allMessages,
        },
      }
    }) || []

  return (
    <div className="p-6 bg-gray-50 min-h-[500px]">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Coinsurance</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coinsuranceData1.length > 0
          ? coinsuranceData1.map((coinsurance, index) => (
              <InfoCard
                key={index}
                title={coinsurance.title}
                value={coinsurance.value}
                subtitle={coinsurance.subtitle}
                footer={coinsurance.footer}
                additionalInfo={coinsurance.additionalInfo}
              />
            ))
          : 'nothing to display'}
      </div>
    </div>
  )
}
