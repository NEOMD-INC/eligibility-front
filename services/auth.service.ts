import api from '@/lib/api/axios'

export const authService = {
  register(data: { email: string; password: string }) {
    return api.post('/register', data)
  },

  login(data: { email: string; password: string }) {
    return api.post('/login', data)
  },

  forgotPassword(data: { email: string }) {
    return api.post('/forgot-password', data)
  },

  resetPassword(data: {
    token: string
    email: string
    password: string
    password_confirmation: string
  }) {
    return api.post('/reset-password', data)
  },

  logout() {
    return api.post('/logout')
  },
}
