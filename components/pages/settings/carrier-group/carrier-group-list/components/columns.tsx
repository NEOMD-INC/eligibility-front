import Link from 'next/link'

import GridActionButtons from '@/components/ui/buttons/grid-action-buttons/GridActionButtons'
import { themeColors } from '@/theme'

interface CarrierGroupListColumnsProps {
  onDeleteClick?: (id: string, carrierGroupName: string) => void
}

export default function CarrierGroupListColumns({
  onDeleteClick,
}: CarrierGroupListColumnsProps = {}) {
  const carrierGroupColumns = [
    {
      key: 'description',
      label: 'Description',
      width: '25%',
      align: 'left' as const,
      render: (value: any, carrierGroup: any) => (
        <Link href={`/settings/carrier-group/${carrierGroup.id || carrierGroup.uuid}`}>
          <div
            className="font-semibold truncate"
            style={{ color: themeColors.text.primary }}
            onMouseEnter={e => (e.currentTarget.style.color = themeColors.text.link)}
            onMouseLeave={e => (e.currentTarget.style.color = themeColors.text.primary)}
          >
            {carrierGroup.carrier_group_description || carrierGroup.description || 'N/A'}
          </div>
        </Link>
      ),
    },
    {
      key: 'code',
      label: 'Code',
      width: '20%',
      align: 'left' as const,
      render: (value: any, carrierGroup: any) => (
        <div className="truncate" style={{ color: themeColors.text.primary }}>
          {carrierGroup.carrier_group_code || carrierGroup.code || 'N/A'}
        </div>
      ),
    },
    {
      key: 'fillingIndicator',
      label: 'Filling Indicator',
      width: '20%',
      align: 'left' as const,
      render: (value: any, carrierGroup: any) => (
        <div className="truncate" style={{ color: themeColors.text.primary }}>
          {carrierGroup.fillingIndicator || carrierGroup.filling_indicator || 'N/A'}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '15%',
      align: 'center' as const,
      render: (value: any, carrierGroup: any) => {
        const statusValue =
          typeof carrierGroup.status === 'boolean'
            ? carrierGroup.status
            : carrierGroup.status === 'active' ||
              carrierGroup.status === 'Active' ||
              carrierGroup.isActive ||
              carrierGroup.is_active
        const status = statusValue ? 'Active' : 'Inactive'
        const bgColor = status === 'Active' ? themeColors.green[100] : themeColors.red[100]
        const textColor = status === 'Active' ? themeColors.green[600] : themeColors.red[700]
        return (
          <div className="flex justify-center">
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
              style={{ backgroundColor: bgColor, color: textColor }}
            >
              {status}
            </span>
          </div>
        )
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '20%',
      align: 'center' as const,
      render: (value: any, carrierGroup: any) => (
        <div className="flex justify-center items-center w-full">
          <GridActionButtons
            data={carrierGroup}
            from="id"
            editBtnPath={`/settings/carrier-group/edit/${carrierGroup.id || carrierGroup.uuid}`}
            showBtnPath={`/settings/carrier-group/${carrierGroup.id || carrierGroup.uuid}`}
            deleteResourceId={
              onDeleteClick
                ? (id: string) => {
                    const carrierGroupName: string =
                      carrierGroup.carrier_group_description ||
                      carrierGroup.description ||
                      carrierGroup.carrier_group_code ||
                      carrierGroup.code ||
                      'carrier group'
                    onDeleteClick(id, carrierGroupName)
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

  return carrierGroupColumns
}
