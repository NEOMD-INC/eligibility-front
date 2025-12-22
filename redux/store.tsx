import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from '@reduxjs/toolkit'
import userReducer from './slices/current-user/userSlice'
import userProfileReducer from './slices/user-profile/reducer'
import usersReducer from './slices/user-management/users/reducer'
import rolesReducer from './slices/user-management/roles/reducer'
import permissionsReducer from './slices/user-management/permissions/reducer'
import carrierGroupsReducer from './slices/settings/carrier-groups/reducer'
import carrierAddressesReducer from './slices/settings/carrier-addresses/reducer'
import carrierSetupsReducer from './slices/settings/carrier-setups/reducer'
import availityPayersReducer from './slices/settings/availity-payers/reducer'
import eligibilitySettingsReducer from './slices/eligibility/settings/reducer'
import eligibilityIndivitualReducer from './slices/eligibility/indivitual/reducer'
import eligibilityHistoryReducer from './slices/eligibility/history/reducer'
import eligibilityLogsReducer from './slices/logs/eligibility-logs/reducer'
import storage from 'redux-persist/lib/storage'
import { persistStore, persistReducer } from 'redux-persist'
import patientDashboardReducer from './slices/patient-dashboard/reducer'

const userPersistConfig = {
  key: 'user',
  storage,
  whitelist: ['user'],
}

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  userProfile: userProfileReducer,
  users: usersReducer,
  roles: rolesReducer,
  permissions: permissionsReducer,
  carrierGroups: carrierGroupsReducer,
  carrierAddresses: carrierAddressesReducer,
  carrierSetups: carrierSetupsReducer,
  availityPayers: availityPayersReducer,
  eligibilitySettings: eligibilitySettingsReducer,
  eligibilityIndivitual: eligibilityIndivitualReducer,
  eligibilityHistory: eligibilityHistoryReducer,
  eligibilityLogs: eligibilityLogsReducer,
  patientDashboard: patientDashboardReducer,
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

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
