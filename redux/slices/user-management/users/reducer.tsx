import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { userService } from '@/services/user-management/users/users.service'
import type { UsersState } from '@/types'

const initialState: UsersState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
  totalItems: 0,
  currentPage: 1,
  itemsPerPage: 8,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  fetchUserLoading: false,
}

// Async thunk to fetch all users
export const fetchAllUsers = createAsyncThunk(
  'users/fetchAllUsers',
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
      const response = await userService.getAllUsers(params.page, params.filters)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch users')
    }
  }
)

// Async thunk to fetch user by ID
export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await userService.getUserById(userId)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch user details')
    }
  }
)

// Async thunk to create user
export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: {}, { rejectWithValue }) => {
    try {
      const response = await userService.createUser(userData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to create user')
    }
  }
)

// Async thunk to update user
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (params: { userId: string; userData: {} }, { rejectWithValue }) => {
    try {
      const response = await userService.updateUser(params.userId, params.userData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to update user')
    }
  }
)

// Async thunk to delete user
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await userService.deleteUser(userId)
      return { userId, data: response.data }
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to delete user')
    }
  }
)

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUsersError: state => {
      state.error = null
    },
    clearCurrentUser: state => {
      state.currentUser = null
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
  },
  extraReducers: builder => {
    // Fetch all users
    builder
      .addCase(fetchAllUsers.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
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
          state.users = payload.data.data

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
          state.users = payload.data

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
          state.users = payload
          state.totalItems = payload.length
        } else {
          state.users = []
          state.totalItems = 0
        }
        state.error = null
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Fetch user by ID
    builder
      .addCase(fetchUserById.pending, state => {
        state.fetchUserLoading = true
        state.error = null
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.fetchUserLoading = false
        state.currentUser = action.payload?.data || action.payload || null
        state.error = null
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.fetchUserLoading = false
        state.error = action.payload as string
      })

    // Create user
    builder
      .addCase(createUser.pending, state => {
        state.createLoading = true
        state.error = null
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.createLoading = false
        // Optionally add the new user to the list
        if (action.payload?.data) {
          state.users.unshift(action.payload.data)
          state.totalItems += 1
        }
        state.error = null
      })
      .addCase(createUser.rejected, (state, action) => {
        state.createLoading = false
        state.error = action.payload as string
      })

    // Update user
    builder
      .addCase(updateUser.pending, state => {
        state.updateLoading = true
        state.error = null
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updateLoading = false
        // Update user in the list
        const updatedUser = action.payload?.data || action.payload
        if (updatedUser?.id) {
          const index = state.users.findIndex(u => u.id === updatedUser.id)
          if (index !== -1) {
            state.users[index] = updatedUser
          }
          // Update current user if it's the same
          if (state.currentUser?.id === updatedUser.id) {
            state.currentUser = updatedUser
          }
        }
        state.error = null
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateLoading = false
        state.error = action.payload as string
      })

    // Delete user
    builder
      .addCase(deleteUser.pending, state => {
        state.deleteLoading = true
        state.error = null
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.deleteLoading = false
        // Remove user from the list
        if (action.payload?.userId) {
          state.users = state.users.filter(u => u.id !== action.payload.userId)
          state.totalItems = Math.max(0, state.totalItems - 1)
        }
        state.error = null
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleteLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearUsersError, clearCurrentUser, setCurrentPage } = usersSlice.actions
export default usersSlice.reducer
