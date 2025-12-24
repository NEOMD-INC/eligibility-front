import api from '@/lib/api/axios'

export const PatientDashboardService = {
  getPatientDashboardDetails: (logId: string) => {
    return api.get(`/eligibility-check/${logId}`)
  },
}
