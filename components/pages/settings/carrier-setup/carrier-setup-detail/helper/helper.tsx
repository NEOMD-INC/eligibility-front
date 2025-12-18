import { formatDate } from '@/utils/formatDate'

export const getCarrierSetupDetails = (currentCarrierSetup: any) => {
  if (!currentCarrierSetup) return []

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
      value: currentCarrierSetup.is_clia === 0 ? 'false' : 'true' || 'N/A',
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
      value: currentCarrierSetup.enrollment_required || 'N/A',
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
