'use client'

import InfoCard from '@/components/ui/cards/InfoCard/InfoCard'

const copayData = [
  {
    title: 'Health Benefit Plan Coverage',
    value: '$20',
    subtitle: 'Primary Care Visit. Copay Included in OOP',
    footer: 'Per Visit',
    additionalInfo: {
      timePeriod: 'Per Visit',
      notes: 'Facility Benefits',
    },
  },
  {
    title: 'Hospital - Outpatient',
    value: '$20',
    subtitle: 'Primary Care Visit. Copay Included in OOP',
    footer: 'Per Visit',
    additionalInfo: {
      timePeriod: 'Per Visit',
      notes: 'Facility Benefits',
    },
  },
  {
    title: 'Emergency Services',
    value: '$150',
    subtitle: 'Specialist Visit. Copay Included in OOP',
    footer: 'Per Visit',
    additionalInfo: {
      timePeriod: 'Per Visit',
      notes: 'Facility Benefits',
    },
  },
  {
    title: 'Chiropractic',
    value: '$30',
    subtitle: 'Primary Care Visit. Copay Included in OOP',
    footer: 'Per Visit',
    additionalInfo: {
      timePeriod: 'Per Visit',
      notes: 'Facility Benefits',
    },
  },
  {
    title: 'Internal Medicine',
    value: '$30',
    subtitle: 'Primary Care Visit. Copay Included in OOP',
    footer: 'Per Visit',
    additionalInfo: {
      timePeriod: 'Per Visit',
      notes: 'Facility Benefits',
    },
  },
  {
    title: 'Mental Health',
    value: '$50',
    subtitle: 'Primary Care Visit. Copay Included in OOP',
    footer: 'Per Visit',
    additionalInfo: {
      timePeriod: 'Per Visit',
      notes: 'Facility Benefits',
    },
  },
]

export default function Copay() {
  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Copay</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {copayData.map((copay, index) => (
          <InfoCard
            key={index}
            title={copay.title}
            value={copay.value}
            subtitle={copay.subtitle}
            footer={copay.footer}
            additionalInfo={copay.additionalInfo}
          />
        ))}
      </div>
    </div>
  )
}

