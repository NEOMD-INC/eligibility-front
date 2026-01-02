import Link from 'next/link'

import GridActionButtons from '@/components/ui/buttons/grid-action-buttons/GridActionButtons'
import { themeColors } from '@/theme'

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
          <div
            className="font-semibold truncate"
            style={{ color: themeColors.text.primary }}
            onMouseEnter={e => (e.currentTarget.style.color = themeColors.text.link)}
            onMouseLeave={e => (e.currentTarget.style.color = themeColors.text.primary)}
          >
            {payer.payer_id || payer.payerId || 'N/A'}
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
        <div className="truncate" style={{ color: themeColors.text.primary }}>
          {payer.payer_name || payer.payerName || 'N/A'}
        </div>
      ),
    },
    {
      key: 'payerCode',
      label: 'Payer Code',
      width: '15%',
      align: 'left' as const,
      render: (value: any, payer: any) => (
        <div className="truncate" style={{ color: themeColors.text.primary }}>
          {payer.payer_code || payer.payerCode || 'N/A'}
        </div>
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
        return (
          <div
            className="truncate"
            style={{ color: themeColors.text.primary }}
          >{`${city}, ${state}`}</div>
        )
      },
    },
    {
      key: 'status',
      label: 'Status',
      width: '15%',
      align: 'center' as const,
      render: (value: any, payer: any) => {
        const statusValue =
          typeof payer.is_active === 'boolean'
            ? payer.is_active
            : typeof payer.status === 'boolean'
              ? payer.status
              : payer.is_active === 1 ||
                payer.is_active === '1' ||
                payer.status === 'active' ||
                payer.status === 'Active' ||
                payer.isActive
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
                ? (id: string | number) => {
                    const payerName: string =
                      payer.payer_name ||
                      payer.payerName ||
                      payer.payer_id ||
                      payer.payerId ||
                      'payer'
                    onDeleteClick(String(id), payerName)
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
