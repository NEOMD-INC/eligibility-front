'use client'

import { useMemo } from 'react'

import { themeColors } from '@/theme'

import InfoCard from '../../../../../../../../ui/cards/InfoCard/InfoCard'
import ProgressCard from '../../../../../../../../ui/cards/ProgressCard/ProgressCard'
import LimitationsCard from './components/LimitationsCard'
import { Props } from './types/types'

export default function BenefitDetails({ benefit, networkType, setNetworkType }: Props) {
  const formatCurrency = (value: string | null) => {
    if (!value) return 'N/A'
    return `$${parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatCopayLabel = (key: string): string => {
    const labelMap: { [key: string]: string } = {
      urgent_care: 'Urgent Care',
      emergency_room_physician: 'Emergency Room Physician',
      emergency_room_facility: 'Emergency Room Facility',
      office_visit: 'Office Visit',
      specialist_visit: 'Specialist Visit',
      primary_care: 'Primary Care',
      specialist: 'Specialist',
      copay: 'Copay',
    }

    if (labelMap[key]) {
      return labelMap[key]
    }
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  const copayValue = useMemo(() => {
    if (!benefit || !benefit.copays) return 'N/A'
    if (typeof benefit.copays === 'object') {
      const copayEntries = Object.entries(benefit.copays)
        .filter(([value]) => {
          if (value === null || value === undefined) return false
          if (value === 0 || value === '0') return false
          if (typeof value === 'string' && value.trim() === '') return false
          if (Array.isArray(value) && value.length === 0) return false
          return true
        })
        .map(([key, value]) => {
          const label = formatCopayLabel(key)

          let formattedValue: string
          if (typeof value === 'number' && !isNaN(value)) {
            formattedValue = formatCurrency(String(value))
          } else if (typeof value === 'string' && value.trim() !== '') {
            formattedValue = value
          } else {
            return null
          }
          return `${label}: ${formattedValue}`
        })
        .filter(entry => entry !== null)

      return copayEntries.length > 0 ? copayEntries.join('\n') : 'N/A'
    }

    if (benefit.copays === null || benefit.copays === undefined || benefit.copays === 0) {
      return 'N/A'
    }
    return formatCurrency(String(benefit.copays))
  }, [benefit])

  const coinsuranceData = useMemo(() => {
    if (!benefit) {
      return {
        value: 'N/A',
        additionalInfo: undefined,
      }
    }
    if (benefit.coinsurance === null || benefit.coinsurance === undefined) {
      return {
        value: 'N/A',
        additionalInfo: undefined,
      }
    }

    let value: string
    let timePeriod: string | undefined

    if (typeof benefit.coinsurance === 'object' && benefit.coinsurance !== null) {
      const percent = benefit.coinsurance.percent
      timePeriod = benefit.coinsurance.time_period
      if (percent !== null && percent !== undefined) {
        value = `${percent}%`
      } else {
        value = 'N/A'
      }
    } else if (typeof benefit.coinsurance === 'string' && benefit.coinsurance.includes('%')) {
      value = benefit.coinsurance
    } else {
      value = `${benefit.coinsurance}%`
    }

    return {
      value,
      additionalInfo: timePeriod
        ? {
            timePeriod,
          }
        : undefined,
    }
  }, [benefit])

  const deductibleData = useMemo(() => {
    if (!benefit || !benefit.deductible) {
      return {
        value: 'N/A',
        used: 0,
        total: 0,
        footer: undefined,
        additionalInfo: undefined,
      }
    }
    const remaining = parseFloat(benefit.deductible.remaining || '0')
    const total = parseFloat(benefit.deductible.total || '0')

    const used = Math.max(0, total - remaining)
    return {
      value: formatCurrency(String(remaining)),
      used: used,
      total: total,
      footer: benefit.deductible.reset_date
        ? `Resets on ${benefit.deductible.reset_date}`
        : undefined,
      additionalInfo: {
        notes: `Remaining: ${formatCurrency(String(remaining))}`,
      },
    }
  }, [benefit])

  const outOfPocketData = useMemo(() => {
    if (!benefit || !benefit.out_of_pocket) {
      return {
        value: 'N/A',
        used: 0,
        total: 0,
        footer: undefined,
        additionalInfo: undefined,
      }
    }
    const remaining = parseFloat(benefit.out_of_pocket.remaining || '0')
    const total = parseFloat(benefit.out_of_pocket.total || '0')

    const used = Math.max(0, total - remaining)
    return {
      value: formatCurrency(String(remaining)),
      used: used,
      total: total,
      footer: benefit.out_of_pocket.reset_date
        ? `Resets on ${benefit.out_of_pocket.reset_date}`
        : undefined,
      additionalInfo: {
        notes: `Remaining: ${formatCurrency(String(remaining))}`,
      },
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
      <section className="flex-1 p-6" style={{ backgroundColor: themeColors.gray[50] }}>
        <p style={{ color: themeColors.text.muted }}>No coverage information available</p>
      </section>
    )
  }

  const getCoverageStatusBadge = (status: string | undefined) => {
    if (!status) return null

    const statusLower = status.toLowerCase()
    const isActive = statusLower === 'active'
    const bgColor = isActive ? themeColors.green[100] : themeColors.red[100]
    const textColor = isActive ? themeColors.green[700] : themeColors.red[700]

    return (
      <span
        className="ml-3 px-2.5 py-0.5 rounded-full text-sm font-medium"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        {status}
      </span>
    )
  }

  return (
    <section className="flex-1 p-6" style={{ backgroundColor: themeColors.gray[50] }}>
      <div className="flex justify-between items-center mb-6">
        <h1
          className="text-2xl font-semibold flex items-center"
          style={{ color: themeColors.text.primary }}
        >
          {benefit.benefit_type} - {benefit.coverage_level}
          {getCoverageStatusBadge(benefit.coverage_status)}
        </h1>

        <div className="flex border-b" style={{ borderColor: themeColors.border.default }}>
          <button
            onClick={() => setNetworkType('In Network')}
            className="px-4 py-2 text-sm font-medium relative transition-colors"
            style={{
              color: networkType === 'In Network' ? themeColors.blue[600] : themeColors.gray[600],
            }}
            onMouseEnter={e => {
              if (networkType !== 'In Network') {
                e.currentTarget.style.color = themeColors.text.primary
              }
            }}
            onMouseLeave={e => {
              if (networkType !== 'In Network') {
                e.currentTarget.style.color = themeColors.gray[600]
              }
            }}
          >
            In Network
            {networkType === 'In Network' && (
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: themeColors.blue[600] }}
              ></div>
            )}
          </button>
          <button
            onClick={() => setNetworkType('Out of Network')}
            className="px-4 py-2 text-sm font-medium relative transition-colors"
            style={{
              color:
                networkType === 'Out of Network' ? themeColors.blue[600] : themeColors.gray[600],
            }}
            onMouseEnter={e => {
              if (networkType !== 'Out of Network') {
                e.currentTarget.style.color = themeColors.text.primary
              }
            }}
            onMouseLeave={e => {
              if (networkType !== 'Out of Network') {
                e.currentTarget.style.color = themeColors.gray[600]
              }
            }}
          >
            Out of Network
            {networkType === 'Out of Network' && (
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: themeColors.blue[600] }}
              ></div>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {benefit.copays !== null && benefit.copays !== undefined && (
          <InfoCard
            key={`copay-${benefit.service_type_code}-${benefit.coverage_level_code}`}
            title="Copay"
            value={copayValue}
            subtitle={benefit.coverage_level}
          />
        )}

        {benefit.deductible !== null && benefit.deductible !== undefined && (
          <ProgressCard
            key={`deductible-${benefit.service_type_code}-${benefit.coverage_level_code}`}
            title="Deductible"
            value={deductibleData.value}
            used={deductibleData.used}
            total={deductibleData.total}
            footer={deductibleData.footer}
            additionalInfo={deductibleData.additionalInfo}
          />
        )}

        {benefit.coinsurance !== null && benefit.coinsurance !== undefined && (
          <InfoCard
            key={`coinsurance-${benefit.service_type_code}-${benefit.coverage_level_code}`}
            title="Co-Insurance"
            value={coinsuranceData.value}
            subtitle={benefit.coverage_level}
            additionalInfo={coinsuranceData.additionalInfo}
          />
        )}

        {benefit.out_of_pocket !== null && benefit.out_of_pocket !== undefined && (
          <ProgressCard
            key={`outofpocket-${benefit.service_type_code}-${benefit.coverage_level_code}`}
            title="Out of Pocket Maximum"
            value={outOfPocketData.value}
            used={outOfPocketData.used}
            total={outOfPocketData.total}
            footer={outOfPocketData.footer}
            additionalInfo={outOfPocketData.additionalInfo}
          />
        )}

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
