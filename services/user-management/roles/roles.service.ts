import api from '@/lib/api/axios'

export const rolesService = {
  getAllRoles: (
    page: number,
    filters?: {
      search?: string
      name?: string
    }
  ) => {
    const params = new URLSearchParams({
      page: String(page),
    })

    if (filters?.search) {
      params.append('search', filters.search)
    }

    if (filters?.name) {
      params.append('name', filters.name)
    }

    return api.get(`/roles?${params.toString()}`)
  },
  getRoleById: (userId: string) => {
    return api.get(`/roles/${userId}`)
  },

  createRole: (userData: {}) => {
    return api.post('/roles/store', userData)
  },

  updateRole: (userId: string, userData: {}) => {
    return api.put(`/roles/${userId}/update`, userData)
  },

  deleteRole: (userId: string) => {
    return api.delete(`/roles/${userId}/delete`)
  },
}
