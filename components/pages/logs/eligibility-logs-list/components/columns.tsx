import Link from 'next/link'
import GridActionButtons from '@/components/ui/buttons/grid-action-buttons/GridActionButtons'

interface EligibilityLogListColumnsProps {
  onRetryClick?: (id: string) => void
}

export default function EligibilityLogListColumns({
  onRetryClick,
}: EligibilityLogListColumnsProps = {}) {
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

  const eligibilityLogColumns = [
    {
      key: 'neoReferenceId',
      label: 'Neo Reference Id',
      width: '15%',
      align: 'left' as const,
      render: (value: any, log: any) => (
        <Link href={`/logs/${log.id || log.uuid}`}>
          <div className="text-gray-900 font-semibold hover:text-blue-600 truncate">
            {log.neoReferenceId || log.neo_reference_id || 'N/A'}
          </div>
        </Link>
      ),
    },
    {
      key: 'subscriber',
      label: 'Subscriber',
      width: '12%',
      align: 'left' as const,
      render: (value: any, log: any) => (
        <div className="text-gray-900 truncate">
          {log.subscriber || log.subscriberId || log.subscriber_id || 'N/A'}
        </div>
      ),
    },
    {
      key: 'provider',
      label: 'Provider',
      width: '12%',
      align: 'left' as const,
      render: (value: any, log: any) => (
        <div className="text-gray-900 truncate">
          {log.provider || log.providerName || log.provider_name || 'N/A'}
        </div>
      ),
    },
    {
      key: 'serviceDate',
      label: 'Service Date',
      width: '12%',
      align: 'left' as const,
      render: (value: any, log: any) => (
        <div className="text-gray-900 truncate">
          {formatDate(log.serviceDate || log.service_date)}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '10%',
      align: 'left' as const,
      render: (value: any, log: any) => {
        const status = log.status || log.queueStatus || log.queue_status || 'N/A'
        const statusColor =
          status === 'success' || status === 'completed'
            ? 'bg-green-100 text-green-800'
            : status === 'failed' || status === 'error'
              ? 'bg-red-100 text-red-800'
              : status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
        return (
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColor}`}>
            {status}
          </span>
        )
      },
    },
    {
      key: 'responseMessage',
      label: 'Response Message',
      width: '15%',
      align: 'left' as const,
      render: (value: any, log: any) => (
        <div
          className="text-gray-900 truncate"
          title={log.responseMessage || log.response_message || ''}
        >
          {log.responseMessage || log.response_message || 'N/A'}
        </div>
      ),
    },
    {
      key: 'created',
      label: 'Created',
      width: '12%',
      align: 'left' as const,
      render: (value: any, log: any) => (
        <div className="text-gray-900 truncate">
          {formatDate(log.created || log.createdAt || log.created_at)}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '12%',
      align: 'center' as const,
      render: (value: any, log: any) => (
        <div className="flex justify-center items-center w-full">
          <GridActionButtons
            data={log}
            from="id"
            editBtnPath={`/logs/edit/${log.id || log.uuid}`}
            showBtnPath={`/logs/logs-detail/${log.id || log.uuid}`}
            retryResourceId={
              onRetryClick
                ? (id: string) => {
                    onRetryClick(id)
                  }
                : undefined
            }
            showIdDispatch={() => {}}
            editIdDispatch={() => {}}
            editDrawerId=""
            showDrawerId=""
            viewPermission={true}
            updatePermission={true}
            deletePermission={false}
            retryPermission={true}
            isUser={false}
          />
        </div>
      ),
    },
  ]

  return eligibilityLogColumns
}
