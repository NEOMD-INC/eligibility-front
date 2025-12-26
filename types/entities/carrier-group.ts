/**
 * Carrier Group entity types
 */

import { BaseEntity } from '../common'

export interface CarrierGroup extends BaseEntity {
  carrier_group_code?: string
  carrier_group_description?: string
  filling_indicator?: string
  status?: boolean | string
  // Legacy/compatibility fields
  description?: string
  code?: string
  fillingIndicator?: string
  isActive?: boolean
  is_active?: boolean
}

// Form values for Carrier Group
export interface CarrierGroupFormValues {
  description: string
  code: string
  fillingIndicator: string
  isActive: boolean
}
