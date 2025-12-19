import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { EligibilityHistoryService } from '@/services/eligibility/history/history.service'

interface EligibilityHistoryItem {
  id?: string
  uuid?: string
  neoRef?: string
  neo_ref?: string
  neoReferenceId?: string
  subscriber?: string
  subscriberId?: string
  subscriber_id?: string
  provider?: string
  providerName?: string
  provider_name?: string
  serviceDate?: string
  service_date?: string
  status?: string
  queueStatus?: string
  queue_status?: string
  response?: string
  responseMessage?: string
  response_message?: string
  responseReceivedAt?: string
  response_received_at?: string
  createdAt?: string
  created_at?: string
  created?: string
}

interface EligibilityHistoryFilters {
  serviceType?: string
  relationshipCode?: string
  subscriberId?: string
  dateFrom?: string
  dateTo?: string
}

interface EligibilityHistoryState {
  history: EligibilityHistoryItem[]
  loading: boolean
  error: string | null
  totalItems: number
  currentPage: number
  itemsPerPage: number
  filters: EligibilityHistoryFilters
}

const initialState: EligibilityHistoryState = {
  history: [],
  loading: false,
  error: null,
  totalItems: 0,
  currentPage: 1,
  itemsPerPage: 10,
  filters: {
    serviceType: '',
    relationshipCode: '',
    subscriberId: '',
    dateFrom: '',
    dateTo: '',
  },
}

// Async thunk to fetch eligibility history
export const fetchEligibilityHistory = createAsyncThunk(
  'eligibilityHistory/fetchEligibilityHistory',
  async (
    params: { page: number; filters?: EligibilityHistoryFilters },
    { rejectWithValue }
  ) => {
    try {
      const apiFilters: any = {
        page: params.page,
      }

      if (params.filters?.serviceType) {
        apiFilters.service_type = params.filters.serviceType
      }
      if (params.filters?.relationshipCode) {
        apiFilters.relationship_code = params.filters.relationshipCode
      }
      if (params.filters?.subscriberId) {
        apiFilters.subscriber_id = params.filters.subscriberId
      }
      if (params.filters?.dateFrom) {
        apiFilters.date_from = params.filters.dateFrom
      }
      if (params.filters?.dateTo) {
        apiFilters.date_to = params.filters.dateTo
      }

      const response = await EligibilityHistoryService.getEligibilityHistory(apiFilters)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to fetch eligibility history'
      )
    }
  }
)

const eligibilityHistorySlice = createSlice({
  name: 'eligibilityHistory',
  initialState,
  reducers: {
    clearEligibilityHistoryError: state => {
      state.error = null
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: state => {
      state.filters = {
        serviceType: '',
        relationshipCode: '',
        subscriberId: '',
        dateFrom: '',
        dateTo: '',
      }
    },
  },
  extraReducers: builder => {
    // Fetch eligibility history
    builder
      .addCase(fetchEligibilityHistory.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEligibilityHistory.fulfilled, (state, action) => {
        state.loading = false
        // Handle different response structures
        const payload = action.payload
        let dataArray: any[] = []

        // Check for nested data structure: { data: { data: [...] }, meta: { pagination: {...} } }
        if (payload?.data?.data && Array.isArray(payload.data.data)) {
          dataArray = payload.data.data
          state.history = payload.data.data

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
          state.history = payload.data

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
          state.history = payload
          state.totalItems = payload.length
        } else {
          state.history = []
          state.totalItems = 0
        }
        state.error = null
      })
      .addCase(fetchEligibilityHistory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const {
  clearEligibilityHistoryError,
  setCurrentPage,
  setFilters,
  clearFilters,
} = eligibilityHistorySlice.actions
export default eligibilityHistorySlice.reducer

