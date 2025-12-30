import Link from 'next/link'

import GridActionButtons from '@/components/ui/buttons/grid-action-buttons/GridActionButtons'
import { themeColors } from '@/theme'

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
      render: (carrierAddress: any) => (
        <Link href={`/settings/carrier-address/${carrierAddress.id || carrierAddress.uuid}`}>
          <div
            className="font-semibold truncate"
            style={{ color: themeColors.text.primary }}
            onMouseEnter={e => (e.currentTarget.style.color = themeColors.text.link)}
            onMouseLeave={e => (e.currentTarget.style.color = themeColors.text.primary)}
          >
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
      render: (carrierAddress: any) => (
        <div className="truncate" style={{ color: themeColors.text.primary }}>
          {carrierAddress.actualName || carrierAddress.actual_name || 'N/A'}
        </div>
      ),
    },
    {
      key: 'addressId',
      label: 'Address ID',
      width: '30%',
      align: 'left' as const,
      render: (carrierAddress: any) => (
        <div className="truncate" style={{ color: themeColors.text.primary }}>
          {carrierAddress.addressId || carrierAddress.address_id || 'N/A'}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '20%',
      align: 'center' as const,
      render: (carrierAddress: any) => (
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
