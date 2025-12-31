export interface FilterField {
  name: string
  label: string
  type: 'text' | 'select' | 'number' | 'email' | 'date'
  placeholder?: string
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  options?: Array<{ value: string | number; label: string }>
  className?: string
}

export interface FiltersProps {
  fields: FilterField[]
  onReset: () => void
  onSubmit: () => void
  columns?: number
  showSearchIcon?: boolean
  resetLabel?: string
  submitLabel?: string
  className?: string
}
