/**
 * Carrier Setup entity types
 */

import { BaseEntity } from '../common'

export interface CarrierSetup extends BaseEntity {
  carrier_group_code?: string
  carrier_group_description?: string
  carrier_code?: string
  carrier_description?: string
  state?: string
  batch_player_id?: string
  batch_payer_id?: string
  is_clia?: boolean | string | number
  cob?: string
  corrected_claim?: string
  enrollment_required?: string
  carrierGroupCode?: string
  carrierGroupDescription?: string
  carrierCode?: string
  carrierDescription?: string
  batchPlayerId?: string
  isClia?: boolean | string
  correctedClaim?: string
  enrollmentRequired?: string
}

// Form values for Carrier Setup
export interface CarrierSetupFormValues {
  carrierGroupCode: string
  carrierGroupDescription: string
  carrierCode: string
  carrierDescription: string
  state: string
  batchPlayerId: string
  isClia: boolean
  cob: string
  correctedClaim: string
  enrollmentRequired: string
}
