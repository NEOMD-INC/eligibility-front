import api from '@/lib/api/axios'

export const BulkService = {
  createBulk: (formData: FormData) => {
    return api.post('/eligibility-check/import', formData, {
      // Don't set Content-Type - let axios set it automatically with boundary
      // This ensures the file is sent as binary, not text
      transformRequest: (data) => {
        // Don't transform FormData - send as-is to preserve binary encoding
        if (data instanceof FormData) {
          return data
        }
        return data
      },
    })
  },
}
