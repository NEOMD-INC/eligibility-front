import api from '@/lib/api/axios'

export const PatientDashboardService = {
  getPatientDashboardDetails: () => {
    return api.get(`/eligibility-check/fd566a15-488b-4eb4-bc31-15cf8f4f2bfa`)
  },
}
