'use client'

import InfoCard from '@/components/ui/cards/InfoCard/InfoCard'

const coinsuranceData = [
  {
    title: 'Health Benefit Plan Coverage',
    value: '30%',
    subtitle: 'Primary Care Visit. Copay Included in OOP',
    footer: 'Calendar Year',
    additionalInfo: {
      timePeriod: 'Calendar Year',
      notes: 'Up to 30% of Hospital Charges',
    },
  },
  {
    title: 'Hospital - Outpatient',
    value: '20%',
    subtitle: 'Primary Care Visit. Copay Included in OOP',
    footer: 'Calendar Year',
    additionalInfo: {
      timePeriod: 'Calendar Year',
      notes: 'Up to 30% of Hospital Charges',
    },
  },
  {
    title: 'Emergency Services',
    value: '25%',
    subtitle: 'Primary Care Visit. Copay Included in OOP',
    footer: 'Calendar Year',
    additionalInfo: {
      timePeriod: 'Calendar Year',
      notes: 'Up to 30% of Hospital Charges',
    },
  },
  {
    title: 'Hospital Outpatient',
    value: '20%',
    subtitle: 'Primary Care Visit. Copay Included in OOP',
    footer: 'Calendar Year',
    additionalInfo: {
      timePeriod: 'Calendar Year',
      notes: 'Up to 30% of Hospital Charges',
    },
  },
  {
    title: 'Chiropractic',
    value: '10%',
    subtitle: 'Primary Care Visit. Copay Included in OOP',
    footer: 'Calendar Year',
    additionalInfo: {
      timePeriod: 'Calendar Year',
      notes: 'Up to 30% of Hospital Charges',
    },
  },
  {
    title: 'Internal Medicine',
    value: '50%',
    subtitle: 'Primary Care Visit. Copay Included in OOP',
    footer: 'Calendar Year',
    additionalInfo: {
      timePeriod: 'Calendar Year',
      notes: 'Up to 30% of Hospital Charges',
    },
  },
  {
    title: 'Mental Health',
    value: '15%',
    subtitle: 'Primary Care Visit. Copay Included in OOP',
    footer: 'Calendar Year',
    additionalInfo: {
      timePeriod: 'Calendar Year',
      notes: 'Up to 30% of Hospital Charges',
    },
  },
  {
    title: 'Cancer Care',
    value: '25%',
    subtitle: 'Primary Care Visit. Copay Included in OOP',
    footer: 'Calendar Year',
    additionalInfo: {
      timePeriod: 'Calendar Year',
      notes: 'Up to 30% of Hospital Charges',
    },
  },
]

export default function Coinsurance() {
  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Coinsurance</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coinsuranceData.map((coinsurance, index) => (
          <InfoCard
            key={index}
            title={coinsurance.title}
            value={coinsurance.value}
            subtitle={coinsurance.subtitle}
            footer={coinsurance.footer}
            additionalInfo={coinsurance.additionalInfo}
          />
        ))}
      </div>
    </div>
  )
}

