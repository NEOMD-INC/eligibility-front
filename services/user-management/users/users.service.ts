import api from '@/lib/api/axios'

export const userService = {
  getAllUsers: (
    page: number,
    filters?: {
      search?: string
      role?: string
    }
  ) => {
    const params = new URLSearchParams({
      page: String(page),
    })

    if (filters?.search) {
      params.append('search', filters.search)
    }

    if (filters?.role) {
      params.append('role', filters.role)
    }

    return api.get(`/users?${params.toString()}`)
  },

  getUserById: (userId: string) => {
    return api.get(`/users/${userId}`)
  },

  createUser: (userData: {}) => {
    return api.post('/users/store', userData)
  },

  updateUser: (userId: string, userData: {}) => {
    return api.put(`/users/${userId}/update`, userData)
  },

  deleteUser: (userId: string) => {
    return api.delete(`/users/${userId}/delete`)
  },
}
