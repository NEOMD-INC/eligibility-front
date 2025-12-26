export type CardType = 'info' | 'progress'

export type CardConfig = {
  type: CardType
  title: string
  value: string
  subtitle?: string
  footer?: string
  used?: number
  total?: number
  additionalInfo?: {
    timePeriod?: string
    notes?: string
  }
}

export type CoverageConfig = {
  planInfo?: {
    insurance: string
    insuranceType: string
    coverageLevel: string
    isActive?: boolean
  }
  additionalPlan?: {
    insurance: string
    type: string
    address: string
  }
  cards: CardConfig[]
  limitations?: {
    coverageLevel?: string[]
    serviceLevelDates?: {
      addedDate?: string
      admissionBegin?: string
      serviceEndDate?: string
      admissionEnd?: string
    }
  }
}

export const coverageConfig: Record<string, CoverageConfig> = {
  'Professional (Physician) Visit - Office': {
    planInfo: {
      insurance: 'Aetna',
      insuranceType: 'HMO',
      coverageLevel: 'Employee Only',
      isActive: true,
    },
    additionalPlan: {
      insurance: 'United Health Care (87726)',
      type: 'HMO',
      address: '486 Grove Street Apartment #20, New York, NY 10014-1203',
    },
    cards: [
      {
        type: 'info',
        title: 'Copay',
        value: '$20',
        subtitle: 'Primary Care Visit. Copay Included in OOP',
        footer: 'Per Visit',
        additionalInfo: {
          timePeriod: 'Per Visit',
          notes: 'Facility Benefits',
        },
      },
      {
        type: 'progress',
        title: 'Deductible',
        value: '$4,000 Remaining',
        used: 6000,
        total: 10000,
        footer: 'Resets on 12/31/2024',
        additionalInfo: {
          timePeriod: 'Year to Date',
          notes: 'All In-Network Providers :: DED INCLUDED IN OOP',
        },
      },
      {
        type: 'info',
        title: 'Co-Insurance',
        value: '30%',
        subtitle: 'Specialist Visit. Co-Insurance Included in OOP',
        footer: 'Calendar Year',
        additionalInfo: {
          timePeriod: 'Calendar Year',
          notes: 'Up to 30% of Hospital Charges',
        },
      },
      {
        type: 'progress',
        title: 'Out of Pocket Maximum',
        value: '$5,000 Remaining',
        used: 6000,
        total: 11000,
        footer: 'Resets on 12/31/2024',
        additionalInfo: {
          timePeriod: 'Year to Date',
          notes: 'Amounts apply to in-network and out-of-network',
        },
      },
    ],
    limitations: {
      coverageLevel: ['0 - Beneficiary insured due to age OASI', 'PCP OV Cost Share For Any PCP'],
      serviceLevelDates: {
        addedDate: '01/01/2023',
        admissionBegin: '01/01/2023',
        serviceEndDate: '12/31/2024',
        admissionEnd: '12/31/2024',
      },
    },
  },

  'Emergency Services': {
    planInfo: {
      insurance: 'Aetna',
      insuranceType: 'HMO',
      coverageLevel: 'Employee Only',
      isActive: true,
    },
    additionalPlan: {
      insurance: 'United Health Care (87726)',
      type: 'HMO',
      address: '486 Grove Street Apartment #20, New York, NY 10014-1203',
    },
    cards: [
      {
        type: 'info',
        title: 'Copay',
        value: '$250',
        subtitle: 'Emergency Room Visit. Copay Included in OOP',
        footer: 'Per Visit',
        additionalInfo: {
          timePeriod: 'Per Visit',
          notes: 'Emergency Facility Benefits',
        },
      },
      {
        type: 'progress',
        title: 'Deductible',
        value: '$4,000 Remaining',
        used: 6000,
        total: 10000,
        footer: 'Resets on 12/31/2024',
        additionalInfo: {
          timePeriod: 'Year to Date',
          notes: 'All In-Network Providers :: DED INCLUDED IN OOP',
        },
      },
      {
        type: 'info',
        title: 'Co-Insurance',
        value: '30%',
        subtitle: 'Specialist Visit. Co-Insurance Included in OOP',
        footer: 'Calendar Year',
        additionalInfo: {
          timePeriod: 'Calendar Year',
          notes: 'Up to 30% of Hospital Charges',
        },
      },
      {
        type: 'progress',
        title: 'Out of Pocket Maximum',
        value: '$5,000 Remaining',
        used: 6000,
        total: 11000,
        footer: 'Resets on 12/31/2024',
        additionalInfo: {
          timePeriod: 'Year to Date',
          notes: 'Amounts apply to in-network and out-of-network',
        },
      },
    ],
    limitations: {
      coverageLevel: ['0 - Beneficiary insured due to age OASI', 'PCP OV Cost Share For Any PCP'],
      serviceLevelDates: {
        addedDate: '01/01/2023',
        admissionBegin: '01/01/2023',
        serviceEndDate: '12/31/2024',
        admissionEnd: '12/31/2024',
      },
    },
  },

  'Urgent Care': {
    planInfo: {
      insurance: 'Aetna',
      insuranceType: 'HMO',
      coverageLevel: 'Employee Only',
      isActive: true,
    },
    additionalPlan: {
      insurance: 'United Health Care (87726)',
      type: 'HMO',
      address: '486 Grove Street Apartment #20, New York, NY 10014-1203',
    },
    cards: [
      {
        type: 'info',
        title: 'Copay',
        value: '$50',
        subtitle: 'Urgent Care Visit. Copay Included in OOP',
        footer: 'Per Visit',
        additionalInfo: {
          timePeriod: 'Per Visit',
          notes: 'Urgent Care Facility Benefits',
        },
      },
      {
        type: 'progress',
        title: 'Deductible',
        value: '$4,000 Remaining',
        used: 6000,
        total: 10000,
        footer: 'Resets on 12/31/2024',
        additionalInfo: {
          timePeriod: 'Year to Date',
          notes: 'All In-Network Providers :: DED INCLUDED IN OOP',
        },
      },
      {
        type: 'info',
        title: 'Co-Insurance',
        value: '30%',
        subtitle: 'Specialist Visit. Co-Insurance Included in OOP',
        footer: 'Calendar Year',
        additionalInfo: {
          timePeriod: 'Calendar Year',
          notes: 'Up to 30% of Hospital Charges',
        },
      },
      {
        type: 'progress',
        title: 'Out of Pocket Maximum',
        value: '$5,000 Remaining',
        used: 6000,
        total: 11000,
        footer: 'Resets on 12/31/2024',
        additionalInfo: {
          timePeriod: 'Year to Date',
          notes: 'Amounts apply to in-network and out-of-network',
        },
      },
    ],
    limitations: {
      coverageLevel: ['0 - Beneficiary insured due to age OASI', 'PCP OV Cost Share For Any PCP'],
      serviceLevelDates: {
        addedDate: '01/01/2023',
        admissionBegin: '01/01/2023',
        serviceEndDate: '12/31/2024',
        admissionEnd: '12/31/2024',
      },
    },
  },

  Chiropractic: {
    planInfo: {
      insurance: 'Aetna',
      insuranceType: 'HMO',
      coverageLevel: 'Employee Only',
      isActive: true,
    },
    additionalPlan: {
      insurance: 'United Health Care (87726)',
      type: 'HMO',
      address: '486 Grove Street Apartment #20, New York, NY 10014-1203',
    },
    cards: [
      {
        type: 'info',
        title: 'Copay',
        value: '$30',
        subtitle: 'Chiropractic Visit. Copay Included in OOP',
        footer: 'Per Visit',
        additionalInfo: {
          timePeriod: 'Per Visit',
          notes: 'Chiropractic Facility Benefits',
        },
      },
      {
        type: 'progress',
        title: 'Deductible',
        value: '$4,000 Remaining',
        used: 6000,
        total: 10000,
        footer: 'Resets on 12/31/2024',
        additionalInfo: {
          timePeriod: 'Year to Date',
          notes: 'All In-Network Providers :: DED INCLUDED IN OOP',
        },
      },
      {
        type: 'info',
        title: 'Co-Insurance',
        value: '30%',
        subtitle: 'Specialist Visit. Co-Insurance Included in OOP',
        footer: 'Calendar Year',
        additionalInfo: {
          timePeriod: 'Calendar Year',
          notes: 'Up to 30% of Hospital Charges',
        },
      },
      {
        type: 'progress',
        title: 'Out of Pocket Maximum',
        value: '$5,000 Remaining',
        used: 6000,
        total: 11000,
        footer: 'Resets on 12/31/2024',
        additionalInfo: {
          timePeriod: 'Year to Date',
          notes: 'Amounts apply to in-network and out-of-network',
        },
      },
    ],
    limitations: {
      coverageLevel: ['0 - Beneficiary insured due to age OASI', 'PCP OV Cost Share For Any PCP'],
      serviceLevelDates: {
        addedDate: '01/01/2023',
        admissionBegin: '01/01/2023',
        serviceEndDate: '12/31/2024',
        admissionEnd: '12/31/2024',
      },
    },
  },

  Hospital: {
    planInfo: {
      insurance: 'Aetna',
      insuranceType: 'HMO',
      coverageLevel: 'Employee Only',
      isActive: true,
    },
    additionalPlan: {
      insurance: 'United Health Care (87726)',
      type: 'HMO',
      address: '486 Grove Street Apartment #20, New York, NY 10014-1203',
    },
    cards: [
      {
        type: 'info',
        title: 'Copay',
        value: '$500',
        subtitle: 'Hospital Stay. Copay Included in OOP',
        footer: 'Per Stay',
        additionalInfo: {
          timePeriod: 'Per Stay',
          notes: 'Hospital Facility Benefits',
        },
      },
      {
        type: 'progress',
        title: 'Deductible',
        value: '$4,000 Remaining',
        used: 6000,
        total: 10000,
        footer: 'Resets on 12/31/2024',
        additionalInfo: {
          timePeriod: 'Year to Date',
          notes: 'All In-Network Providers :: DED INCLUDED IN OOP',
        },
      },
      {
        type: 'info',
        title: 'Co-Insurance',
        value: '30%',
        subtitle: 'Specialist Visit. Co-Insurance Included in OOP',
        footer: 'Calendar Year',
        additionalInfo: {
          timePeriod: 'Calendar Year',
          notes: 'Up to 30% of Hospital Charges',
        },
      },
      {
        type: 'progress',
        title: 'Out of Pocket Maximum',
        value: '$5,000 Remaining',
        used: 6000,
        total: 11000,
        footer: 'Resets on 12/31/2024',
        additionalInfo: {
          timePeriod: 'Year to Date',
          notes: 'Amounts apply to in-network and out-of-network',
        },
      },
    ],
    limitations: {
      coverageLevel: ['0 - Beneficiary insured due to age OASI', 'PCP OV Cost Share For Any PCP'],
      serviceLevelDates: {
        addedDate: '01/01/2023',
        admissionBegin: '01/01/2023',
        serviceEndDate: '12/31/2024',
        admissionEnd: '12/31/2024',
      },
    },
  },

  'Hospital - Outpatient': {
    planInfo: {
      insurance: 'Aetna',
      insuranceType: 'HMO',
      coverageLevel: 'Employee Only',
      isActive: true,
    },
    additionalPlan: {
      insurance: 'United Health Care (87726)',
      type: 'HMO',
      address: '486 Grove Street Apartment #20, New York, NY 10014-1203',
    },
    cards: [
      {
        type: 'info',
        title: 'Copay',
        value: '$200',
        subtitle: 'Outpatient Hospital Visit. Copay Included in OOP',
        footer: 'Per Visit',
        additionalInfo: {
          timePeriod: 'Per Visit',
          notes: 'Outpatient Hospital Facility Benefits',
        },
      },
      {
        type: 'progress',
        title: 'Deductible',
        value: '$4,000 Remaining',
        used: 6000,
        total: 10000,
        footer: 'Resets on 12/31/2024',
        additionalInfo: {
          timePeriod: 'Year to Date',
          notes: 'All In-Network Providers :: DED INCLUDED IN OOP',
        },
      },
      {
        type: 'info',
        title: 'Co-Insurance',
        value: '30%',
        subtitle: 'Specialist Visit. Co-Insurance Included in OOP',
        footer: 'Calendar Year',
        additionalInfo: {
          timePeriod: 'Calendar Year',
          notes: 'Up to 30% of Hospital Charges',
        },
      },
      {
        type: 'progress',
        title: 'Out of Pocket Maximum',
        value: '$5,000 Remaining',
        used: 6000,
        total: 11000,
        footer: 'Resets on 12/31/2024',
        additionalInfo: {
          timePeriod: 'Year to Date',
          notes: 'Amounts apply to in-network and out-of-network',
        },
      },
    ],
    limitations: {
      coverageLevel: ['0 - Beneficiary insured due to age OASI', 'PCP OV Cost Share For Any PCP'],
      serviceLevelDates: {
        addedDate: '01/01/2023',
        admissionBegin: '01/01/2023',
        serviceEndDate: '12/31/2024',
        admissionEnd: '12/31/2024',
      },
    },
  },

  'Medical Care': {
    planInfo: {
      insurance: 'Aetna',
      insuranceType: 'HMO',
      coverageLevel: 'Employee Only',
      isActive: true,
    },
    additionalPlan: {
      insurance: 'United Health Care (87726)',
      type: 'HMO',
      address: '486 Grove Street Apartment #20, New York, NY 10014-1203',
    },
    cards: [
      {
        type: 'info',
        title: 'Copay',
        value: '$25',
        subtitle: 'Medical Care Visit. Copay Included in OOP',
        footer: 'Per Visit',
        additionalInfo: {
          timePeriod: 'Per Visit',
          notes: 'Medical Care Facility Benefits',
        },
      },
      {
        type: 'progress',
        title: 'Deductible',
        value: '$4,000 Remaining',
        used: 6000,
        total: 10000,
        footer: 'Resets on 12/31/2024',
        additionalInfo: {
          timePeriod: 'Year to Date',
          notes: 'All In-Network Providers :: DED INCLUDED IN OOP',
        },
      },
      {
        type: 'info',
        title: 'Co-Insurance',
        value: '30%',
        subtitle: 'Specialist Visit. Co-Insurance Included in OOP',
        footer: 'Calendar Year',
        additionalInfo: {
          timePeriod: 'Calendar Year',
          notes: 'Up to 30% of Hospital Charges',
        },
      },
      {
        type: 'progress',
        title: 'Out of Pocket Maximum',
        value: '$5,000 Remaining',
        used: 6000,
        total: 11000,
        footer: 'Resets on 12/31/2024',
        additionalInfo: {
          timePeriod: 'Year to Date',
          notes: 'Amounts apply to in-network and out-of-network',
        },
      },
    ],
    limitations: {
      coverageLevel: ['0 - Beneficiary insured due to age OASI', 'PCP OV Cost Share For Any PCP'],
      serviceLevelDates: {
        addedDate: '01/01/2023',
        admissionBegin: '01/01/2023',
        serviceEndDate: '12/31/2024',
        admissionEnd: '12/31/2024',
      },
    },
  },

  'Mental Health': {
    planInfo: {
      insurance: 'Aetna',
      insuranceType: 'HMO',
      coverageLevel: 'Employee Only',
      isActive: true,
    },
    additionalPlan: {
      insurance: 'United Health Care (87726)',
      type: 'HMO',
      address: '486 Grove Street Apartment #20, New York, NY 10014-1203',
    },
    cards: [
      {
        type: 'info',
        title: 'Copay',
        value: '$40',
        subtitle: 'Mental Health Visit. Copay Included in OOP',
        footer: 'Per Visit',
        additionalInfo: {
          timePeriod: 'Per Visit',
          notes: 'Mental Health Facility Benefits',
        },
      },
      {
        type: 'progress',
        title: 'Deductible',
        value: '$4,000 Remaining',
        used: 6000,
        total: 10000,
        footer: 'Resets on 12/31/2024',
        additionalInfo: {
          timePeriod: 'Year to Date',
          notes: 'All In-Network Providers :: DED INCLUDED IN OOP',
        },
      },
      {
        type: 'info',
        title: 'Co-Insurance',
        value: '30%',
        subtitle: 'Specialist Visit. Co-Insurance Included in OOP',
        footer: 'Calendar Year',
        additionalInfo: {
          timePeriod: 'Calendar Year',
          notes: 'Up to 30% of Hospital Charges',
        },
      },
      {
        type: 'progress',
        title: 'Out of Pocket Maximum',
        value: '$5,000 Remaining',
        used: 6000,
        total: 11000,
        footer: 'Resets on 12/31/2024',
        additionalInfo: {
          timePeriod: 'Year to Date',
          notes: 'Amounts apply to in-network and out-of-network',
        },
      },
    ],
    limitations: {
      coverageLevel: ['0 - Beneficiary insured due to age OASI', 'PCP OV Cost Share For Any PCP'],
      serviceLevelDates: {
        addedDate: '01/01/2023',
        admissionBegin: '01/01/2023',
        serviceEndDate: '12/31/2024',
        admissionEnd: '12/31/2024',
      },
    },
  },

  'Vision (Optometry)': {
    planInfo: {
      insurance: 'Aetna',
      insuranceType: 'HMO',
      coverageLevel: 'Employee Only',
      isActive: true,
    },
    additionalPlan: {
      insurance: 'United Health Care (87726)',
      type: 'HMO',
      address: '486 Grove Street Apartment #20, New York, NY 10014-1203',
    },
    cards: [
      {
        type: 'info',
        title: 'Copay',
        value: '$15',
        subtitle: 'Vision Visit. Copay Included in OOP',
        footer: 'Per Visit',
        additionalInfo: {
          timePeriod: 'Per Visit',
          notes: 'Vision Facility Benefits',
        },
      },
      {
        type: 'progress',
        title: 'Deductible',
        value: '$4,000 Remaining',
        used: 6000,
        total: 10000,
        footer: 'Resets on 12/31/2024',
        additionalInfo: {
          timePeriod: 'Year to Date',
          notes: 'All In-Network Providers :: DED INCLUDED IN OOP',
        },
      },
      {
        type: 'info',
        title: 'Co-Insurance',
        value: '30%',
        subtitle: 'Specialist Visit. Co-Insurance Included in OOP',
        footer: 'Calendar Year',
        additionalInfo: {
          timePeriod: 'Calendar Year',
          notes: 'Up to 30% of Hospital Charges',
        },
      },
      {
        type: 'progress',
        title: 'Out of Pocket Maximum',
        value: '$5,000 Remaining',
        used: 6000,
        total: 11000,
        footer: 'Resets on 12/31/2024',
        additionalInfo: {
          timePeriod: 'Year to Date',
          notes: 'Amounts apply to in-network and out-of-network',
        },
      },
    ],
    limitations: {
      coverageLevel: ['0 - Beneficiary insured due to age OASI', 'PCP OV Cost Share For Any PCP'],
      serviceLevelDates: {
        addedDate: '01/01/2023',
        admissionBegin: '01/01/2023',
        serviceEndDate: '12/31/2024',
        admissionEnd: '12/31/2024',
      },
    },
  },
}
