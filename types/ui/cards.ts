export type InfoCardProps = {
  title: string
  value: string | number
  subtitle?: string
  footer?: string
  additionalInfo?: {
    timePeriod?: string
    notes?: string
  }
}

export type ProgressCardProps = {
  title: string
  value: string
  used: number
  total: number
  footer?: string
  additionalInfo?: {
    timePeriod?: string
    notes?: string
  }
}
