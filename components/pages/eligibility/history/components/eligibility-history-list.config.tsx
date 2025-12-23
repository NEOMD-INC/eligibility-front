import { SERVICE_TYPES } from '@/utils/constants/service-types'
import { RELATIONSHIP_CODES } from '@/utils/constants/relationship-codes'
import type { FilterField } from '@/components/ui/filters/Filters'

export const getFilterFields: (params: {
  filters: any
  handleFilterChange: any
}) => FilterField[] = ({ filters, handleFilterChange }: any) => [
  {
    name: 'serviceType',
    label: 'Service Type',
    type: 'select',
    value: filters.serviceType || '',
    onChange: handleFilterChange,
    options: [
      { value: '', label: 'All Service Types' },
      ...SERVICE_TYPES.map(st => ({
        value: st.value,
        label: `${st.value} - ${st.label}`,
      })),
    ],
  },
  {
    name: 'relationshipCode',
    label: 'Relationship Code',
    type: 'select',
    value: filters.relationshipCode || '',
    onChange: handleFilterChange,
    options: [
      { value: '', label: 'All Relationships' },
      ...RELATIONSHIP_CODES.map(rc => ({
        value: rc.value,
        label: `${rc.value} - ${rc.label}`,
      })),
    ],
  },
  {
    name: 'subscriberId',
    label: 'Subscriber ID',
    type: 'text',
    value: filters.subscriberId || '',
    onChange: handleFilterChange,
    placeholder: 'Enter Subscriber ID',
  },
  {
    name: 'dateFrom',
    label: 'Date From',
    type: 'date',
    value: filters.dateFrom || '',
    onChange: handleFilterChange,
  },
  {
    name: 'dateTo',
    label: 'Date To',
    type: 'date',
    value: filters.dateTo || '',
    onChange: handleFilterChange,
  },
]
