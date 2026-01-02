import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { CarrierSetupsService } from '@/services/settings/carrier-setup/carrierSetups.service'
import type { CarrierSetupsState } from '@/types'

const initialState: CarrierSetupsState = {
  carrierSetups: [],
  currentCarrierSetup: null,
  loading: false,
  error: null,
  totalItems: 0,
  currentPage: 1,
  itemsPerPage: 8,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  fetchCarrierSetupLoading: false,
  items: [],
  currentItem: null,
  fetchItemLoading: false,
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
      if (key === 'carrierGroupCode') {
        apiObj.carrier_group_code = obj[key]
      } else if (key === 'carrierGroupDescription') {
        apiObj.carrier_group_description = obj[key]
      } else if (key === 'carrierCode') {
        apiObj.carrier_code = obj[key]
      } else if (key === 'carrierDescription') {
        apiObj.carrier_description = obj[key]
      } else if (key === 'batchPlayerId') {
        apiObj.batch_payer_id = obj[key]
      } else if (key === 'isClia') {
        // Convert boolean to number (1 or 0)
        apiObj.is_clia = obj[key] === true || obj[key] === 'true' || obj[key] === 1 ? 1 : 0
      } else if (key === 'correctedClaim') {
        apiObj.corrected_claim = obj[key]
      } else if (key === 'enrollmentRequired') {
        // Convert enrollmentRequired string to enrollment number (0 or 1)
        const enrollmentValue = obj[key]
        if (enrollmentValue === 'Required' || enrollmentValue === '1' || enrollmentValue === 1) {
          apiObj.enrollment = 1
        } else if (
          enrollmentValue === 'Not Required' ||
          enrollmentValue === '0' ||
          enrollmentValue === 0 ||
          enrollmentValue === ''
        ) {
          apiObj.enrollment = 0
        } else {
          apiObj.enrollment = enrollmentValue
        }
      } else {
        // For other fields (state, cob), keep as is
        apiObj[key] = mapFormToApi(obj[key])
      }
    }
  }
  return apiObj
}

// Async thunk to fetch all carrier setups
export const fetchAllCarrierSetups = createAsyncThunk(
  'carrierSetups/fetchAllCarrierSetups',
  async (page: number, { rejectWithValue }) => {
    try {
      const response = await CarrierSetupsService.getAllCarrierSetups(page)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch carrier setups')
    }
  }
)

// Async thunk to fetch carrier setup by ID
export const fetchCarrierSetupById = createAsyncThunk(
  'carrierSetups/fetchCarrierSetupById',
  async (carrierSetupId: string, { rejectWithValue }) => {
    try {
      const response = await CarrierSetupsService.getCarrierSetupsById(carrierSetupId)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to fetch carrier setup details'
      )
    }
  }
)

// Async thunk to create carrier setup
export const createCarrierSetup = createAsyncThunk(
  'carrierSetups/createCarrierSetup',
  async (carrierSetupData: any, { rejectWithValue }) => {
    try {
      const apiData = mapFormToApi(carrierSetupData)
      const response = await CarrierSetupsService.createCarrierSetups(apiData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to create carrier setup')
    }
  }
)

// Async thunk to update carrier setup
export const updateCarrierSetup = createAsyncThunk(
  'carrierSetups/updateCarrierSetup',
  async (params: { carrierSetupId: string; carrierSetupData: any }, { rejectWithValue }) => {
    try {
      const apiData = mapFormToApi(params.carrierSetupData)
      const response = await CarrierSetupsService.updateCarrierSetups(
        params.carrierSetupId,
        apiData
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to update carrier setup')
    }
  }
)

// Async thunk to delete carrier setup
export const deleteCarrierSetup = createAsyncThunk(
  'carrierSetups/deleteCarrierSetup',
  async (carrierSetupId: string, { rejectWithValue }) => {
    try {
      const response = await CarrierSetupsService.deleteCarrierSetups(carrierSetupId)
      return { carrierSetupId, data: response.data }
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to delete carrier setup')
    }
  }
)

const carrierSetupsSlice = createSlice({
  name: 'carrierSetups',
  initialState,
  reducers: {
    clearCarrierSetupsError: state => {
      state.error = null
    },
    clearCurrentCarrierSetup: state => {
      state.currentCarrierSetup = null
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
  },
  extraReducers: builder => {
    // Fetch all carrier setups
    builder
      .addCase(fetchAllCarrierSetups.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllCarrierSetups.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload
        let dataArray: any[] = []

        // Check for nested data structure: { data: { data: [...] }, meta: { pagination: {...} } }
        if (payload?.data?.data && Array.isArray(payload.data.data)) {
          dataArray = payload.data.data
          state.carrierSetups = payload.data.data

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
          state.carrierSetups = payload.data

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
          state.carrierSetups = payload
          state.totalItems = payload.length
        } else {
          state.carrierSetups = []
          state.totalItems = 0
        }
        state.error = null
      })
      .addCase(fetchAllCarrierSetups.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Fetch carrier setup by ID
    builder
      .addCase(fetchCarrierSetupById.pending, state => {
        state.fetchCarrierSetupLoading = true
        state.error = null
      })
      .addCase(fetchCarrierSetupById.fulfilled, (state, action) => {
        state.fetchCarrierSetupLoading = false
        state.currentCarrierSetup = action.payload?.data || action.payload || null
        state.error = null
      })
      .addCase(fetchCarrierSetupById.rejected, (state, action) => {
        state.fetchCarrierSetupLoading = false
        state.error = action.payload as string
      })

    // Create carrier setup
    builder
      .addCase(createCarrierSetup.pending, state => {
        state.createLoading = true
        state.error = null
      })
      .addCase(createCarrierSetup.fulfilled, (state, action) => {
        state.createLoading = false
        if (action.payload?.data) {
          state.carrierSetups.unshift(action.payload.data)
          state.totalItems += 1
        }
        state.error = null
      })
      .addCase(createCarrierSetup.rejected, (state, action) => {
        state.createLoading = false
        state.error = action.payload as string
      })

    // Update carrier setup
    builder
      .addCase(updateCarrierSetup.pending, state => {
        state.updateLoading = true
        state.error = null
      })
      .addCase(updateCarrierSetup.fulfilled, (state, action) => {
        state.updateLoading = false
        const updatedCarrierSetup = action.payload?.data || action.payload
        if (updatedCarrierSetup?.id || updatedCarrierSetup?.uuid) {
          const id = updatedCarrierSetup.id || updatedCarrierSetup.uuid
          const index = state.carrierSetups.findIndex(cs => cs.id === id || cs.uuid === id)
          if (index !== -1) {
            state.carrierSetups[index] = updatedCarrierSetup
          }
          if (state.currentCarrierSetup?.id === id || state.currentCarrierSetup?.uuid === id) {
            state.currentCarrierSetup = updatedCarrierSetup
          }
        }
        state.error = null
      })
      .addCase(updateCarrierSetup.rejected, (state, action) => {
        state.updateLoading = false
        state.error = action.payload as string
      })

    // Delete carrier setup
    builder
      .addCase(deleteCarrierSetup.pending, state => {
        state.deleteLoading = true
        state.error = null
      })
      .addCase(deleteCarrierSetup.fulfilled, (state, action) => {
        state.deleteLoading = false
        if (action.payload?.carrierSetupId) {
          state.carrierSetups = state.carrierSetups.filter(
            cs =>
              cs.id !== action.payload.carrierSetupId && cs.uuid !== action.payload.carrierSetupId
          )
          state.totalItems = Math.max(0, state.totalItems - 1)
        }
        state.error = null
      })
      .addCase(deleteCarrierSetup.rejected, (state, action) => {
        state.deleteLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearCarrierSetupsError, clearCurrentCarrierSetup, setCurrentPage } =
  carrierSetupsSlice.actions
export default carrierSetupsSlice.reducer
