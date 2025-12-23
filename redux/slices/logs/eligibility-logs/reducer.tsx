import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { LogsService } from '@/services/logs/logs.service'

interface EligibilityLogItem {
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
  name?: string
}

interface EligibilityLogsFilters {
  name?: string
  subscriber_id?: string
  status?: string
  queue_status?: string
  service_date_from?: string
  service_date_to?: string
}

interface EligibilityLogsState {
  logs: EligibilityLogItem[]
  currentLog: EligibilityLogItem | null
  loading: boolean
  fetchLogLoading: boolean
  retryLoading: boolean
  error: string | null
  totalItems: number
  currentPage: number
  itemsPerPage: number
  filters: EligibilityLogsFilters
}

const initialState: EligibilityLogsState = {
  logs: [],
  currentLog: null,
  loading: false,
  fetchLogLoading: false,
  retryLoading: false,
  error: null,
  totalItems: 0,
  currentPage: 1,
  itemsPerPage: 8,
  filters: {
    name: '',
    subscriber_id: '',
    status: '',
    queue_status: '',
    service_date_from: '',
    service_date_to: '',
  },
}

// Async thunk to fetch all logs with pagination
export const fetchAllLogs = createAsyncThunk(
  'eligibilityLogs/fetchAllLogs',
  async (
    params: { page: number; filters?: EligibilityLogsFilters; itemsPerPage?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await LogsService.getAllLogs(
        params.page,
        params.filters,
        params.itemsPerPage || 8
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch eligibility logs')
    }
  }
)

// Async thunk to fetch log by ID
export const fetchLogById = createAsyncThunk(
  'eligibilityLogs/fetchLogById',
  async (logId: string, { rejectWithValue }) => {
    try {
      const response = await LogsService.getLogsById(logId)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to fetch eligibility log details'
      )
    }
  }
)

// Async thunk to retry eligibility submission
export const retryEligibilitySubmission = createAsyncThunk(
  'eligibilityLogs/retryEligibilitySubmission',
  async (eligibilityId: string, { rejectWithValue }) => {
    try {
      const response = await LogsService.retryEligibilitySubmission(eligibilityId)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to retry eligibility submission'
      )
    }
  }
)

const eligibilityLogsSlice = createSlice({
  name: 'eligibilityLogs',
  initialState,
  reducers: {
    clearEligibilityLogsError: state => {
      state.error = null
    },
    clearCurrentLog: state => {
      state.currentLog = null
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: state => {
      state.filters = {
        name: '',
        subscriber_id: '',
        status: '',
        queue_status: '',
        service_date_from: '',
        service_date_to: '',
      }
    },
  },
  extraReducers: builder => {
    // Fetch all logs
    builder
      .addCase(fetchAllLogs.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllLogs.fulfilled, (state, action) => {
        state.loading = false
        // Handle different response structures
        const payload = action.payload
        let dataArray: any[] = []

        // Check for nested data structure: { data: { data: [...] }, meta: { pagination: {...} } }
        if (payload?.data?.data && Array.isArray(payload.data.data)) {
          dataArray = payload.data.data
          state.logs = payload.data.data

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
          state.logs = payload.data

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
          state.logs = payload
          state.totalItems = payload.length
        } else {
          state.logs = []
          state.totalItems = 0
        }
        state.error = null
      })
      .addCase(fetchAllLogs.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Fetch log by ID
    builder
      .addCase(fetchLogById.pending, state => {
        state.fetchLogLoading = true
        state.error = null
      })
      .addCase(fetchLogById.fulfilled, (state, action) => {
        state.fetchLogLoading = false
        // Handle different response structures
        const payload = action.payload
        state.currentLog = payload?.data || payload || null
        state.error = null
      })
      .addCase(fetchLogById.rejected, (state, action) => {
        state.fetchLogLoading = false
        state.error = action.payload as string
      })
  },
})

export const {
  clearEligibilityLogsError,
  clearCurrentLog,
  setCurrentPage,
  setFilters,
  clearFilters,
} = eligibilityLogsSlice.actions
export default eligibilityLogsSlice.reducer
