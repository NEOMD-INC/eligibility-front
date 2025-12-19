import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { PatientDashboardService } from '@/services/patient-dashboard/patientDashboard.service'

const initialState: any = {
  patientData: [],
  loading: false,
  error: null,
}

// Async thunk to fetch user by ID
export const fetchPatientDashboard = createAsyncThunk(
  'users/fetchPatientDashboard',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await PatientDashboardService.getPatientDashboardDetails()
      return response.data
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch user details')
    }
  }
)

const PatientDashboardSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // Fetch user by ID
    builder
      .addCase(fetchPatientDashboard.pending, state => {
        state.fetchUserLoading = true
        state.error = null
      })
      .addCase(fetchPatientDashboard.fulfilled, (state, action) => {
        state.fetchUserLoading = false
        state.patientData = action.payload?.data || action.payload || null
        state.error = null
      })
      .addCase(fetchPatientDashboard.rejected, (state, action) => {
        state.fetchUserLoading = false
        state.error = action.payload as string
      })
  },
})

export default PatientDashboardSlice.reducer
