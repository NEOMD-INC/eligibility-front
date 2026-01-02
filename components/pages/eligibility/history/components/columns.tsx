import Link from 'next/link'

import GridActionButtons from '@/components/ui/buttons/grid-action-buttons/GridActionButtons'
import { themeColors } from '@/theme'

interface EligibilityHistoryColumnsProps {
  onRetryClick?: (id: string) => void
}

export default function EligibilityHistoryColumns({
  onRetryClick,
}: EligibilityHistoryColumnsProps = {}) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateString
    }
  }

  const formatDateOnly = (dateString?: string) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    } catch {
      return dateString
    }
  }

  const eligibilityHistoryColumns = [
    {
      key: 'neoRef',
      label: 'Neo Ref',
      width: '12%',
      align: 'left' as const,
      render: (value: any, record: any) => (
        <Link href={`#`}>
          <div
            className="font-semibold truncate"
            style={{ color: themeColors.text.primary }}
            onMouseEnter={e => (e.currentTarget.style.color = themeColors.text.link)}
            onMouseLeave={e => (e.currentTarget.style.color = themeColors.text.primary)}
          >
            {record.neo_reference_id || 'N/A'}
          </div>
        </Link>
      ),
    },
    {
      key: 'subscriber',
      label: 'Subscriber',
      width: '12%',
      align: 'left' as const,
      render: (value: any, record: any) => {
        if (record.subscriber && typeof record.subscriber === 'object') {
          return (
            <div className="truncate" style={{ color: themeColors.text.primary }}>
              {record.subscriber.member_id ||
                record.subscriber.name ||
                record.subscriberId ||
                record.subscriber_id ||
                'N/A'}
            </div>
          )
        }
        return (
          <div className="truncate" style={{ color: themeColors.text.primary }}>
            {record.subscriber || record.subscriberId || record.subscriber_id || 'N/A'}
          </div>
        )
      },
    },
    {
      key: 'provider',
      label: 'Provider',
      width: '20%',
      align: 'left' as const,
      render: (value: any, record: any) => {
        if (record.provider && typeof record.provider === 'object') {
          const providerName = record.provider.name || record.provider.provider_name || ''
          const providerNpi = record.provider.npi || ''
          const displayText = providerName
            ? providerNpi
              ? `${providerName} (${providerNpi})`
              : providerName
            : providerNpi || 'N/A'
          return (
            <div style={{ color: themeColors.text.primary }} title={displayText}>
              {displayText}
            </div>
          )
        }
        return (
          <div
            className="truncate"
            style={{ color: themeColors.text.primary }}
            title={record.provider || record.providerName || record.provider_name || ''}
          >
            {record.provider || record.providerName || record.provider_name || 'N/A'}
          </div>
        )
      },
    },
    {
      key: 'serviceDate',
      label: 'Service Date',
      width: '10%',
      align: 'left' as const,
      render: (value: any, record: any) => (
        <div className="truncate" style={{ color: themeColors.text.primary }}>
          {formatDateOnly(record.serviceDate || record.service_date)}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Coverage Eligibility',
      width: '10%',
      align: 'left' as const,
      render: (value: any, record: any) => {
        const status =
          record.coverage?.plan_status || record.plan_status || record.coverage_status || 'N/A'
        let bgColor: string
        let textColor: string
        if (status === 'active') {
          bgColor = themeColors.green[100]
          textColor = themeColors.green[600]
        } else if (status === 'in-active' || status === 'inactive') {
          bgColor = themeColors.red[100]
          textColor = themeColors.red[700]
        } else {
          bgColor = '#fef3c7'
          textColor = '#92400e'
        }

        return (
          <span
            className="px-2 py-1 text-xs font-semibold rounded-full"
            style={{ backgroundColor: bgColor, color: textColor }}
          >
            {status && status !== 'N/A' ? status : '-'}
          </span>
        )
      },
    },
    {
      key: 'response',
      label: 'Response',
      width: '15%',
      align: 'left' as const,
      render: (value: any, record: any) => {
        const resp = record.status || record.response_status || 'N/A'
        let bgColor: string
        let textColor: string
        if (resp === 'completed' || resp === 'success') {
          bgColor = themeColors.green[100]
          textColor = themeColors.green[600]
        } else if (resp === 'in_process' || resp === 'pending' || resp === 'processing') {
          bgColor = '#fef3c7'
          textColor = '#92400e'
        } else {
          bgColor = themeColors.red[100]
          textColor = themeColors.red[700]
        }
        return (
          <span
            className="px-2 py-1 text-xs font-semibold rounded-full"
            style={{ backgroundColor: bgColor, color: textColor }}
          >
            {resp === 'completed' || resp === 'success'
              ? 'Success'
              : resp === 'in_process' || resp === 'pending' || resp === 'processing'
                ? 'Pending'
                : 'Failed'}
          </span>
        )
      },
    },
    {
      key: 'responseReceivedAt',
      label: 'Response Received At',
      width: '18%',
      align: 'left' as const,
      render: (value: any, record: any) => (
        <div style={{ color: themeColors.text.primary }}>
          {formatDate(
            record.responseReceivedAt ||
              record.response_received_at ||
              record.updated_at ||
              record.updatedAt
          )}
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created At',
      width: '18%',
      align: 'left' as const,
      render: (value: any, record: any) => (
        <div style={{ color: themeColors.text.primary }}>
          {formatDate(record.createdAt || record.created_at || record.created)}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '12%',
      align: 'center' as const,
      render: (value: any, record: any) => {
        const historyId = record.eligibility_id
        return (
          <div className="flex justify-center items-center w-full">
            <GridActionButtons
              data={{ ...record, id: historyId }}
              from="id"
              editBtnPath={historyId ? `/eligibility/indivitual?logId=${historyId}` : '#'}
              showBtnPath={`/patient-dashboard?logId=${historyId}`}
              retryResourceId={
                onRetryClick && historyId
                  ? (id: string | number) => {
                      onRetryClick(String(id))
                    }
                  : undefined
              }
              showIdDispatch={() => {}}
              editIdDispatch={() => {}}
              editDrawerId=""
              showDrawerId=""
              viewPermission={
                record.status === 'rejected'
                  ? false
                  : record.status === 'pending' || record.status === 'in_process'
                    ? false
                    : true
              }
              updatePermission={
                record.status === 'completed'
                  ? false
                  : record.status === 'pending' || record.status === 'in_process'
                    ? false
                    : true
              }
              deletePermission={false}
              retryPermission={
                record.status === 'completed'
                  ? false
                  : record.status === 'pending' || record.status === 'in_process'
                    ? false
                    : true
              }
              isUser={false}
              isPending={
                record.status === 'pending' || record.status === 'in_process' ? true : false
              }
            />
          </div>
        )
      },
    },
  ]

  return eligibilityHistoryColumns
}
