import api from '@/lib/api/axios'

export const EligibilitySettingsService = {
  getAvailityEligibilitySettings: () => {
    return api.get(`/eligibility-settings`)
  },

  updateEligibilitySettings: (userData: {}) => {
    return api.put('/eligibility-update-settings', userData)
  },
}
