/**
 * Availity Payer entity types
 */

import { BaseEntity } from '../common'

export interface AvailityPayer extends BaseEntity {
  payer_id?: string
  payer_name?: string
  payer_code?: string
  contact_name?: string
  address_line_1?: string
  address_line_2?: string
  city?: string
  state?: string
  zip?: string
  phone?: string
  email?: string
  is_active?: boolean
  status?: boolean | string
  notes?: string
  payerId?: string
  payerName?: string
  payerCode?: string
  contactName?: string
  addressLine1?: string
  addressLine2?: string
  zipCode?: string
  isActive?: boolean
}

// Form values for Availity Payer
export interface AvailityPayerFormValues {
  payerId: string
  payerName: string
  payerCode: string
  contactName: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  zipCode: string
  phone: string
  email: string
  isActive: boolean
  notes: string
}
