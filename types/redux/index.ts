/**
 * Redux-specific types
 */

import { BaseListState } from '../common'
import {
  CarrierGroup,
  CarrierAddress,
  CarrierSetup,
  AvailityPayer,
  EligibilitySettings,
  User,
  Role,
  Permission,
} from '../entities'

// Carrier Groups State
export interface CarrierGroupsState extends BaseListState<CarrierGroup> {
  carrierGroups: CarrierGroup[]
  currentCarrierGroup: CarrierGroup | null
  fetchCarrierGroupLoading: boolean
}

// Carrier Addresses State
export interface CarrierAddressesState extends BaseListState<CarrierAddress> {
  carrierAddresses: CarrierAddress[]
  currentCarrierAddress: CarrierAddress | null
  fetchCarrierAddressLoading: boolean
}

// Carrier Setups State
export interface CarrierSetupsState extends BaseListState<CarrierSetup> {
  carrierSetups: CarrierSetup[]
  currentCarrierSetup: CarrierSetup | null
  fetchCarrierSetupLoading: boolean
}

// Availity Payers State
export interface AvailityPayersState extends BaseListState<AvailityPayer> {
  availityPayers: AvailityPayer[]
  currentAvailityPayer: AvailityPayer | null
  fetchAvailityPayerLoading: boolean
}

// Eligibility Settings State
export interface EligibilitySettingsState {
  settings: EligibilitySettings | null
  loading: boolean
  error: string | null
  updateLoading: boolean
  fetchEligibilitySettingsLoading?: boolean
}

// Users State
export interface UsersState extends BaseListState<User> {
  users: User[]
  currentUser: User | null
  fetchUserLoading: boolean
}

// Roles State
export interface RolesState extends BaseListState<Role> {
  roles: Role[]
  currentRole: Role | null
  fetchRoleLoading: boolean
}

// Permissions State
export interface PermissionsState extends BaseListState<Permission> {
  permissions: Permission[]
  currentPermission: Permission | null
  fetchPermissionLoading: boolean
}

// Eligibility Bulk State
export interface EligibilityBulkState {
  bulkData: unknown | null
  loading: boolean
  error: string | null
  submitLoading: boolean
}

