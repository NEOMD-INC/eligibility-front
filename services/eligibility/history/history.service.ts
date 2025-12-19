import api from '@/lib/api/axios'

interface EligibilityHistoryFilters {
  page?: number
  service_type?: string
  relationship_code?: string
  subscriber_id?: string
  date_from?: string
  date_to?: string
}

export const EligibilityHistoryService = {
  getEligibilityHistory: (filters?: EligibilityHistoryFilters) => {
    const params = new URLSearchParams()

    // if (filters?.page) {
    //   params.append('page', String(filters.page))
    // }
    if (filters?.service_type) {
      params.append('service_type', filters.service_type)
    }
    if (filters?.relationship_code) {
      params.append('relationship_code', filters.relationship_code)
    }
    if (filters?.subscriber_id) {
      params.append('subscriber_id', filters.subscriber_id)
    }
    if (filters?.date_from) {
      params.append('date_from', filters.date_from)
    }
    if (filters?.date_to) {
      params.append('date_to', filters.date_to)
    }

    const queryString = params.toString()
    return api.get(`eligibility-check/history${queryString ? `?${queryString}` : ''}`)
  },
}
