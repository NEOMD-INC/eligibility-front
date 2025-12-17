import api from '@/lib/api/axios'

export const CarrierSetupsService = {
  getAllCarrierSetups: (page: number) => {
    const params = new URLSearchParams({
      page: String(page),
    })

    return api.get(`/carrier-setups?${params.toString()}`)
  },

  getCarrierSetupsById: (userId: string) => {
    return api.get(`/carrier-setups/${userId}`)
  },

  createCarrierSetups: (userData: {}) => {
    return api.post('/carrier-setups/store', userData)
  },

  updateCarrierSetups: (userId: string, userData: {}) => {
    return api.put(`/carrier-setups/${userId}/update`, userData)
  },

  deleteCarrierSetups: (userId: string) => {
    return api.delete(`/carrier-setups/${userId}/delete`)
  },
}
