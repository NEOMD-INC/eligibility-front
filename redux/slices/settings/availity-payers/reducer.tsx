import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { AvailityPayerService } from '@/services/settings/avality-payer/avalityPayer.service'
import type { AvailityPayersState } from '@/types'

const initialState: AvailityPayersState = {
  availityPayers: [],
  currentAvailityPayer: null,
  loading: false,
  error: null,
  totalItems: 0,
  currentPage: 1,
  itemsPerPage: 8,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  fetchAvailityPayerLoading: false,
}

// Helper function to convert form camelCase fields to API snake_case field names
const mapFormToApi = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(item => mapFormToApi(item))
  }

  const apiObj: any = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // Map form field names to API field names
      if (key === 'payerId') {
        apiObj.payer_id = obj[key]
      } else if (key === 'payerName') {
        apiObj.payer_name = obj[key]
      } else if (key === 'payerCode') {
        apiObj.payer_code = obj[key]
      } else if (key === 'contactName') {
        apiObj.contact_name = obj[key]
      } else if (key === 'addressLine1') {
        apiObj.address_line_1 = obj[key]
      } else if (key === 'addressLine2') {
        apiObj.address_line_2 = obj[key]
      } else if (key === 'zipCode') {
        apiObj.zip = obj[key]
      } else if (key === 'isActive') {
        apiObj.is_active = obj[key] // Keep as boolean
      } else {
        // For other fields (city, state, phone, email, notes), keep as is
        apiObj[key] = mapFormToApi(obj[key])
      }
    }
  }
  return apiObj
}

// Async thunk to fetch all availity payers
export const fetchAllAvailityPayers = createAsyncThunk(
  'availityPayers/fetchAllAvailityPayers',
  async (page?: number, { rejectWithValue }) => {
    try {
      const response = await AvailityPayerService.getAllAvailityPayer(page)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch availity payers')
    }
  }
)

// Async thunk to fetch availity payer by ID
export const fetchAvailityPayerById = createAsyncThunk(
  'availityPayers/fetchAvailityPayerById',
  async (payerId: string, { rejectWithValue }) => {
    try {
      const response = await AvailityPayerService.getAvailityPayerById(payerId)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to fetch availity payer details'
      )
    }
  }
)

// Async thunk to create availity payer
export const createAvailityPayer = createAsyncThunk(
  'availityPayers/createAvailityPayer',
  async (payerData: any, { rejectWithValue }) => {
    try {
      const apiData = mapFormToApi(payerData)
      const response = await AvailityPayerService.createAvailityPayer(apiData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to create availity payer')
    }
  }
)

// Async thunk to update availity payer
export const updateAvailityPayer = createAsyncThunk(
  'availityPayers/updateAvailityPayer',
  async (params: { payerId: string; payerData: any }, { rejectWithValue }) => {
    try {
      const apiData = mapFormToApi(params.payerData)
      const response = await AvailityPayerService.updateAvailityPayer(params.payerId, apiData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to update availity payer')
    }
  }
)

// Async thunk to delete availity payer
export const deleteAvailityPayer = createAsyncThunk(
  'availityPayers/deleteAvailityPayer',
  async (payerId: string, { rejectWithValue }) => {
    try {
      const response = await AvailityPayerService.deleteAvailityPayer(payerId)
      return { payerId, data: response.data }
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to delete availity payer')
    }
  }
)

// Async thunk to search availity payers
export const searchAvailityPayers = createAsyncThunk(
  'availityPayers/searchAvailityPayers',
  async (searchTerm: string, { rejectWithValue }) => {
    try {
      const response = await AvailityPayerService.searchAvailityPayers(searchTerm)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to search availity payers')
    }
  }
)
// payer_name
const availityPayersSlice = createSlice({
  name: 'availityPayers',
  initialState,
  reducers: {
    clearAvailityPayersError: state => {
      state.error = null
    },
    clearCurrentAvailityPayer: state => {
      state.currentAvailityPayer = null
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
  },
  extraReducers: builder => {
    // Fetch all availity payers
    builder
      .addCase(fetchAllAvailityPayers.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllAvailityPayers.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload
        let dataArray: any[] = []

        // Check for nested data structure: { data: { data: [...] }, meta: { pagination: {...} } }
        if (payload?.data?.data && Array.isArray(payload.data.data)) {
          dataArray = payload.data.data
          state.availityPayers = payload.data.data

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
          dataArray = payload.data
          state.availityPayers = payload.data

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
          state.availityPayers = payload
          state.totalItems = payload.length
        } else {
          state.availityPayers = []
          state.totalItems = 0
        }
        state.error = null
      })
      .addCase(fetchAllAvailityPayers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Fetch availity payer by ID
    builder
      .addCase(fetchAvailityPayerById.pending, state => {
        state.fetchAvailityPayerLoading = true
        state.error = null
      })
      .addCase(fetchAvailityPayerById.fulfilled, (state, action) => {
        state.fetchAvailityPayerLoading = false
        state.currentAvailityPayer = action.payload?.data || action.payload || null
        state.error = null
      })
      .addCase(fetchAvailityPayerById.rejected, (state, action) => {
        state.fetchAvailityPayerLoading = false
        state.error = action.payload as string
      })

    // Create availity payer
    builder
      .addCase(createAvailityPayer.pending, state => {
        state.createLoading = true
        state.error = null
      })
      .addCase(createAvailityPayer.fulfilled, (state, action) => {
        state.createLoading = false
        if (action.payload?.data) {
          state.availityPayers.unshift(action.payload.data)
          state.totalItems += 1
        }
        state.error = null
      })
      .addCase(createAvailityPayer.rejected, (state, action) => {
        state.createLoading = false
        state.error = action.payload as string
      })

    // Update availity payer
    builder
      .addCase(updateAvailityPayer.pending, state => {
        state.updateLoading = true
        state.error = null
      })
      .addCase(updateAvailityPayer.fulfilled, (state, action) => {
        state.updateLoading = false
        const updatedPayer = action.payload?.data || action.payload
        if (updatedPayer?.id || updatedPayer?.uuid) {
          const id = updatedPayer.id || updatedPayer.uuid
          const index = state.availityPayers.findIndex(p => p.id === id || p.uuid === id)
          if (index !== -1) {
            state.availityPayers[index] = updatedPayer
          }
          if (state.currentAvailityPayer?.id === id || state.currentAvailityPayer?.uuid === id) {
            state.currentAvailityPayer = updatedPayer
          }
        }
        state.error = null
      })
      .addCase(updateAvailityPayer.rejected, (state, action) => {
        state.updateLoading = false
        state.error = action.payload as string
      })

    // Delete availity payer
    builder
      .addCase(deleteAvailityPayer.pending, state => {
        state.deleteLoading = true
        state.error = null
      })
      .addCase(deleteAvailityPayer.fulfilled, (state, action) => {
        state.deleteLoading = false
        if (action.payload?.payerId) {
          state.availityPayers = state.availityPayers.filter(
            p => p.id !== action.payload.payerId && p.uuid !== action.payload.payerId
          )
          state.totalItems = Math.max(0, state.totalItems - 1)
        }
        state.error = null
      })
      .addCase(deleteAvailityPayer.rejected, (state, action) => {
        state.deleteLoading = false
        state.error = action.payload as string
      })

    // Search availity payers
    builder
      .addCase(searchAvailityPayers.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(searchAvailityPayers.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload
        let dataArray: any[] = []

        // Handle different response structures
        if (payload?.data?.data && Array.isArray(payload.data.data)) {
          dataArray = payload.data.data
          state.availityPayers = payload.data.data
        } else if (payload?.data && Array.isArray(payload.data)) {
          dataArray = payload.data
          state.availityPayers = payload.data
        } else if (Array.isArray(payload)) {
          state.availityPayers = payload
        } else {
          state.availityPayers = []
        }
        state.totalItems = dataArray.length || 0
        state.error = null
      })
      .addCase(searchAvailityPayers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearAvailityPayersError, clearCurrentAvailityPayer, setCurrentPage } =
  availityPayersSlice.actions
export default availityPayersSlice.reducer
