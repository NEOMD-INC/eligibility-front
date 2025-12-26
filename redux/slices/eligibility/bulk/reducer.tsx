import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'

import { BulkService } from '@/services/eligibility/bulk/bulk.service'
import { EligibilityBulkState } from '@/types/redux'

const initialState: EligibilityBulkState = {
  bulkData: null,
  loading: false,
  error: null,
  submitLoading: false,
}

export const submitBulkEligibility = createAsyncThunk(
  'eligibilityBulk/submitBulkEligibility',
  async (file: File, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await BulkService.createBulk(formData)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<{
        message?: string
        msg?: string
        error?: string
      }>
      const errorMessage =
        axiosError?.response?.data?.message ||
        axiosError?.response?.data?.msg ||
        axiosError?.response?.data?.error ||
        (typeof axiosError?.response?.data === 'string' ? axiosError.response.data : null) ||
        axiosError?.message ||
        'Failed to upload bulk eligibility file. Please check the file format and try again.'

      return rejectWithValue(errorMessage)
    }
  }
)

const eligibilityBulkSlice = createSlice({
  name: 'eligibilityBulk',
  initialState,
  reducers: {
    clearBulkError: state => {
      state.error = null
    },
    clearBulkData: state => {
      state.bulkData = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(submitBulkEligibility.pending, state => {
        state.submitLoading = true
        state.error = null
      })
      .addCase(submitBulkEligibility.fulfilled, (state, action) => {
        state.submitLoading = false
        const payload = action.payload
        state.bulkData = payload?.data || payload || null
        state.error = null
      })
      .addCase(submitBulkEligibility.rejected, (state, action) => {
        state.submitLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearBulkError, clearBulkData } = eligibilityBulkSlice.actions
export default eligibilityBulkSlice.reducer
