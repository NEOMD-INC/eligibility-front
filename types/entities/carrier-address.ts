/**
 * Carrier Address entity types
 */

import { BaseEntity } from '../common'

export interface CarrierAddress extends BaseEntity {
  carrier_code?: string
  actual_name?: string
  address_id?: string
  address_line1?: string
  address_line_1?: string
  city?: string
  state?: string
  zip_code?: string
  phone_type?: string
  phone_number?: string
  insurance_department?: string
  carrierCode?: string
  actualName?: string
  addressId?: string
  addressLine1?: string
  zipCode?: string
  phoneType?: string
  phoneNumber?: string
  insuranceDepartment?: string
}

// Form values for Carrier Address
export interface CarrierAddressFormValues {
  carrierCode: string
  actualName: string
  addressId: string
  addressLine1: string
  city: string
  state: string
  zipCode: string
  phoneType: string
  phoneNumber: string
  insuranceDepartment: string
}
