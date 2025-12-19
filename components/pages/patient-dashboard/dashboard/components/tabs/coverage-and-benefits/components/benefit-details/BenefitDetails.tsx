'use client'

import { useMemo } from 'react'
import InfoCard from '../../../../../../../../ui/cards/InfoCard/InfoCard'
import ProgressCard from '../../../../../../../../ui/cards/ProgressCard/ProgressCard'
import LimitationsCard from './components/LimitationsCard'

type Props = {
  benefit: any
  networkType: string
  setNetworkType: (type: 'In Network' | 'Out of Network') => void
}

export default function BenefitDetails({ benefit, networkType, setNetworkType }: Props) {
  // Transform benefit data to card format - memoized to update when benefit changes
  const formatCurrency = (value: string | null) => {
    if (!value) return 'N/A'
    return `$${parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const copayValue = useMemo(() => {
    if (!benefit) return 'N/A'
    return benefit.copay ? formatCurrency(benefit.copay) : 'N/A'
  }, [benefit])

  const coinsuranceValue = useMemo(() => {
    if (!benefit) return 'N/A'
    return benefit.coinsurance
      ? typeof benefit.coinsurance === 'string' && benefit.coinsurance.includes('%')
        ? benefit.coinsurance
        : `${benefit.coinsurance}%`
      : 'N/A'
  }, [benefit])

  const deductibleData = useMemo(() => {
    if (!benefit) {
      return {
        value: 'N/A',
        used: 0,
        total: 0,
        footer: undefined,
        additionalInfo: undefined,
      }
    }
    return benefit.deductible
      ? {
          value: formatCurrency(benefit.deductible.amount),
          used: parseFloat(benefit.deductible.met || '0'),
          total: parseFloat(benefit.deductible.amount || '0'),
          footer: benefit.deductible.reset_date
            ? `Resets on ${benefit.deductible.reset_date}`
            : undefined,
          additionalInfo: {
            notes: `Remaining: ${formatCurrency(benefit.deductible.remaining)}`,
          },
        }
      : {
          value: 'N/A',
          used: 0,
          total: 0,
          footer: undefined,
          additionalInfo: undefined,
        }
  }, [benefit])

  const outOfPocketData = useMemo(() => {
    if (!benefit) {
      return {
        value: 'N/A',
        used: 0,
        total: 0,
        footer: undefined,
        additionalInfo: undefined,
      }
    }
    return benefit.out_of_pocket
      ? {
          value: formatCurrency(benefit.out_of_pocket.amount),
          used: parseFloat(benefit.out_of_pocket.met || '0'),
          total: parseFloat(benefit.out_of_pocket.amount || '0'),
          footer: benefit.out_of_pocket.reset_date
            ? `Resets on ${benefit.out_of_pocket.reset_date}`
            : undefined,
          additionalInfo: {
            notes: `Remaining: ${formatCurrency(benefit.out_of_pocket.remaining)}`,
          },
        }
      : {
          value: 'N/A',
          used: 0,
          total: 0,
          footer: undefined,
          additionalInfo: undefined,
        }
  }, [benefit])

  const limitationsData = useMemo(() => {
    if (!benefit) {
      return {
        coverageLevel: [],
        serviceLevelDates: undefined,
      }
    }
    return {
      coverageLevel: benefit.limitations?.coverage_level || [],
      serviceLevelDates: benefit.limitations?.service_level_dates
        ? {
            addedDate: benefit.limitations.service_level_dates.added_date,
            admissionBegin: benefit.limitations.service_level_dates.admission_begin,
            serviceEndDate: benefit.limitations.service_level_dates.service_end_date,
            admissionEnd: benefit.limitations.service_level_dates.admission_end,
          }
        : undefined,
    }
  }, [benefit])

  if (!benefit) {
    return (
      <section className="flex-1 p-6 bg-gray-50">
        <p className="text-gray-500">No coverage information available</p>
      </section>
    )
  }

  return (
    <section className="flex-1 p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          {benefit.benefit_type} - {benefit.coverage_level}
        </h1>

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
        <InfoCard
          key={`copay-${benefit.service_type_code}-${benefit.coverage_level_code}`}
          title="Copay"
          value={copayValue}
          subtitle={benefit.coverage_level}
        />

        {/* Deductible Card */}
        <ProgressCard
          key={`deductible-${benefit.service_type_code}-${benefit.coverage_level_code}`}
          title="Deductible"
          value={deductibleData.value}
          used={deductibleData.used}
          total={deductibleData.total}
          footer={deductibleData.footer}
          additionalInfo={deductibleData.additionalInfo}
        />

        {/* Co-Insurance Card */}
        <InfoCard
          key={`coinsurance-${benefit.service_type_code}-${benefit.coverage_level_code}`}
          title="Co-Insurance"
          value={coinsuranceValue}
          subtitle={benefit.coverage_level}
        />
      </div>

      {/* Second Row: Out of Pocket Maximum, Limitations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Out of Pocket Maximum Card */}
        <ProgressCard
          key={`outofpocket-${benefit.service_type_code}-${benefit.coverage_level_code}`}
          title="Out of Pocket Maximum"
          value={outOfPocketData.value}
          used={outOfPocketData.used}
          total={outOfPocketData.total}
          footer={outOfPocketData.footer}
          additionalInfo={outOfPocketData.additionalInfo}
        />

        {/* Limitations Card (spans 2 columns) */}
        <div className="md:col-span-2">
          <LimitationsCard
            key={`limitations-${benefit.service_type_code}-${benefit.coverage_level_code}`}
            {...limitationsData}
          />
        </div>
      </div>
    </section>
  )
}
