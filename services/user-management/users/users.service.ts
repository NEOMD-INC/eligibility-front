import api from '@/lib/api/axios'

export const userService = {
  getCurrentUserDetail() {
    return api.get('/user-detail')
  },

  updateProfile(data: { name?: string; email?: string }) {
    return api.put('/update-profile', data)
  },

  updatePassword(data: {
    current_password: string
    password: string
    password_confirmation: string
  }) {
    return api.post('/update-password', data)
  },
}
