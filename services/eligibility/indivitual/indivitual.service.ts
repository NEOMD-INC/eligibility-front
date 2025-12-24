import api from '@/lib/api/axios'

export const EligibilityIndivitualService = {
  getEligibilityIndivitualNpiPractice: () => {
    return api.get(`/eligibility-practice`)
  },

  updateEligibilityIndivitualNpiPractice: (userData: {}) => {
    return api.post('/eligibility-practice/save', userData)
  },

  addEligibilityIndivitualNpiPractice: (userData: {}) => {
    return api.post('/eligibility-check/store', userData)
  },
  verifyNpiNumber: (npiNumber: string) => {
    return api.get(`/verify-npi/${npiNumber}`)
  },
}
