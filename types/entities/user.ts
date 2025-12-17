/**
 * User entity types
 */

import { BaseEntity } from '../common'

export interface User extends BaseEntity {
  id: string
  uuid: string
  first_name: string
  last_name: string
  full_name: string
  email: string
  username: string
  role?: string | { name: string }
  roles?: string[]
  gender?: string
  profile_image_path?: string | null
  created_at: string
}

// Form values for User (Add)
export interface AddUserFormValues {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  role: string
}

// Form values for User (Edit)
export interface EditUserFormValues {
  fullName: string
  email: string
  newPassword: string
  confirmNewPassword: string
}

