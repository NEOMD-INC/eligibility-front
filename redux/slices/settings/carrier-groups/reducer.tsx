import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { CarrierGroupService } from '@/services/settings/carrier-groups/carrierGroups.service'
import type { CarrierGroup, CarrierGroupsState } from '@/types'

const initialState: CarrierGroupsState = {
  carrierGroups: [],
  currentCarrierGroup: null,
  loading: false,
  error: null,
  totalItems: 0,
  currentPage: 1,
  itemsPerPage: 10,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  fetchCarrierGroupLoading: false,
}

// Helper function to convert form fields to API field names
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
      if (key === 'description') {
        apiObj.carrier_group_description = obj[key]
      } else if (key === 'code') {
        apiObj.carrier_group_code = obj[key]
      } else if (key === 'fillingIndicator') {
        apiObj.filling_indicator = obj[key]
      } else if (key === 'isActive') {
        apiObj.status = obj[key] // Map isActive to status boolean
      } else {
        // For other fields, convert camelCase to snake_case
        const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase()
        apiObj[snakeKey] = mapFormToApi(obj[key])
      }
    }
  }
  return apiObj
}

// Async thunk to fetch all carrier groups
export const fetchAllCarrierGroups = createAsyncThunk(
  'carrierGroups/fetchAllCarrierGroups',
  async (
    params: {
      page: number
      filters?: {
        description?: string
        code?: string
        filling_indicator?: string
        status?: string
      }
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await CarrierGroupService.getAllCarrierGroups(params.page, params.filters)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to fetch carrier groups'
      )
    }
  }
)

// Async thunk to fetch carrier group by ID
export const fetchCarrierGroupById = createAsyncThunk(
  'carrierGroups/fetchCarrierGroupById',
  async (carrierGroupId: string, { rejectWithValue }) => {
    try {
      const response = await CarrierGroupService.getCarrierGroupsById(carrierGroupId)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to fetch carrier group details'
      )
    }
  }
)

// Async thunk to create carrier group
export const createCarrierGroup = createAsyncThunk(
  'carrierGroups/createCarrierGroup',
  async (carrierGroupData: {}, { rejectWithValue }) => {
    try {
      // Map form fields to API field names
      const apiData = mapFormToApi(carrierGroupData)
      const response = await CarrierGroupService.createCarrierGroups(apiData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to create carrier group'
      )
    }
  }
)

// Async thunk to update carrier group
export const updateCarrierGroup = createAsyncThunk(
  'carrierGroups/updateCarrierGroup',
  async (
    params: { carrierGroupId: string; carrierGroupData: {} },
    { rejectWithValue }
  ) => {
    try {
      // Map form fields to API field names
      const apiData = mapFormToApi(params.carrierGroupData)
      const response = await CarrierGroupService.updateCarrierGroups(
        params.carrierGroupId,
        apiData
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to update carrier group'
      )
    }
  }
)

// Async thunk to delete carrier group
export const deleteCarrierGroup = createAsyncThunk(
  'carrierGroups/deleteCarrierGroup',
  async (carrierGroupId: string, { rejectWithValue }) => {
    try {
      const response = await CarrierGroupService.deleteCarrierGroups(carrierGroupId)
      return { carrierGroupId, data: response.data }
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to delete carrier group'
      )
    }
  }
)

const carrierGroupsSlice = createSlice({
  name: 'carrierGroups',
  initialState,
  reducers: {
    clearCarrierGroupsError: state => {
      state.error = null
    },
    clearCurrentCarrierGroup: state => {
      state.currentCarrierGroup = null
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
  },
  extraReducers: builder => {
    // Fetch all carrier groups
    builder
      .addCase(fetchAllCarrierGroups.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllCarrierGroups.fulfilled, (state, action) => {
        state.loading = false
        // Handle different response structures
        const payload = action.payload
        let dataArray: any[] = []

        if (payload?.data && Array.isArray(payload.data)) {
          // Structure: { data: [...], meta: { pagination: {...} } }
          dataArray = payload.data
          state.carrierGroups = payload.data
          
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
        } else if (payload?.data?.data && Array.isArray(payload.data.data)) {
          // Nested structure: { data: { data: [...] }, meta: { pagination: {...} } }
          dataArray = payload.data.data
          state.carrierGroups = payload.data.data
          
          // Check meta.pagination for pagination info
          if (payload.meta?.pagination) {
            const pagination = payload.meta.pagination
            state.totalItems = pagination.total || 0
            state.currentPage = pagination.current_page || state.currentPage
            state.itemsPerPage = pagination.per_page || state.itemsPerPage
          } else {
            // Fallback: try to get total from other locations
            const apiTotal = payload.data.total || payload.data.meta?.total || payload.total
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
          // Direct array: [...] - calculate total based on array length
          dataArray = payload
          state.carrierGroups = payload
          // For direct arrays, use the length as total
          state.totalItems = payload.length
        } else {
          state.carrierGroups = []
          state.totalItems = 0
        }
        state.error = null
      })
      .addCase(fetchAllCarrierGroups.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Fetch carrier group by ID
    builder
      .addCase(fetchCarrierGroupById.pending, state => {
        state.fetchCarrierGroupLoading = true
        state.error = null
      })
      .addCase(fetchCarrierGroupById.fulfilled, (state, action) => {
        state.fetchCarrierGroupLoading = false
        state.currentCarrierGroup =
          action.payload?.data || action.payload || null
        state.error = null
      })
      .addCase(fetchCarrierGroupById.rejected, (state, action) => {
        state.fetchCarrierGroupLoading = false
        state.error = action.payload as string
      })

    // Create carrier group
    builder
      .addCase(createCarrierGroup.pending, state => {
        state.createLoading = true
        state.error = null
      })
      .addCase(createCarrierGroup.fulfilled, (state, action) => {
        state.createLoading = false
        // Optionally add the new carrier group to the list
        if (action.payload?.data) {
          state.carrierGroups.unshift(action.payload.data)
          state.totalItems += 1
        }
        state.error = null
      })
      .addCase(createCarrierGroup.rejected, (state, action) => {
        state.createLoading = false
        state.error = action.payload as string
      })

    // Update carrier group
    builder
      .addCase(updateCarrierGroup.pending, state => {
        state.updateLoading = true
        state.error = null
      })
      .addCase(updateCarrierGroup.fulfilled, (state, action) => {
        state.updateLoading = false
        // Update carrier group in the list
        const updatedCarrierGroup = action.payload?.data || action.payload
        if (updatedCarrierGroup?.id || updatedCarrierGroup?.uuid) {
          const id = updatedCarrierGroup.id || updatedCarrierGroup.uuid
          const index = state.carrierGroups.findIndex(
            cg => (cg.id === id) || (cg.uuid === id)
          )
          if (index !== -1) {
            state.carrierGroups[index] = updatedCarrierGroup
          }
          // Update current carrier group if it's the same
          if (
            state.currentCarrierGroup?.id === id ||
            state.currentCarrierGroup?.uuid === id
          ) {
            state.currentCarrierGroup = updatedCarrierGroup
          }
        }
        state.error = null
      })
      .addCase(updateCarrierGroup.rejected, (state, action) => {
        state.updateLoading = false
        state.error = action.payload as string
      })

    // Delete carrier group
    builder
      .addCase(deleteCarrierGroup.pending, state => {
        state.deleteLoading = true
        state.error = null
      })
      .addCase(deleteCarrierGroup.fulfilled, (state, action) => {
        state.deleteLoading = false
        // Remove carrier group from the list
        if (action.payload?.carrierGroupId) {
          state.carrierGroups = state.carrierGroups.filter(
            cg =>
              cg.id !== action.payload.carrierGroupId &&
              cg.uuid !== action.payload.carrierGroupId
          )
          state.totalItems = Math.max(0, state.totalItems - 1)
        }
        state.error = null
      })
      .addCase(deleteCarrierGroup.rejected, (state, action) => {
        state.deleteLoading = false
        state.error = action.payload as string
      })
  },
})

export const {
  clearCarrierGroupsError,
  clearCurrentCarrierGroup,
  setCurrentPage,
} = carrierGroupsSlice.actions
export default carrierGroupsSlice.reducer

