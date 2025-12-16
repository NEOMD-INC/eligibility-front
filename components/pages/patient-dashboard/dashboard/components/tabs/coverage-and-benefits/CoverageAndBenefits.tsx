'use client'

import { useState } from 'react'
import CoverageSidebar from './components/coverage-sidebar/CoverageSidebar'
import BenefitDetails from './components/benefit-details/BenefitDetails'

export default function CoverageAndBenefits() {
  const [selectedCoverage, setSelectedCoverage] = useState(
    'Professional (Physician) Visit - Office'
  )

  return (
    <main className="flex min-h-screen">
      <CoverageSidebar selected={selectedCoverage} onSelect={setSelectedCoverage} />

      <BenefitDetails coverageKey={selectedCoverage} />
    </main>
  )
}
