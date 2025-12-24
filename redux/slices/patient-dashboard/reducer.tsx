import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { PatientDashboardService } from '@/services/patient-dashboard/patientDashboard.service'
import { PatientDashboardState } from '@/types/entities/patient-dashboard'
import { AxiosError } from 'axios'

const initialState: PatientDashboardState = {
  patientData: null,
  loading: false,
  error: null,
}

// Async thunk to fetch patient dashboard by logId
export const fetchPatientDashboard = createAsyncThunk(
  'patientDashboard/fetchPatientDashboard',
  async (logId: string, { rejectWithValue }) => {
    try {
      const response = await PatientDashboardService.getPatientDashboardDetails(logId)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>
      return rejectWithValue(
        axiosError?.response?.data?.message || 'Failed to fetch patient dashboard details'
      )
    }
  }
)

const PatientDashboardSlice = createSlice({
  name: 'patientDashboard',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // Fetch user by ID
    builder
      .addCase(fetchPatientDashboard.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPatientDashboard.fulfilled, (state, action) => {
        state.loading = false
        state.patientData = action.payload?.data || action.payload || null
        state.error = null
      })
      .addCase(fetchPatientDashboard.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default PatientDashboardSlice.reducer
