import api from '@/lib/api/axios'

export const CarrierAddressesService = {
  getAllCarrierAddresses: (page: number) => {
    const params = new URLSearchParams({
      page: String(page),
    })

    return api.get(`/carrier-addresses?${params.toString()}`)
  },

  getCarrierAddressesById: (userId: string) => {
    return api.get(`/carrier-addresses/${userId}`)
  },

  createCarrierAddresses: (userData: any) => {
    return api.post('/carrier-addresses/store', userData)
  },

  updateCarrierAddresses: (userId: string, userData: any) => {
    return api.put(`/carrier-addresses/${userId}/update`, userData)
  },

  deleteCarrierAddresses: (userId: string) => {
    return api.delete(`/carrier-addresses/${userId}/delete`)
  },
}
