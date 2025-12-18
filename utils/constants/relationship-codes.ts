/**
 * Relationship Codes for Eligibility Checks
 * Format: Code => Description
 */

export interface RelationshipCodeOption {
  value: string
  label: string
}

export const RELATIONSHIP_CODES: RelationshipCodeOption[] = [
  { value: '18', label: 'Self' },
  { value: '01', label: 'Spouse' },
  { value: '19', label: 'Child' },
  { value: '20', label: 'Employee' },
  { value: '21', label: 'Unknown' },
  { value: '39', label: 'Organ Donor' },
  { value: '40', label: 'Cadaver Donor' },
  { value: '53', label: 'Life Partner' },
  { value: 'G8', label: 'Other Relationship' },
]

/**
 * Get relationship code label by value
 */
export const getRelationshipCodeLabel = (value: string): string => {
  const relationshipCode = RELATIONSHIP_CODES.find(rc => rc.value === value)
  return relationshipCode ? relationshipCode.label : value
}

/**
 * Format relationship code for display: "18 - Self"
 */
export const formatRelationshipCode = (value: string): string => {
  const relationshipCode = RELATIONSHIP_CODES.find(rc => rc.value === value)
  return relationshipCode ? `${relationshipCode.value} - ${relationshipCode.label}` : value
}

