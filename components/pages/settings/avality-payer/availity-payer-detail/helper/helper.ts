import { formatDate } from '@/utils/formatDate'

export const getPayerDetails = (currentAvailityPayer: any) => {
  if (!currentAvailityPayer) return []

  const statusValue =
    typeof currentAvailityPayer.is_active === 'boolean'
      ? currentAvailityPayer.is_active
      : currentAvailityPayer.is_active === 1 ||
        currentAvailityPayer.is_active === '1' ||
        currentAvailityPayer.is_active === true ||
        currentAvailityPayer.status === 'active' ||
        currentAvailityPayer.status === 'Active'

  return [
    {
      title: 'Payer ID',
      value: currentAvailityPayer.payer_id || currentAvailityPayer.payerId || 'N/A',
    },
    {
      title: 'Payer Name',
      value: currentAvailityPayer.payer_name || currentAvailityPayer.payerName || 'N/A',
    },
    {
      title: 'Payer Code',
      value: currentAvailityPayer.payer_code || currentAvailityPayer.payerCode || 'N/A',
    },
    {
      title: 'Contact Name',
      value: currentAvailityPayer.contact_name || currentAvailityPayer.contactName || 'N/A',
    },
    {
      title: 'Address Line 1',
      value: currentAvailityPayer.address_line_1 || currentAvailityPayer.addressLine1 || 'N/A',
    },
    {
      title: 'Address Line 2',
      value: currentAvailityPayer.address_line_2 || currentAvailityPayer.addressLine2 || 'N/A',
    },
    {
      title: 'City',
      value: currentAvailityPayer.city || 'N/A',
    },
    {
      title: 'State',
      value: currentAvailityPayer.state || 'N/A',
    },
    {
      title: 'Zip Code',
      value:
        currentAvailityPayer.zip ||
        currentAvailityPayer.zip_code ||
        currentAvailityPayer.zipCode ||
        'N/A',
    },
    {
      title: 'Phone',
      value: currentAvailityPayer.phone || 'N/A',
    },
    {
      title: 'Email',
      value: currentAvailityPayer.email || 'N/A',
    },
    {
      title: 'Status',
      value: statusValue ? 'Active' : 'Inactive',
    },
    {
      title: 'Notes',
      value: currentAvailityPayer.notes || 'N/A',
    },
    {
      title: 'Created At',
      value: formatDate(currentAvailityPayer.created_at),
    },
    {
      title: 'Updated At',
      value: formatDate(currentAvailityPayer.updated_at),
    },
  ]
}
