'use client'

import { useState, useMemo, useEffect } from 'react'
import CoverageSidebar from './components/coverage-sidebar/CoverageSidebar'
import BenefitDetails from './components/benefit-details/BenefitDetails'

function CoverageAndBenefits({ benefits }: { benefits: any }) {
  const [networkType, setNetworkType] = useState<'In Network' | 'Out of Network'>('In Network')

  const inNetworkBenefits = useMemo(() => {
    const inNetworkOnly = benefits?.in_network_only || []
    const bothNetworks = benefits?.both_networks || []
    const merged = [...inNetworkOnly, ...bothNetworks]

    const uniqueMap = new Map()
    merged.forEach(benefit => {
      const key = `${benefit.service_type_code}_${benefit.coverage_level_code}`
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, benefit)
      }
    })

    return Array.from(uniqueMap.values())
  }, [benefits])

  const outOfNetworkBenefits = useMemo(() => {
    const outOfNetworkOnly = benefits?.out_of_network_only || []
    const bothNetworks = benefits?.both_networks || []
    const merged = [...outOfNetworkOnly, ...bothNetworks]

    const uniqueMap = new Map()
    merged.forEach(benefit => {
      const key = `${benefit.service_type_code}_${benefit.coverage_level_code}`
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, benefit)
      }
    })

    return Array.from(uniqueMap.values())
  }, [benefits])

  const currentBenefits = networkType === 'In Network' ? inNetworkBenefits : outOfNetworkBenefits

  const [selectedCoverage, setSelectedCoverage] = useState('')

  // Set initial selected coverage when benefits are first loaded
  useEffect(() => {
    if (currentBenefits.length > 0 && !selectedCoverage) {
      setSelectedCoverage(currentBenefits[0]?.benefit_type || '')
    }
  }, [currentBenefits, selectedCoverage])

  // Update selected coverage when network type changes
  useEffect(() => {
    if (currentBenefits.length > 0) {
      const currentSelected = currentBenefits.find(
        (b: any) => b.benefit_type === selectedCoverage
      )
      if (!currentSelected) {
        setSelectedCoverage(currentBenefits[0]?.benefit_type || '')
      }
    }
  }, [networkType, currentBenefits, selectedCoverage])

  // Find the selected benefit based on benefit_type and network type
  const selectedBenefit = useMemo(() => {
    return currentBenefits.find((benefit: any) => benefit.benefit_type === selectedCoverage)
  }, [selectedCoverage, currentBenefits])

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
