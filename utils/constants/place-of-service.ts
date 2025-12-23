export interface PlaceOfServiceOption {
  value: string
  label: string
}

export const PLACE_OF_SERVICE_CODES: PlaceOfServiceOption[] = [
  { value: '11', label: 'Office' },
  { value: '12', label: 'Home' },
  { value: '21', label: 'Inpatient Hospital' },
  { value: '22', label: 'Outpatient Hospital' },
  { value: '23', label: 'Emergency Room' },
  { value: '31', label: 'Skilled Nursing Facility' },
  { value: '32', label: 'Nursing Facility' },
  { value: '41', label: 'Ambulance – Land' },
  { value: '42', label: 'Ambulance – Air/Water' },
  { value: '50', label: 'Federally Qualified Health Center' },
  { value: '71', label: 'State/Public Health Clinic' },
  { value: '99', label: 'Other Place of Service' },
]

export const getPlaceOfServiceLabel = (value: string): string => {
  const placeOfService = PLACE_OF_SERVICE_CODES.find(pos => pos.value === value)
  return placeOfService ? placeOfService.label : value
}

export const formatPlaceOfService = (value: string): string => {
  const placeOfService = PLACE_OF_SERVICE_CODES.find(pos => pos.value === value)
  return placeOfService ? `${placeOfService.value} - ${placeOfService.label}` : value
}
