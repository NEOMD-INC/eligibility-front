'use client'

import InfoCard from '@/components/ui/cards/InfoCard/InfoCard'
import { themeColors } from '@/theme'

import { getCoInsuranceData } from './components/coinsurance.config'
import { CoinsuranceProps } from './types/types'

export default function Coinsurance({ coinsuranceData }: CoinsuranceProps) {
  const coinsuranceData1 = getCoInsuranceData(coinsuranceData as any)

  return (
    <div className="p-6 min-h-[500px]" style={{ backgroundColor: themeColors.gray[50] }}>
      <h1 className="text-2xl font-semibold mb-6" style={{ color: themeColors.text.primary }}>
        Coinsurance
      </h1>
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
