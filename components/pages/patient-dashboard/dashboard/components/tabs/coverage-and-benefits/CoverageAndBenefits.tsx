'use client'

import { useEffect, useMemo, useState } from 'react'

import BenefitDetails from './components/benefit-details/BenefitDetails'
import CoverageSidebar from './components/coverage-sidebar/CoverageSidebar'

function CoverageAndBenefits({ benefits }: { benefits: any }) {
  const [networkType, setNetworkType] = useState<'In Network' | 'Out of Network'>('In Network')

  const inNetworkBenefits = useMemo(() => {
    const inNetwork = benefits?.in_network || []
    const inNetworkOnly = benefits?.in_network_only || []
    const bothNetworks = benefits?.both_networks || []
    const merged = [...inNetwork, ...inNetworkOnly, ...bothNetworks]

    const uniqueMap = new Map()
    merged.forEach(benefit => {
      const key = `${benefit.benefit_type}_${benefit.service_type_code}_${benefit.coverage_level_code}`
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, benefit)
      }
    })

    return Array.from(uniqueMap.values())
  }, [benefits])

  const outOfNetworkBenefits = useMemo(() => {
    const outOfNetwork = benefits?.out_of_network || []
    const outOfNetworkOnly = benefits?.out_of_network_only || []
    const bothNetworks = benefits?.both_networks || []
    const merged = [...outOfNetwork, ...outOfNetworkOnly, ...bothNetworks]

    const uniqueMap = new Map()
    merged.forEach(benefit => {
      const key = `${benefit.benefit_type}_${benefit.service_type_code}_${benefit.coverage_level_code}`
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, benefit)
      }
    })

    return Array.from(uniqueMap.values())
  }, [benefits])

  const currentBenefits = networkType === 'In Network' ? inNetworkBenefits : outOfNetworkBenefits

  const [selectedCoverage, setSelectedCoverage] = useState('')

  const getBenefitKey = (benefit: any) => {
    return `${benefit.benefit_type}_${benefit.service_type_code}_${benefit.coverage_level_code}`
  }

  useEffect(() => {
    if (currentBenefits.length > 0 && !selectedCoverage) {
      const firstBenefit = currentBenefits[0]
      setSelectedCoverage(getBenefitKey(firstBenefit))
    }
  }, [currentBenefits, selectedCoverage])

  useEffect(() => {
    if (currentBenefits.length > 0) {
      const currentSelected = currentBenefits.find(
        (b: any) => getBenefitKey(b) === selectedCoverage
      )
      if (!currentSelected) {
        const firstBenefit = currentBenefits[0]
        setSelectedCoverage(getBenefitKey(firstBenefit))
      }
    }
  }, [networkType, currentBenefits, selectedCoverage])

  const selectedBenefit = useMemo(() => {
    if (!selectedCoverage) return undefined

    if (selectedCoverage.includes('_')) {
      const parts = selectedCoverage.split('_')
      const benefitType = parts[0]
      const serviceTypeCode = parts[1]
      const coverageLevelCode = parts[2]

      return currentBenefits.find(
        (benefit: any) =>
          benefit.benefit_type === benefitType &&
          benefit.service_type_code === serviceTypeCode &&
          benefit.coverage_level_code === coverageLevelCode
      )
    }

    return currentBenefits.find((benefit: any) => benefit.benefit_type === selectedCoverage)
  }, [selectedCoverage, currentBenefits])

  console.log('Selected Benefits here:', selectedBenefit)

  return (
    <main className="flex min-h-screen">
      <CoverageSidebar
        menuOptions={networkType === 'In Network' ? inNetworkBenefits : outOfNetworkBenefits}
        selected={selectedCoverage}
        onSelect={setSelectedCoverage}
      />

      <BenefitDetails
        benefit={selectedBenefit}
        networkType={networkType}
        setNetworkType={setNetworkType}
      />
    </main>
  )
}

export default CoverageAndBenefits
