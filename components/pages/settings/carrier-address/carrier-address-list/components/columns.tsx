import Link from 'next/link'

import GridActionButtons from '@/components/ui/buttons/grid-action-buttons/GridActionButtons'

interface CarrierAddressListColumnsProps {
  onDeleteClick?: (id: string, carrierAddressName: string) => void
}

export default function CarrierAddressListColumns({
  onDeleteClick,
}: CarrierAddressListColumnsProps = {}) {
  const carrierAddressColumns = [
    {
      key: 'carrierCode',
      label: 'Carrier Code',
      width: '20%',
      align: 'left' as const,
      render: (value: any, carrierAddress: any) => (
        <Link href={`/settings/carrier-address/${carrierAddress.id || carrierAddress.uuid}`}>
          <div className="text-gray-900 font-semibold hover:text-blue-600 truncate">
            {carrierAddress.carrierCode || carrierAddress.carrier_code || 'N/A'}
          </div>
        </Link>
      ),
    },
    {
      key: 'actualName',
      label: 'Actual Name',
      width: '30%',
      align: 'left' as const,
      render: (value: any, carrierAddress: any) => (
        <div className="text-gray-900 truncate">
          {carrierAddress.actualName || carrierAddress.actual_name || 'N/A'}
        </div>
      ),
    },
    {
      key: 'addressId',
      label: 'Address ID',
      width: '30%',
      align: 'left' as const,
      render: (value: any, carrierAddress: any) => (
        <div className="text-gray-900 truncate">
          {carrierAddress.addressId || carrierAddress.address_id || 'N/A'}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '20%',
      align: 'center' as const,
      render: (value: any, carrierAddress: any) => (
        <div className="flex justify-center items-center w-full">
          <GridActionButtons
            data={carrierAddress}
            from="id"
            editBtnPath={`/settings/carrier-address/edit/${carrierAddress.id || carrierAddress.uuid}`}
            showBtnPath={`/settings/carrier-address/${carrierAddress.id || carrierAddress.uuid}`}
            deleteResourceId={
              onDeleteClick
                ? (id: string) => {
                    const carrierAddressName: string =
                      carrierAddress.actualName ||
                      carrierAddress.actual_name ||
                      carrierAddress.carrierCode ||
                      carrierAddress.carrier_code ||
                      'carrier address'
                    onDeleteClick(id, carrierAddressName)
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

  return carrierAddressColumns
}
