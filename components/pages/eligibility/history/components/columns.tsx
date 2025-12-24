import Link from 'next/link'
import GridActionButtons from '@/components/ui/buttons/grid-action-buttons/GridActionButtons'

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
        <Link href={`/eligibility/history/${record.id || record.uuid}`}>
          <div className="text-gray-900 font-semibold hover:text-blue-600 truncate">
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
            <div className="text-gray-900 truncate">
              {record.subscriber.member_id ||
                record.subscriber.name ||
                record.subscriberId ||
                record.subscriber_id ||
                'N/A'}
            </div>
          )
        }
        return (
          <div className="text-gray-900 truncate">
            {record.subscriber || record.subscriberId || record.subscriber_id || 'N/A'}
          </div>
        )
      },
    },
    {
      key: 'provider',
      label: 'Provider',
      width: '12%',
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
            <div className="text-gray-900 truncate" title={displayText}>
              {displayText}
            </div>
          )
        }
        return (
          <div
            className="text-gray-900 truncate"
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
        <div className="text-gray-900 truncate">
          {formatDateOnly(record.serviceDate || record.service_date)}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '10%',
      align: 'left' as const,
      render: (value: any, record: any) => {
        const status = record.status || record.queueStatus || record.queue_status || 'N/A'
        const statusColor =
          status === 'success' || status === 'completed'
            ? 'bg-green-100 text-green-800'
            : status === 'failed' || status === 'error'
              ? 'bg-red-100 text-red-800'
              : status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : status === 'processing'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
        return (
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColor}`}>
            {status}
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
        const resp = record.has_response
        const respColor = resp === true ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        return (
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${respColor}`}>
            {resp === true ? 'Success' : 'Failed'}
          </span>
        )
      },
    },
    {
      key: 'responseReceivedAt',
      label: 'Response Received At',
      width: '12%',
      align: 'left' as const,
      render: (value: any, record: any) => (
        <div className="text-gray-900 truncate">
          {formatDate(
            record.responseReceivedAt || record.response_received_at || record.responseReceivedAt
          )}
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created At',
      width: '12%',
      align: 'left' as const,
      render: (value: any, record: any) => (
        <div className="text-gray-900 truncate">
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
                  ? (id: string) => {
                      onRetryClick(id)
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
