/**
 * Permission entity types
 */

import { BaseEntity } from '../common'

export interface Permission extends BaseEntity {
  id: string
  uuid?: string
  name: string
  guard_name?: string
  description?: string
  created_at?: string
  updated_at?: string
}

// Form values for Permission
export interface PermissionFormValues {
  permissionName: string
}

