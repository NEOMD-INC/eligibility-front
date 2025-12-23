export interface Benefit {
  benefit_type?: string
  service_type_code?: string
  coverage_level?: string
  coverage_level_code?: string
  network?: string
  messages?: string[]
  copays?: Record<string, number | string>
  deductible?: unknown
  coinsurance_value?: unknown
  out_of_pocket?: unknown
}

export interface Benefits {
  in_network?: Benefit[]
  out_of_network?: Benefit[]
  both_networks?: Benefit[]
}

export interface PatientDashboardData {
  patient?: Record<string, unknown>
  subscriber?: Record<string, unknown>
  mco?: Record<string, unknown>
  coverage?: unknown[]
  provider?: Record<string, unknown>
  dates?: Record<string, unknown>
  benefits?: Benefits
  primary_care_provider?: Record<string, unknown>
  payer?: Record<string, unknown>
}

export interface PatientDashboardState {
  patientData: PatientDashboardData | null
  loading: boolean
  error: string | null
}

