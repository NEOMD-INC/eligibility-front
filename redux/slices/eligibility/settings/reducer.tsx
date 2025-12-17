import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { EligibilitySettingsService } from '@/services/eligibility/settings/settings.service'
import type { EligibilitySettings, EligibilitySettingsState } from '@/types'

const initialState: EligibilitySettingsState = {
  settings: null,
  loading: false,
  error: null,
  updateLoading: false,
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
      if (key === 'idQualifier') {
        apiObj.id_qualifier = obj[key]
      } else if (key === 'authorizationInformationQualifier') {
        apiObj.authorization_information_qualifier = obj[key]
      } else if (key === 'authorizationInformation') {
        apiObj.authorization_information = obj[key]
      } else if (key === 'securityInformationQualifier') {
        apiObj.security_information_qualifier = obj[key]
      } else if (key === 'securityInformation') {
        apiObj.security_information = obj[key]
      } else if (key === 'senderQualifier') {
        apiObj.sender_qualifier = obj[key]
      } else if (key === 'senderId') {
        apiObj.sender_id = obj[key]
      } else if (key === 'receiverQualifier') {
        apiObj.receiver_qualifier = obj[key]
      } else if (key === 'receiverId') {
        apiObj.receiver_id = obj[key]
      } else if (key === 'repetitionSeparator') {
        apiObj.repetition_separator = obj[key]
      } else if (key === 'controlVersion') {
        apiObj.control_version = obj[key]
      } else if (key === 'acknowledgmentRequested') {
        apiObj.acknowledgment_requested = obj[key]
      } else if (key === 'usageIndicator') {
        apiObj.usage_indicator = obj[key]
      } else if (key === 'componentElementSeparator') {
        apiObj.component_element_separator = obj[key]
      } else {
        apiObj[key] = mapFormToApi(obj[key])
      }
    }
  }
  return apiObj
}

// Async thunk to fetch eligibility settings
export const fetchEligibilitySettings = createAsyncThunk(
  'eligibilitySettings/fetchEligibilitySettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await EligibilitySettingsService.getAvailityEligibilitySettings()
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to fetch eligibility settings'
      )
    }
  }
)

// Async thunk to update eligibility settings
export const updateEligibilitySettings = createAsyncThunk(
  'eligibilitySettings/updateEligibilitySettings',
  async (settingsData: {}, { rejectWithValue }) => {
    try {
      // Convert form data to API format
      const apiData = mapFormToApi(settingsData)
      
      // Separate subscriber settings from ISA settings
      const subscriberData: any = {}
      const isaData: any = {}
      
      // Extract subscriber fields
      if (apiData.id_qualifier !== undefined) {
        subscriberData.id_qualifier = apiData.id_qualifier
      }
      
      // Extract ISA fields
      Object.keys(apiData).forEach(key => {
        if (key !== 'id_qualifier') {
          isaData[key] = apiData[key]
        }
      })
      
      const payload: any = {}
      if (Object.keys(isaData).length > 0) {
        payload.isa = isaData
      }
      if (Object.keys(subscriberData).length > 0) {
        payload.subscriber = subscriberData
      }
      
      const response = await EligibilitySettingsService.updateEligibilitySettings(payload)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Failed to update eligibility settings'
      )
    }
  }
)

const eligibilitySettingsSlice = createSlice({
  name: 'eligibilitySettings',
  initialState,
  reducers: {
    clearEligibilitySettingsError: state => {
      state.error = null
    },
  },
  extraReducers: builder => {
    // Fetch eligibility settings
    builder
      .addCase(fetchEligibilitySettings.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEligibilitySettings.fulfilled, (state, action) => {
        state.loading = false
        // Handle different response structures
        const payload = action.payload
        state.settings = payload?.data || payload || null
        state.error = null
      })
      .addCase(fetchEligibilitySettings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Update eligibility settings
    builder
      .addCase(updateEligibilitySettings.pending, state => {
        state.updateLoading = true
        state.error = null
      })
      .addCase(updateEligibilitySettings.fulfilled, (state, action) => {
        state.updateLoading = false
        // Update settings with the response, preserving the structure
        const payload = action.payload
        const updatedSettings = payload?.data || payload
        if (updatedSettings) {
          // Merge subscriber and ISA settings with existing settings
          if (state.settings) {
            state.settings = {
              ...state.settings,
              ...(updatedSettings.subscriber && {
                subscriber: {
                  ...state.settings.subscriber,
                  ...updatedSettings.subscriber,
                },
              }),
              ...(updatedSettings.isa && {
                isa: {
                  ...state.settings.isa,
                  ...updatedSettings.isa,
                },
              }),
            }
          } else {
            state.settings = updatedSettings
          }
        }
        state.error = null
      })
      .addCase(updateEligibilitySettings.rejected, (state, action) => {
        state.updateLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearEligibilitySettingsError } = eligibilitySettingsSlice.actions
export default eligibilitySettingsSlice.reducer

