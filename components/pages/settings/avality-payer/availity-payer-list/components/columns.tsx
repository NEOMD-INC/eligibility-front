import GridActionButtons from '@/components/ui/buttons/grid-action-buttons/GridActionButtons'
import Link from 'next/link'

interface AvailityPayerListColumnsProps {
  onDeleteClick?: (id: string, payerName: string) => void
}

export default function AvailityPayerListColumns({
  onDeleteClick,
}: AvailityPayerListColumnsProps = {}) {
  const availityPayerColumns = [
    {
      key: 'payerId',
      label: 'Payer ID',
      width: '15%',
      align: 'left' as const,
      render: (value: any, payer: any) => (
        <Link href={`/settings/availity-payer/${payer.id || payer.uuid}`}>
          <div className="text-gray-900 font-semibold hover:text-blue-600 truncate">
            {payer.payerId || payer.payer_id || 'N/A'}
          </div>
        </Link>
      ),
    },
    {
      key: 'payerName',
      label: 'Payer Name',
      width: '20%',
      align: 'left' as const,
      render: (value: any, payer: any) => (
        <div className="text-gray-900 truncate">{payer.payerName || payer.payer_name || 'N/A'}</div>
      ),
    },
    {
      key: 'payerCode',
      label: 'Payer Code',
      width: '15%',
      align: 'left' as const,
      render: (value: any, payer: any) => (
        <div className="text-gray-900 truncate">{payer.payerCode || payer.payer_code || 'N/A'}</div>
      ),
    },
    {
      key: 'cityState',
      label: 'City, State',
      width: '15%',
      align: 'left' as const,
      render: (value: any, payer: any) => {
        const city = payer.city || 'N/A'
        const state = payer.state || 'N/A'
        return <div className="text-gray-900 truncate">{`${city}, ${state}`}</div>
      },
    },
    {
      key: 'status',
      label: 'Status',
      width: '10%',
      align: 'left' as const,
      render: (value: any, payer: any) => {
        const status = payer.status || payer.isActive ? 'Active' : 'Inactive'
        const statusColor = status === 'Active' ? 'text-green-600' : 'text-red-600'
        return <div className={`font-semibold ${statusColor}`}>{status}</div>
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '25%',
      align: 'center' as const,
      render: (value: any, payer: any) => (
        <div className="flex justify-center items-center w-full">
          <GridActionButtons
            data={payer}
            from="id"
            editBtnPath={`/settings/availity-payer/edit/${payer.id || payer.uuid}`}
            showBtnPath={`/settings/availity-payer/${payer.id || payer.uuid}`}
            deleteResourceId={
              onDeleteClick
                ? (id: string) => {
                    const payerName: string =
                      payer.payerName ||
                      payer.payer_name ||
                      payer.payerId ||
                      payer.payer_id ||
                      'payer'
                    onDeleteClick(id, payerName)
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

  return availityPayerColumns
}
