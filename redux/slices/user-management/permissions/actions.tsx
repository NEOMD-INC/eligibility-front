// Re-export all actions and thunks from the reducer
export {
  fetchAllPermissions,
  fetchPermissionById,
  createPermission,
  updatePermission,
  deletePermission,
  clearPermissionsError,
  clearCurrentPermission,
  setCurrentPage,
} from './reducer'

