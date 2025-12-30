import { formatDate } from '@/utils/formatDate'

export const getCarrierSetupDetails = (currentCarrierSetup: any) => {
  if (!currentCarrierSetup) return []

  const isCliaValue =
    currentCarrierSetup.is_clia === 1 ||
    currentCarrierSetup.is_clia === '1' ||
    currentCarrierSetup.is_clia === true
      ? 'Yes'
      : currentCarrierSetup.is_clia === 0 ||
          currentCarrierSetup.is_clia === '0' ||
          currentCarrierSetup.is_clia === false
        ? 'No'
        : 'N/A'

  const enrollmentValue = currentCarrierSetup.enrollment
  const enrollmentRequiredValue =
    enrollmentValue === 1 || enrollmentValue === '1' || enrollmentValue === true
      ? 'Required'
      : enrollmentValue === 0 || enrollmentValue === '0' || enrollmentValue === false
        ? 'Not Required'
        : currentCarrierSetup.enrollment_required || 'N/A'

  return [
    {
      title: 'Carrier Group Code',
      value:
        currentCarrierSetup.carrier_group_code || currentCarrierSetup.carrierGroupCode || 'N/A',
    },
    {
      title: 'Group Description',
      value: currentCarrierSetup.carrier_group_description || 'N/A',
    },
    {
      title: 'Carrier Code',
      value: currentCarrierSetup.carrier_code || 'N/A',
    },
    {
      title: 'Carrier Description',
      value: currentCarrierSetup.carrier_description || 'N/A',
    },
    {
      title: 'State',
      value: currentCarrierSetup.state || 'N/A',
    },
    {
      title: 'Batch Payer ID',
      value: currentCarrierSetup.batch_payer_id || 'N/A',
    },
    {
      title: 'Is CLIA',
      value: isCliaValue,
    },
    {
      title: 'COB',
      value: currentCarrierSetup.cob || 'N/A',
    },
    {
      title: 'Corrected Claim',
      value: currentCarrierSetup.corrected_claim || 'N/A',
    },
    {
      title: 'Enrollment Required',
      value: enrollmentRequiredValue,
    },
    {
      title: 'Created At',
      value: formatDate(currentCarrierSetup.created_at),
    },
    {
      title: 'Updated At',
      value: formatDate(currentCarrierSetup.updated_at),
    },
  ]
}
