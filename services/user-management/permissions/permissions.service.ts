import api from '@/lib/api/axios'

export const permissionsService = {
  getAllPermissions: (
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
      params.append('name', filters.search)
    }

    if (filters?.role) {
      params.append('role', filters.role)
    }

    return api.get(`/permissions?${params.toString()}`)
  },
  getPermissionById: (userId: string) => {
    return api.get(`/permissions/${userId}`)
  },

  createPermission: (userData: {}) => {
    return api.post('/permissions/store', userData)
  },

  updatePermission: (userId: string, userData: {}) => {
    return api.put(`/permissions/${userId}/update`, userData)
  },

  deletePermission: (userId: string) => {
    return api.delete(`/permissions/${userId}/delete`)
  },
}
