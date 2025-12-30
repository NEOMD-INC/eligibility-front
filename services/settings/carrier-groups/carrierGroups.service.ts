import api from '@/lib/api/axios'

export const CarrierGroupService = {
  getAllCarrierGroups: (
    page: number,
    filters?: {
      description?: string
      code?: string
      filling_indicator?: string
      status?: string
    }
  ) => {
    const params = new URLSearchParams({
      page: String(page),
    })

    if (filters?.description) {
      params.append('description', filters.description)
    }

    if (filters?.code) {
      params.append('code', filters.code)
    }

    if (filters?.filling_indicator) {
      params.append('filling_indicator', filters.filling_indicator)
    }

    if (filters?.status) {
      params.append('status', filters.status)
    }

    return api.get(`/carrier-groups?${params.toString()}`)
  },

  getCarrierGroupsById: (userId: string) => {
    return api.get(`/carrier-groups/${userId}`)
  },

  createCarrierGroups: (userData: any) => {
    return api.post('/carrier-groups/store', userData)
  },

  updateCarrierGroups: (userId: string, userData: any) => {
    return api.put(`/carrier-groups/${userId}/update`, userData)
  },

  deleteCarrierGroups: (userId: string) => {
    return api.delete(`/carrier-groups/${userId}/delete`)
  },
}
