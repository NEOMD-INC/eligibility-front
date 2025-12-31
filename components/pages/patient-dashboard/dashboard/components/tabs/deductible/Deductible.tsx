'use client'

import ProgressCard from '@/components/ui/cards/ProgressCard/ProgressCard'
import { themeColors } from '@/theme'

import { getDeductableData } from './components/deductable.config'

export default function Deductible({ deductiblesData }: any) {
  const deductibleData1 = getDeductableData(deductiblesData)

  return (
    <div className="p-6" style={{ backgroundColor: themeColors.gray[50] }}>
      <h1 className="text-2xl font-semibold mb-6" style={{ color: themeColors.text.primary }}>
        Deductible
      </h1>
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
