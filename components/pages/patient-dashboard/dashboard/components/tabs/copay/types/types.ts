export interface CopayItem {
  title: string
  value: string | number | any
  coverage_level: string | any
  subtitle: string
  footer: string
  messages: string[] | string
  additionalInfo: {
    timePeriod: string
    notes: string[] | string
  }
}
export interface RawCopayData {
  benefit_type: string
  copay_value: string | number
  coverage_level: string | any
  messages: (string | string[])[]
}
