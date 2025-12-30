import api from '@/lib/api/axios'

export const AvailityPayerService = {
  getAllAvailityPayer: (page?: number) => {
    const params = new URLSearchParams({
      page: String(page || 1),
      per_page: '8',
    })

    return api.get(`/availity-payers?${params.toString()}`)
  },

  getAvailityPayerById: (userId: string) => {
    return api.get(`/availity-payers/${userId}`)
  },

  createAvailityPayer: (userData: any) => {
    return api.post('/availity-payers/store', userData)
  },

  updateAvailityPayer: (userId: string, userData: any) => {
    return api.put(`/availity-payers/${userId}/update`, userData)
  },

  deleteAvailityPayer: (userId: string) => {
    return api.delete(`/availity-payers/${userId}/delete`)
  },

  searchAvailityPayers: (searchTerm: string) => {
    const params = new URLSearchParams({
      payer_name: searchTerm,
    })
    return api.get(`/availity-payers/?${params.toString()}`)
  },
}
