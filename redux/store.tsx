import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from '@reduxjs/toolkit'
import userReducer from './slices/current-user/userSlice'
import userProfileReducer from './slices/user-profile/reducer'
import storage from 'redux-persist/lib/storage'
import { persistStore, persistReducer } from 'redux-persist'

const userPersistConfig = {
  key: 'user',
  storage,
  whitelist: ['user'],
}

// Combine reducers
const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  userProfile: userProfileReducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

// Create persistor
export const persistor = persistStore(store)

// Types for hooks
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
