/**
 * Eligibility Settings entity types
 */

export interface SubscriberSettings {
  id_qualifier?: string
  // Legacy/compatibility fields
  idQualifier?: string
}

export interface ISASettings {
  authorization_information_qualifier?: string
  authorization_information?: string
  security_information_qualifier?: string
  security_information?: string
  sender_qualifier?: string
  sender_id?: string
  receiver_qualifier?: string
  receiver_id?: string
  repetition_separator?: string
  control_version?: string
  acknowledgment_requested?: string
  usage_indicator?: string
  component_element_separator?: string
  // Legacy/compatibility fields
  authorizationInformationQualifier?: string
  authorizationInformation?: string
  securityInformationQualifier?: string
  securityInformation?: string
  senderQualifier?: string
  senderId?: string
  receiverQualifier?: string
  receiverId?: string
  repetitionSeparator?: string
  controlVersion?: string
  acknowledgmentRequested?: string
  usageIndicator?: string
  componentElementSeparator?: string
}

export interface EligibilitySettings {
  isa?: ISASettings
  subscriber?: SubscriberSettings
  submitter?: any
  receiver?: any
  // Direct ISA fields for backward compatibility
  authorization_information_qualifier?: string
  authorization_information?: string
  security_information_qualifier?: string
  security_information?: string
  sender_qualifier?: string
  sender_id?: string
  receiver_qualifier?: string
  receiver_id?: string
  repetition_separator?: string
  control_version?: string
  acknowledgment_requested?: string
  usage_indicator?: string
  component_element_separator?: string
}

// Form values for Subscriber Settings
export interface SubscriberSettingsFormValues {
  idQualifier: string
}

// Form values for ISA Settings
export interface ISASettingsFormValues {
  // Subscriber Settings
  idQualifier: string
  // ISA Settings
  authorizationInformationQualifier: string
  authorizationInformation: string
  securityInformationQualifier: string
  securityInformation: string
  senderQualifier: string
  senderId: string
  receiverQualifier: string
  receiverId: string
  repetitionSeparator: string
  controlVersion: string
  acknowledgmentRequested: string
  usageIndicator: string
  componentElementSeparator: string
}
