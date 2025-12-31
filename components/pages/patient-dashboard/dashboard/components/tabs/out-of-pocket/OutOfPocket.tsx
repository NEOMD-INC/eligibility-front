'use client'

import ProgressCard from '@/components/ui/cards/ProgressCard/ProgressCard'
import { themeColors } from '@/theme'

import { getOutOfPocketData } from './components/out-of-pocket.config'

export default function OutOfPocket({ outOfPocketData }: any) {
  const outOfPocketData1 = getOutOfPocketData(outOfPocketData)

  return (
    <div className="p-6" style={{ backgroundColor: themeColors.gray[50] }}>
      <h1 className="text-2xl font-semibold mb-6" style={{ color: themeColors.text.primary }}>
        Out of Pocket
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {outOfPocketData1.map((outOfPocket: any, index: number) => (
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
