import { formatDate } from '@/utils/formatDate'

export const getCarrierGroupDetails = (currentCarrierGroup: any) => {
  if (!currentCarrierGroup) return []

  const statusValue =
    typeof currentCarrierGroup.status === 'boolean'
      ? currentCarrierGroup.status
      : currentCarrierGroup.status === 'active' ||
        currentCarrierGroup.status === 'Active' ||
        currentCarrierGroup.isActive ||
        currentCarrierGroup.is_active

  return [
    {
      title: 'Carrier Group Description',
      value:
        currentCarrierGroup.carrier_group_description || currentCarrierGroup.description || 'N/A',
    },
    {
      title: 'Carrier Group Code',
      value: currentCarrierGroup.carrier_group_code || currentCarrierGroup.code || 'N/A',
    },
    {
      title: 'Filling Indicator',
      value: currentCarrierGroup.filling_indicator || currentCarrierGroup.fillingIndicator || 'N/A',
    },
    {
      title: 'Status',
      value: statusValue ? 'Active' : 'Inactive',
    },
    {
      title: 'Created At',
      value: formatDate(currentCarrierGroup.created_at || currentCarrierGroup.createdAt),
    },
    {
      title: 'Updated At',
      value: formatDate(currentCarrierGroup.updated_at),
    },
  ]
}
