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

  const eligibilityLogColumns = [
    {
      key: 'neoReferenceId',
      label: 'Neo Reference Id',
      width: '15%',
      align: 'left' as const,
      render: (value: any, log: any) => (
        <Link href={`/logs/${log.id || log.uuid}`}>
          <div className="text-gray-900 font-semibold hover:text-blue-600">
            {log.neoReferenceId || log.neo_reference_id || 'N/A'}
          </div>
        </Link>
      ),
    },
    {
      key: 'subscriber',
      label: 'Subscriber',
      width: '15%',
      align: 'left' as const,
      render: (value: any, log: any) => {
        let subscriberValue = log.subscriber || log.subscriberId || log.subscriber_id
        if (subscriberValue && typeof subscriberValue === 'object') {
          subscriberValue =
            subscriberValue.name || subscriberValue.member_id || subscriberValue.id || 'N/A'
        }
        return <div className="text-gray-900 ">{subscriberValue || 'N/A'}</div>
      },
    },
    {
      key: 'provider',
      label: 'Provider',
      width: '15%',
      align: 'left' as const,
      render: (value: any, log: any) => {
        let providerValue = log.provider || log.providerName || log.provider_name
        if (providerValue && typeof providerValue === 'object') {
          providerValue = providerValue.name || providerValue.npi || providerValue.id || 'N/A'
        }
        return <div className="text-gray-900">{providerValue || 'N/A'}</div>
      },
    },
    {
      key: 'serviceDate',
      label: 'Service Date',
      width: '12%',
      align: 'left' as const,
      render: (value: any, log: any) => (
        <div className="text-gray-900">{log.serviceDate || log.service_date}</div>
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
          status === 'completed'
            ? 'bg-green-100 text-green-800'
            : status === 'rejected'
              ? 'bg-red-100 text-red-800'
              : status === 'in_process'
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
      key: 'response message',
      label: 'Response Message',
      width: '12%',
      align: 'left' as const,
      render: (value: any, log: any) => {
        const responseMessage = log.response_message || 'N/A'
        return (
          <div
            className="text-gray-900 truncate cursor-help block"
            style={{ minWidth: 0 }}
            title={responseMessage !== 'N/A' ? responseMessage : undefined}
          >
            {responseMessage}
          </div>
        )
      },
    },
    {
      key: 'sentAt',
      label: 'Sent At',
      width: '18%',
      align: 'left' as const,
      render: (value: any, log: any) => (
        <div className="text-gray-900">{formatDate(log.request_sent_at)}</div>
      ),
    },
    {
      key: 'responseReceivedAt',
      label: 'Response Received At',
      width: '18%',
      align: 'left' as const,
      render: (value: any, log: any) => (
        <div className="text-gray-900">{formatDate(log.response_received_at)}</div>
      ),
    },
    {
      key: 'totalTime',
      label: 'Total Time',
      width: '12%',
      align: 'left' as const,
      render: (value: any, log: any) => (
        <div className="text-gray-900">{log.response_time.time}</div>
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
            data={{ ...log, id: log.eligibility_id || log.id || log.uuid }}
            from="id"
            editBtnPath={`/eligibility/indivitual?logId=${log.eligibility_id}`}
            showBtnPath={`/logs/logs-detail/${log.eligibility_id}`}
            retryResourceId={
              onRetryClick && log.eligibility_id
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
              log.status === 'rejected'
                ? false
                : log.status === 'pending' || log.status === 'in_process'
                  ? false
                  : true
            }
            updatePermission={
              log.status === 'completed'
                ? false
                : log.status === 'pending' || log.status === 'in_process'
                  ? false
                  : true
            }
            deletePermission={false}
            retryPermission={
              log.status === 'completed'
                ? false
                : log.status === 'pending' || log.status === 'in_process'
                  ? false
                  : true
            }
            isUser={false}
            isPending={log.status === 'pending' || log.status === 'in_process' ? true : false}
          />
        </div>
      ),
    },
  ]

  return eligibilityLogColumns
}
