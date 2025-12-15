import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { userService } from '@/services/user-management/users/users.service'

interface UserProfileState {
  updateProfileLoading: boolean
  updateProfileError: string | null
  updatePasswordLoading: boolean
  updatePasswordError: string | null
}

const initialState: UserProfileState = {
  updateProfileLoading: false,
  updateProfileError: null,
  updatePasswordLoading: false,
  updatePasswordError: null,
}

// Async thunk to update user profile
export const updateUserProfile = createAsyncThunk(
  'userProfile/updateProfile',
  async (data: { name?: string; email?: string }, { rejectWithValue }) => {
    try {
      const response = await userService.updateProfile(data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to update profile')
    }
  }
)

// Async thunk to update password
export const updateUserPassword = createAsyncThunk(
  'userProfile/updatePassword',
  async (
    data: {
      current_password: string
      password: string
      password_confirmation: string
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await userService.updatePassword(data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to update password')
    }
  }
)

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    clearProfileError: state => {
      state.updateProfileError = null
    },
    clearPasswordError: state => {
      state.updatePasswordError = null
    },
  },
  extraReducers: builder => {
    // Update profile
    builder
      .addCase(updateUserProfile.pending, state => {
        state.updateProfileLoading = true
        state.updateProfileError = null
      })
      .addCase(updateUserProfile.fulfilled, state => {
        state.updateProfileLoading = false
        state.updateProfileError = null
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updateProfileLoading = false
        state.updateProfileError = action.payload as string
      })

    // Update password
    builder
      .addCase(updateUserPassword.pending, state => {
        state.updatePasswordLoading = true
        state.updatePasswordError = null
      })
      .addCase(updateUserPassword.fulfilled, state => {
        state.updatePasswordLoading = false
        state.updatePasswordError = null
      })
      .addCase(updateUserPassword.rejected, (state, action) => {
        state.updatePasswordLoading = false
        state.updatePasswordError = action.payload as string
      })
  },
})

export const { clearProfileError, clearPasswordError } = userProfileSlice.actions
export default userProfileSlice.reducer

