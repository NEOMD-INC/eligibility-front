import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { EligibilityIndivitualService } from '@/services/eligibility/indivitual/indivitual.service'

const initialState: any = {
  indivitual: null,
  npiPractice: null,
  loading: false,
  error: null,
  updateLoading: false,
  submitLoading: false,
}

// Async thunk to fetch eligibility settings
export const fetchEligibilityIndivitualNpiPractice = createAsyncThunk(
  'eligibilityIndivitual/fetchEligibilityndivitualNpiPractice',
  async (_, { rejectWithValue }) => {
    try {
      const response = await EligibilityIndivitualService.getEligibilityIndivitualNpiPractice()
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to fetch eligibility Indivitual NPI Practice'
      )
    }
  }
)

// Helper function to map form data to API format for practice
const mapPracticeFormToApi = (formData: {
  npi: string
  practiceLastName: string
  practiceFirstName: string
}) => {
  return {
    npi: formData.npi,
    practice_last_name: formData.practiceLastName,
    practice_first_name: formData.practiceFirstName,
  }
}

// Helper function to map entire eligibility form to API format
const mapEligibilityFormToApi = (formData: {
  payerId: string
  npi: string
  practiceLastName: string
  practiceFirstName: string
  subscriberId: string
  lastName: string
  firstName: string
  dob: string
  gender: string
  relationshipCode: string
  serviceDate: string
  serviceType: string
  placeOfService: string
}) => {
  return {
    payer_id: formData.payerId,
    npi: formData.npi,
    practice_last_name: formData.practiceLastName,
    practice_first_name: formData.practiceFirstName,
    subscriber_id: formData.subscriberId,
    last_name: formData.lastName,
    first_name: formData.firstName,
    dob: formData.dob,
    gender: formData.gender,
    relationship_code: formData.relationshipCode,
    service_date: formData.serviceDate,
    service_type_code: formData.serviceType,
    place_of_service: formData.placeOfService,
  }
}

// Async thunk to save/update practice data
export const saveEligibilityIndivitualNpiPractice = createAsyncThunk(
  'eligibilityIndivitual/saveEligibilityIndivitualNpiPractice',
  async (
    practiceData: { npi: string; practiceLastName: string; practiceFirstName: string },
    { rejectWithValue }
  ) => {
    try {
      const apiData = mapPracticeFormToApi(practiceData)
      const response =
        await EligibilityIndivitualService.updateEligibilityIndivitualNpiPractice(apiData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to save eligibility Indivitual NPI Practice'
      )
    }
  }
)

// Async thunk to submit eligibility check
export const submitEligibilityCheck = createAsyncThunk(
  'eligibilityIndivitual/submitEligibilityCheck',
  async (
    formData: {
      payerId: string
      npi: string
      practiceLastName: string
      practiceFirstName: string
      subscriberId: string
      lastName: string
      firstName: string
      dob: string
      gender: string
      relationshipCode: string
      serviceDate: string
      serviceType: string
      placeOfService: string
    },
    { rejectWithValue }
  ) => {
    try {
      const apiData = mapEligibilityFormToApi(formData)
      const response =
        await EligibilityIndivitualService.addEligibilityIndivitualNpiPractice(apiData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to submit eligibility check')
    }
  }
)

const eligibilityIndivitualSlice = createSlice({
  name: 'eligibilityindivitual',
  initialState,
  reducers: {
    clearEligibilityIndivitualError: state => {
      state.error = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchEligibilityIndivitualNpiPractice.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEligibilityIndivitualNpiPractice.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload
        state.npiPractice = payload?.data || payload || null
        state.error = null
      })
      .addCase(fetchEligibilityIndivitualNpiPractice.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(saveEligibilityIndivitualNpiPractice.pending, state => {
        state.updateLoading = true
        state.error = null
      })
      .addCase(saveEligibilityIndivitualNpiPractice.fulfilled, (state, action) => {
        state.updateLoading = false
        const payload = action.payload
        state.npiPractice = payload?.data || payload || null
        state.error = null
      })
      .addCase(saveEligibilityIndivitualNpiPractice.rejected, (state, action) => {
        state.updateLoading = false
        state.error = action.payload as string
      })
      .addCase(submitEligibilityCheck.pending, state => {
        state.submitLoading = true
        state.error = null
      })
      .addCase(submitEligibilityCheck.fulfilled, (state, action) => {
        state.submitLoading = false
        const payload = action.payload
        state.indivitual = payload?.data || payload || null
        state.error = null
      })
      .addCase(submitEligibilityCheck.rejected, (state, action) => {
        state.submitLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearEligibilityIndivitualError } = eligibilityIndivitualSlice.actions
export default eligibilityIndivitualSlice.reducer
