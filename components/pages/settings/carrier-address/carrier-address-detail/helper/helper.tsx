import { formatDate } from '@/utils/formatDate'

export const getCarrierAddressDetails = (currentCarrierAddress: any) => {
  if (!currentCarrierAddress) return []

  return [
    {
      title: 'Carrier Code',
      value: currentCarrierAddress.carrier_code || currentCarrierAddress.carrierCode || 'N/A',
    },
    {
      title: 'Actual Name',
      value: currentCarrierAddress.actual_name || currentCarrierAddress.actualName || 'N/A',
    },
    {
      title: 'Address ID',
      value: currentCarrierAddress.address_id || currentCarrierAddress.addressId || 'N/A',
    },
    {
      title: 'Address Line 1',
      value:
        currentCarrierAddress.address_line1 ||
        currentCarrierAddress.address_line_1 ||
        currentCarrierAddress.addressLine1 ||
        'N/A',
    },
    {
      title: 'City',
      value: currentCarrierAddress.city || 'N/A',
    },
    {
      title: 'State',
      value: currentCarrierAddress.state || 'N/A',
    },
    {
      title: 'Zip Code',
      value: currentCarrierAddress.zip_code || currentCarrierAddress.zipCode || 'N/A',
    },
    {
      title: 'Phone Type',
      value: currentCarrierAddress.phone_type || currentCarrierAddress.phoneType || 'N/A',
    },
    {
      title: 'Phone Number',
      value: currentCarrierAddress.phone_number || currentCarrierAddress.phoneNumber || 'N/A',
    },
    {
      title: 'Insurance Department',
      value:
        currentCarrierAddress.insurance_department ||
        currentCarrierAddress.insuranceDepartment ||
        'N/A',
    },
    {
      title: 'Created At',
      value: formatDate(currentCarrierAddress.created_at || currentCarrierAddress.createdAt),
    },
    {
      title: 'Updated At',
      value: formatDate(currentCarrierAddress.updated_at),
    },
  ]
}
