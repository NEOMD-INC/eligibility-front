'use client'

import { useState } from 'react'
import { coverageConfig } from '@/lib/coverageConfig'
import InfoCard from '../../../../../../../../ui/cards/InfoCard/InfoCard'
import ProgressCard from '../../../../../../../../ui/cards/ProgressCard/ProgressCard'
import LimitationsCard from './components/LimitationsCard'

type Props = {
  coverageKey: string
}

export default function BenefitDetails({ coverageKey }: Props) {
  const [networkType, setNetworkType] = useState<'In Network' | 'Out of Network'>('In Network')
  const config = coverageConfig[coverageKey]

  if (!config) {
    return (
      <section className="flex-1 p-6">
        <p className="text-gray-500">No coverage information available</p>
      </section>
    )
  }

  const { cards, limitations } = config

  return (
    <section className="flex-1 p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">{coverageKey} - 45</h1>

        {/* Network Type Tabs */}
        <div className="flex border-b border-gray-300">
          <button
            onClick={() => setNetworkType('In Network')}
            className={`px-4 py-2 text-sm font-medium relative transition-colors ${
              networkType === 'In Network' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            In Network
            {networkType === 'In Network' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
            )}
          </button>
          <button
            onClick={() => setNetworkType('Out of Network')}
            className={`px-4 py-2 text-sm font-medium relative transition-colors ${
              networkType === 'Out of Network'
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Out of Network
            {networkType === 'Out of Network' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
            )}
          </button>
        </div>
      </div>

      {/* First Row: Copay, Deductible, Co-Insurance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Copay Card */}
        {cards.find(card => card.title === 'Copay') &&
          (() => {
            const copayCard = cards.find(card => card.title === 'Copay')!
            return (
              <InfoCard
                title={copayCard.title}
                value={copayCard.value}
                subtitle={copayCard.subtitle}
                footer={copayCard.footer}
                additionalInfo={copayCard.additionalInfo}
              />
            )
          })()}

        {/* Deductible Card */}
        {cards.find(card => card.title === 'Deductible') &&
          (() => {
            const deductibleCard = cards.find(card => card.title === 'Deductible')!
            return (
              <ProgressCard
                title={deductibleCard.title}
                value={deductibleCard.value}
                used={deductibleCard.used!}
                total={deductibleCard.total!}
                footer={deductibleCard.footer}
                additionalInfo={deductibleCard.additionalInfo}
              />
            )
          })()}

        {/* Co-Insurance Card */}
        {cards.find(card => card.title === 'Co-Insurance') &&
          (() => {
            const coinsuranceCard = cards.find(card => card.title === 'Co-Insurance')!
            return (
              <InfoCard
                title={coinsuranceCard.title}
                value={coinsuranceCard.value}
                subtitle={coinsuranceCard.subtitle}
                footer={coinsuranceCard.footer}
                additionalInfo={coinsuranceCard.additionalInfo}
              />
            )
          })()}
      </div>

      {/* Second Row: Out of Pocket Maximum, Limitations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Out of Pocket Maximum Card */}
        {cards.find(card => card.title === 'Out of Pocket Maximum') &&
          (() => {
            const oopCard = cards.find(card => card.title === 'Out of Pocket Maximum')!
            return (
              <ProgressCard
                title={oopCard.title}
                value={oopCard.value}
                used={oopCard.used!}
                total={oopCard.total!}
                footer={oopCard.footer}
                additionalInfo={oopCard.additionalInfo}
              />
            )
          })()}

        {/* Limitations Card (spans 2 columns) */}
        {limitations && (
          <div className="md:col-span-2">
            <LimitationsCard {...limitations} />
          </div>
        )}
      </div>
    </section>
  )
}
