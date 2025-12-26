import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { permissionsService } from '@/services/user-management/permissions/permissions.service'

interface Permission {
  id: string
  uuid?: string
  name: string
  guard_name?: string
  description?: string
  created_at?: string
  updated_at?: string
}

interface PermissionsState {
  permissions: Permission[]
  currentPermission: Permission | null
  loading: boolean
  error: string | null
  totalItems: number
  currentPage: number
  itemsPerPage: number
  // Individual operation states
  createLoading: boolean
  updateLoading: boolean
  deleteLoading: boolean
  fetchPermissionLoading: boolean
}

const initialState: PermissionsState = {
  permissions: [],
  currentPermission: null,
  loading: false,
  error: null,
  totalItems: 0,
  currentPage: 1,
  itemsPerPage: 8,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  fetchPermissionLoading: false,
}

// Async thunk to fetch all permissions
export const fetchAllPermissions = createAsyncThunk(
  'permissions/fetchAllPermissions',
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
      const response = await permissionsService.getAllPermissions(params.page, params.filters)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch permissions')
    }
  }
)

// Async thunk to fetch permission by ID
export const fetchPermissionById = createAsyncThunk(
  'permissions/fetchPermissionById',
  async (permissionId: string, { rejectWithValue }) => {
    try {
      const response = await permissionsService.getPermissionById(permissionId)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch permission details')
    }
  }
)

// Async thunk to create permission
export const createPermission = createAsyncThunk(
  'permissions/createPermission',
  async (permissionData: {}, { rejectWithValue }) => {
    try {
      const response = await permissionsService.createPermission(permissionData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to create permission')
    }
  }
)

// Async thunk to update permission
export const updatePermission = createAsyncThunk(
  'permissions/updatePermission',
  async (params: { permissionId: string; permissionData: {} }, { rejectWithValue }) => {
    try {
      const response = await permissionsService.updatePermission(
        params.permissionId,
        params.permissionData
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to update permission')
    }
  }
)

// Async thunk to delete permission
export const deletePermission = createAsyncThunk(
  'permissions/deletePermission',
  async (permissionId: string, { rejectWithValue }) => {
    try {
      const response = await permissionsService.deletePermission(permissionId)
      return { permissionId, data: response.data }
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to delete permission')
    }
  }
)

const permissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    clearPermissionsError: state => {
      state.error = null
    },
    clearCurrentPermission: state => {
      state.currentPermission = null
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
  },
  extraReducers: builder => {
    // Fetch all permissions
    builder
      .addCase(fetchAllPermissions.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllPermissions.fulfilled, (state, action) => {
        state.loading = false
        // Handle different response structures
        const payload = action.payload

        // Check for nested data structure: { data: { data: [...] }, meta: { pagination: {...} } }
        if (payload?.data?.data && Array.isArray(payload.data.data)) {
          const dataArray = payload.data.data
          state.permissions = payload.data.data

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
          state.permissions = payload.data

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
          state.permissions = payload
          state.totalItems = payload.length
        } else {
          state.permissions = []
          state.totalItems = 0
        }
        state.error = null
      })
      .addCase(fetchAllPermissions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Fetch permission by ID
    builder
      .addCase(fetchPermissionById.pending, state => {
        state.fetchPermissionLoading = true
        state.error = null
      })
      .addCase(fetchPermissionById.fulfilled, (state, action) => {
        state.fetchPermissionLoading = false
        state.currentPermission = action.payload?.data || action.payload || null
        state.error = null
      })
      .addCase(fetchPermissionById.rejected, (state, action) => {
        state.fetchPermissionLoading = false
        state.error = action.payload as string
      })

    // Create permission
    builder
      .addCase(createPermission.pending, state => {
        state.createLoading = true
        state.error = null
      })
      .addCase(createPermission.fulfilled, (state, action) => {
        state.createLoading = false
        // Optionally add the new permission to the list
        if (action.payload?.data) {
          state.permissions.unshift(action.payload.data)
          state.totalItems += 1
        }
        state.error = null
      })
      .addCase(createPermission.rejected, (state, action) => {
        state.createLoading = false
        state.error = action.payload as string
      })

    // Update permission
    builder
      .addCase(updatePermission.pending, state => {
        state.updateLoading = true
        state.error = null
      })
      .addCase(updatePermission.fulfilled, (state, action) => {
        state.updateLoading = false
        // Update permission in the list
        const updatedPermission = action.payload?.data || action.payload
        if (updatedPermission?.id) {
          const index = state.permissions.findIndex(p => p.id === updatedPermission.id)
          if (index !== -1) {
            state.permissions[index] = updatedPermission
          }
          // Update current permission if it's the same
          if (state.currentPermission?.id === updatedPermission.id) {
            state.currentPermission = updatedPermission
          }
        }
        state.error = null
      })
      .addCase(updatePermission.rejected, (state, action) => {
        state.updateLoading = false
        state.error = action.payload as string
      })

    // Delete permission
    builder
      .addCase(deletePermission.pending, state => {
        state.deleteLoading = true
        state.error = null
      })
      .addCase(deletePermission.fulfilled, (state, action) => {
        state.deleteLoading = false
        // Remove permission from the list
        if (action.payload?.permissionId) {
          state.permissions = state.permissions.filter(p => p.id !== action.payload.permissionId)
          state.totalItems = Math.max(0, state.totalItems - 1)
        }
        state.error = null
      })
      .addCase(deletePermission.rejected, (state, action) => {
        state.deleteLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearPermissionsError, clearCurrentPermission, setCurrentPage } =
  permissionsSlice.actions
export default permissionsSlice.reducer
