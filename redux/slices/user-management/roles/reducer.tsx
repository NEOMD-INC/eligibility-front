import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { rolesService } from '@/services/user-management/roles/roles.service'
import type { Role, RolesState } from '@/types'

const initialState: RolesState = {
  roles: [],
  currentRole: null,
  loading: false,
  error: null,
  totalItems: 0,
  currentPage: 1,
  itemsPerPage: 10,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  fetchRoleLoading: false,
}

// Async thunk to fetch all roles
export const fetchAllRoles = createAsyncThunk(
  'roles/fetchAllRoles',
  async (
    params: {
      page: number
      filters?: {
        search?: string
        role?: string
      }
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await rolesService.getAllRoles(params.page, params.filters)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to fetch roles'
      )
    }
  }
)

// Async thunk to fetch role by ID
export const fetchRoleById = createAsyncThunk(
  'roles/fetchRoleById',
  async (roleId: string, { rejectWithValue }) => {
    try {
      const response = await rolesService.getRoleById(roleId)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to fetch role details'
      )
    }
  }
)

// Async thunk to create role
export const createRole = createAsyncThunk(
  'roles/createRole',
  async (roleData: {}, { rejectWithValue }) => {
    try {
      const response = await rolesService.createRole(roleData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to create role'
      )
    }
  }
)

// Async thunk to update role
export const updateRole = createAsyncThunk(
  'roles/updateRole',
  async (
    params: { roleId: string; roleData: {} },
    { rejectWithValue }
  ) => {
    try {
      const response = await rolesService.updateRole(params.roleId, params.roleData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to update role'
      )
    }
  }
)

// Async thunk to delete role
export const deleteRole = createAsyncThunk(
  'roles/deleteRole',
  async (roleId: string, { rejectWithValue }) => {
    try {
      const response = await rolesService.deleteRole(roleId)
      return { roleId, data: response.data }
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to delete role'
      )
    }
  }
)

const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    clearRolesError: state => {
      state.error = null
    },
    clearCurrentRole: state => {
      state.currentRole = null
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
  },
  extraReducers: builder => {
    // Fetch all roles
    builder
      .addCase(fetchAllRoles.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllRoles.fulfilled, (state, action) => {
        state.loading = false
        // Handle different response structures
        // API might return various structures like:
        // - { data: [...], total: 100, ... } (Laravel pagination)
        // - { data: [...], meta: { total: 100 } } (Laravel with meta)
        // - { data: { data: [...], total: 100 } } (nested)
        // - [...] (direct array)
        const payload = action.payload
        
        // Check for nested data structure: { data: { data: [...] }, meta: { pagination: {...} } }
        if (payload?.data?.data && Array.isArray(payload.data.data)) {
          const dataArray = payload.data.data
          state.roles = payload.data.data
          
          // Check meta.pagination for pagination info
          if (payload.meta?.pagination) {
            const pagination = payload.meta.pagination
            state.totalItems = pagination.total || 0
            state.currentPage = pagination.current_page || state.currentPage
            state.itemsPerPage = pagination.per_page || state.itemsPerPage
          } else {
            // Fallback: try to get total from other locations
            const apiTotal = payload.data.total || payload.meta?.total || payload.total
            if (apiTotal !== undefined && apiTotal !== null) {
              state.totalItems = apiTotal
            } else if (dataArray.length > 0) {
              if (dataArray.length === state.itemsPerPage) {
                if (state.totalItems === 0) {
                  state.totalItems = state.currentPage * state.itemsPerPage
                }
              } else {
                state.totalItems = (state.currentPage - 1) * state.itemsPerPage + dataArray.length
              }
            }
          }
        } else if (payload?.data && Array.isArray(payload.data)) {
          const dataArray = payload.data
          state.roles = payload.data
          
          // Check meta.pagination for pagination info
          if (payload.meta?.pagination) {
            const pagination = payload.meta.pagination
            state.totalItems = pagination.total || 0
            state.currentPage = pagination.current_page || state.currentPage
            state.itemsPerPage = pagination.per_page || state.itemsPerPage
          } else {
            // Fallback
            const apiTotal = payload.total || payload.meta?.total
            if (apiTotal !== undefined && apiTotal !== null) {
              state.totalItems = apiTotal
            } else if (dataArray.length > 0) {
              if (dataArray.length === state.itemsPerPage) {
                if (state.totalItems === 0) {
                  state.totalItems = state.currentPage * state.itemsPerPage
                }
              } else {
                state.totalItems = (state.currentPage - 1) * state.itemsPerPage + dataArray.length
              }
            }
          }
        } else if (Array.isArray(payload)) {
          // Direct array: [...]
          state.roles = payload
          state.totalItems = payload.length
        } else {
          state.roles = []
          state.totalItems = 0
        }
        state.error = null
      })
      .addCase(fetchAllRoles.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Fetch role by ID
    builder
      .addCase(fetchRoleById.pending, state => {
        state.fetchRoleLoading = true
        state.error = null
      })
      .addCase(fetchRoleById.fulfilled, (state, action) => {
        state.fetchRoleLoading = false
        state.currentRole =
          action.payload?.data || action.payload || null
        state.error = null
      })
      .addCase(fetchRoleById.rejected, (state, action) => {
        state.fetchRoleLoading = false
        state.error = action.payload as string
      })

    // Create role
    builder
      .addCase(createRole.pending, state => {
        state.createLoading = true
        state.error = null
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.createLoading = false
        // Optionally add the new role to the list
        if (action.payload?.data) {
          state.roles.unshift(action.payload.data)
          state.totalItems += 1
        }
        state.error = null
      })
      .addCase(createRole.rejected, (state, action) => {
        state.createLoading = false
        state.error = action.payload as string
      })

    // Update role
    builder
      .addCase(updateRole.pending, state => {
        state.updateLoading = true
        state.error = null
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.updateLoading = false
        // Update role in the list
        const updatedRole = action.payload?.data || action.payload
        if (updatedRole?.id) {
          const index = state.roles.findIndex(r => r.id === updatedRole.id)
          if (index !== -1) {
            state.roles[index] = updatedRole
          }
          // Update current role if it's the same
          if (state.currentRole?.id === updatedRole.id) {
            state.currentRole = updatedRole
          }
        }
        state.error = null
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.updateLoading = false
        state.error = action.payload as string
      })

    // Delete role
    builder
      .addCase(deleteRole.pending, state => {
        state.deleteLoading = true
        state.error = null
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.deleteLoading = false
        // Remove role from the list
        if (action.payload?.roleId) {
          state.roles = state.roles.filter(r => r.id !== action.payload.roleId)
          state.totalItems = Math.max(0, state.totalItems - 1)
        }
        state.error = null
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.deleteLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearRolesError, clearCurrentRole, setCurrentPage } =
  rolesSlice.actions
export default rolesSlice.reducer

