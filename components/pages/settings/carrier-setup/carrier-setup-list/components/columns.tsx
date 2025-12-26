import Link from 'next/link'

import GridActionButtons from '@/components/ui/buttons/grid-action-buttons/GridActionButtons'

interface CarrierSetupListColumnsProps {
  onDeleteClick?: (id: string, carrierSetupName: string) => void
}

export default function CarrierSetupListColumns({
  onDeleteClick,
}: CarrierSetupListColumnsProps = {}) {
  const carrierSetupColumns = [
    {
      key: 'groupCode',
      label: 'Group Code',
      width: '20%',
      align: 'left' as const,
      render: (value: any, carrierSetup: any) => (
        <Link href={`/settings/carrier-setup/${carrierSetup.id || carrierSetup.uuid}`}>
          <div className="text-gray-900 font-semibold hover:text-blue-600 truncate">
            {carrierSetup.carrier_group_code || 'N/A'}
          </div>
        </Link>
      ),
    },
    {
      key: 'groupDescription',
      label: 'Group Description',
      width: '25%',
      align: 'left' as const,
      render: (value: any, carrierSetup: any) => (
        <div className="text-gray-900 truncate">
          {carrierSetup.carrier_group_description || 'N/A'}
        </div>
      ),
    },
    {
      key: 'carrierCode',
      label: 'Carrier Code',
      width: '20%',
      align: 'left' as const,
      render: (value: any, carrierSetup: any) => (
        <div className="text-gray-900 truncate">
          {carrierSetup.carrierCode || carrierSetup.carrier_code || 'N/A'}
        </div>
      ),
    },
    {
      key: 'carrierDescription',
      label: 'Carrier Description',
      width: '25%',
      align: 'left' as const,
      render: (value: any, carrierSetup: any) => (
        <div className="text-gray-900 truncate">
          {carrierSetup.carrierDescription || carrierSetup.carrier_description || 'N/A'}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '10%',
      align: 'center' as const,
      render: (value: any, carrierSetup: any) => (
        <div className="flex justify-center items-center w-full">
          <GridActionButtons
            data={carrierSetup}
            from="id"
            editBtnPath={`/settings/carrier-setup/edit/${carrierSetup.id || carrierSetup.uuid}`}
            showBtnPath={`/settings/carrier-setup/${carrierSetup.id || carrierSetup.uuid}`}
            deleteResourceId={
              onDeleteClick
                ? (id: string) => {
                    const carrierSetupName: string =
                      carrierSetup.groupDescription ||
                      carrierSetup.group_description ||
                      carrierSetup.groupCode ||
                      carrierSetup.group_code ||
                      'carrier setup'
                    onDeleteClick(id, carrierSetupName)
                  }
                : undefined
            }
            showIdDispatch={() => {}}
            editIdDispatch={() => {}}
            editDrawerId=""
            showDrawerId=""
            viewPermission={true}
            updatePermission={true}
            deletePermission={true}
            isUser={false}
          />
        </div>
      ),
    },
  ]

  return carrierSetupColumns
}
