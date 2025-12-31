export interface SearchableSelectOption {
  value: string
  label: string
}

export interface SearchableSelectPayerProps {
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onBlur: (e: React.FocusEvent<HTMLSelectElement>) => void
  placeholder?: string
  className?: string
  error?: boolean
  disabled?: boolean
  searchResults?: any[]
  loading?: boolean
}

export interface SearchableSelectProps {
  name: string
  value: string
  options: SearchableSelectOption[]
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onBlur: (e: React.FocusEvent<HTMLSelectElement>) => void
  placeholder?: string
  className?: string
  error?: boolean
  disabled?: boolean
  maxVisibleItems?: number
}
