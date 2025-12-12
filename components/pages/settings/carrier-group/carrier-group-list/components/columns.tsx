import GridActionButtons from '@/components/ui/buttons/grid-action-buttons/GridActionButtons'
import Link from 'next/link'

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
          <div className="text-gray-900 font-semibold hover:text-blue-600 truncate">
            {carrierGroup.description || 'N/A'}
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
        <div className="text-gray-900 truncate">{carrierGroup.code || 'N/A'}</div>
      ),
    },
    {
      key: 'fillingIndicator',
      label: 'Filling Indicator',
      width: '20%',
      align: 'left' as const,
      render: (value: any, carrierGroup: any) => (
        <div className="text-gray-900 truncate">
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
        const status = carrierGroup.status || carrierGroup.isActive ? 'Active' : 'Inactive'
        const statusClass =
          status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        return (
          <div className="flex justify-center">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusClass}`}
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
                      carrierGroup.description || carrierGroup.code || 'carrier group'
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

