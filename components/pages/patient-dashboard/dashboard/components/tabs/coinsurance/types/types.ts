export interface CoinsuranceItem {
  benefit_type: string
  service_type_code: string
  coverage_level: string
  coinsurance_value: number | string | null
  coinsurance_percent?: number
  coinsurance_time_period?: string
  network?: string
  messages?: string[]
}

export interface CoinsuranceProps {
  coinsuranceData: CoinsuranceItem[]
}
