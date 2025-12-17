/**
 * Role entity types
 */

import { BaseEntity } from '../common'

export interface Role extends BaseEntity {
  id: string
  uuid?: string
  name: string
  system_name?: string
  description?: string
  permissions?: string[]
  users_count?: number
  users?: Array<{
    id: string
    uuid?: string
    name?: string
    full_name?: string
    first_name?: string
    last_name?: string
    email: string
    username?: string
  }>
  created_at?: string
  updated_at?: string
}

// Form values for Role
export interface RoleFormValues {
  roleName: string
  permissions: string[]
}

