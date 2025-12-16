import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { userProfileService } from '@/services/user-profile/userprofile.service'

interface UserState {
  user: Record<string, any> | null
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
}

// Async thunk to fetch current user details
export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userProfileService.getCurrentUserDetail()
      return response.data
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch user details')
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Record<string, any>>) => {
      state.user = action.payload
    },
    clearUser: state => {
      state.user = null
      state.error = null
    },
  },
  extraReducers: builder => {
    // Fetch current user
    builder
      .addCase(fetchCurrentUser.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload?.data || action.payload
        state.error = null
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer
