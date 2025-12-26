import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { CarrierAddressesService } from '@/services/settings/carrier-addresses/carrierAddresses.service'
import type { CarrierAddress, CarrierAddressesState } from '@/types'

const initialState: CarrierAddressesState = {
  carrierAddresses: [],
  currentCarrierAddress: null,
  loading: false,
  error: null,
  totalItems: 0,
  currentPage: 1,
  itemsPerPage: 8,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  fetchCarrierAddressLoading: false,
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
      if (key === 'carrierCode') {
        apiObj.carrier_code = obj[key]
      } else if (key === 'actualName') {
        apiObj.actual_name = obj[key]
      } else if (key === 'addressId') {
        apiObj.address_id = obj[key]
      } else if (key === 'addressLine1') {
        apiObj.address_line1 = obj[key]
      } else if (key === 'zipCode') {
        apiObj.zip_code = obj[key]
      } else if (key === 'phoneType') {
        apiObj.phone_type = obj[key]
      } else if (key === 'phoneNumber') {
        apiObj.phone_number = obj[key]
      } else if (key === 'insuranceDepartment') {
        apiObj.insurance_department = obj[key]
      } else {
        // For other fields (city, state), keep as is
        apiObj[key] = mapFormToApi(obj[key])
      }
    }
  }
  return apiObj
}

// Async thunk to fetch all carrier addresses
export const fetchAllCarrierAddresses = createAsyncThunk(
  'carrierAddresses/fetchAllCarrierAddresses',
  async (page: number, { rejectWithValue }) => {
    try {
      const response = await CarrierAddressesService.getAllCarrierAddresses(page)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch carrier addresses')
    }
  }
)

// Async thunk to fetch carrier address by ID
export const fetchCarrierAddressById = createAsyncThunk(
  'carrierAddresses/fetchCarrierAddressById',
  async (carrierAddressId: string, { rejectWithValue }) => {
    try {
      const response = await CarrierAddressesService.getCarrierAddressesById(carrierAddressId)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to fetch carrier address details'
      )
    }
  }
)

// Async thunk to create carrier address
export const createCarrierAddress = createAsyncThunk(
  'carrierAddresses/createCarrierAddress',
  async (carrierAddressData: {}, { rejectWithValue }) => {
    try {
      // Map form fields to API field names
      const apiData = mapFormToApi(carrierAddressData)
      const response = await CarrierAddressesService.createCarrierAddresses(apiData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to create carrier address')
    }
  }
)

// Async thunk to update carrier address
export const updateCarrierAddress = createAsyncThunk(
  'carrierAddresses/updateCarrierAddress',
  async (params: { carrierAddressId: string; carrierAddressData: {} }, { rejectWithValue }) => {
    try {
      // Map form fields to API field names
      const apiData = mapFormToApi(params.carrierAddressData)
      const response = await CarrierAddressesService.updateCarrierAddresses(
        params.carrierAddressId,
        apiData
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to update carrier address')
    }
  }
)

// Async thunk to delete carrier address
export const deleteCarrierAddress = createAsyncThunk(
  'carrierAddresses/deleteCarrierAddress',
  async (carrierAddressId: string, { rejectWithValue }) => {
    try {
      const response = await CarrierAddressesService.deleteCarrierAddresses(carrierAddressId)
      return { carrierAddressId, data: response.data }
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to delete carrier address')
    }
  }
)

const carrierAddressesSlice = createSlice({
  name: 'carrierAddresses',
  initialState,
  reducers: {
    clearCarrierAddressesError: state => {
      state.error = null
    },
    clearCurrentCarrierAddress: state => {
      state.currentCarrierAddress = null
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
  },
  extraReducers: builder => {
    // Fetch all carrier addresses
    builder
      .addCase(fetchAllCarrierAddresses.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllCarrierAddresses.fulfilled, (state, action) => {
        state.loading = false
        // Handle different response structures
        const payload = action.payload
        let dataArray: any[] = []

        // Check for nested data structure: { data: { data: [...] }, meta: { pagination: {...} } }
        if (payload?.data?.data && Array.isArray(payload.data.data)) {
          dataArray = payload.data.data
          state.carrierAddresses = payload.data.data

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
          state.carrierAddresses = payload.data

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
          state.carrierAddresses = payload
          state.totalItems = payload.length
        } else {
          state.carrierAddresses = []
          state.totalItems = 0
        }
        state.error = null
      })
      .addCase(fetchAllCarrierAddresses.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Fetch carrier address by ID
    builder
      .addCase(fetchCarrierAddressById.pending, state => {
        state.fetchCarrierAddressLoading = true
        state.error = null
      })
      .addCase(fetchCarrierAddressById.fulfilled, (state, action) => {
        state.fetchCarrierAddressLoading = false
        state.currentCarrierAddress = action.payload?.data || action.payload || null
        state.error = null
      })
      .addCase(fetchCarrierAddressById.rejected, (state, action) => {
        state.fetchCarrierAddressLoading = false
        state.error = action.payload as string
      })

    // Create carrier address
    builder
      .addCase(createCarrierAddress.pending, state => {
        state.createLoading = true
        state.error = null
      })
      .addCase(createCarrierAddress.fulfilled, (state, action) => {
        state.createLoading = false
        // Optionally add the new carrier address to the list
        if (action.payload?.data) {
          state.carrierAddresses.unshift(action.payload.data)
          state.totalItems += 1
        }
        state.error = null
      })
      .addCase(createCarrierAddress.rejected, (state, action) => {
        state.createLoading = false
        state.error = action.payload as string
      })

    // Update carrier address
    builder
      .addCase(updateCarrierAddress.pending, state => {
        state.updateLoading = true
        state.error = null
      })
      .addCase(updateCarrierAddress.fulfilled, (state, action) => {
        state.updateLoading = false
        // Update carrier address in the list
        const updatedCarrierAddress = action.payload?.data || action.payload
        if (updatedCarrierAddress?.id || updatedCarrierAddress?.uuid) {
          const id = updatedCarrierAddress.id || updatedCarrierAddress.uuid
          const index = state.carrierAddresses.findIndex(ca => ca.id === id || ca.uuid === id)
          if (index !== -1) {
            state.carrierAddresses[index] = updatedCarrierAddress
          }
          // Update current carrier address if it's the same
          if (state.currentCarrierAddress?.id === id || state.currentCarrierAddress?.uuid === id) {
            state.currentCarrierAddress = updatedCarrierAddress
          }
        }
        state.error = null
      })
      .addCase(updateCarrierAddress.rejected, (state, action) => {
        state.updateLoading = false
        state.error = action.payload as string
      })

    // Delete carrier address
    builder
      .addCase(deleteCarrierAddress.pending, state => {
        state.deleteLoading = true
        state.error = null
      })
      .addCase(deleteCarrierAddress.fulfilled, (state, action) => {
        state.deleteLoading = false
        // Remove carrier address from the list
        if (action.payload?.carrierAddressId) {
          state.carrierAddresses = state.carrierAddresses.filter(
            ca =>
              ca.id !== action.payload.carrierAddressId &&
              ca.uuid !== action.payload.carrierAddressId
          )
          state.totalItems = Math.max(0, state.totalItems - 1)
        }
        state.error = null
      })
      .addCase(deleteCarrierAddress.rejected, (state, action) => {
        state.deleteLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearCarrierAddressesError, clearCurrentCarrierAddress, setCurrentPage } =
  carrierAddressesSlice.actions
export default carrierAddressesSlice.reducer
