import api from '@/lib/api/axios'

export const LogsService = {
  getAllLogs: (
    page: number,
    filters?: {
      name?: string
      subscriber_id?: string
      status?: string
      queue_status?: string
      service_date_from?: string
      service_date_to?: string
    }
  ) => {
    const params = new URLSearchParams({
      page: String(page),
    })

    if (filters?.name) {
      params.append('name', filters.name)
    }

    if (filters?.subscriber_id) {
      params.append('subscriber_id', filters.subscriber_id)
    }

    if (filters?.queue_status) {
      params.append('queue_status', filters.queue_status)
    }

    if (filters?.status) {
      params.append('status', filters.status)
    }

    if (filters?.service_date_from) {
      params.append('service_date_from', filters.service_date_from)
    }

    if (filters?.service_date_to) {
      params.append('service_date_to', filters.service_date_to)
    }

    return api.get(`/eligibility-logs?${params.toString()}`)
  },
  getLogById: (userId: string) => {
    return api.get(`/eligibility-logs/${userId}`)
  },
}
