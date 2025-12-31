import { RawCopayData } from '../types/types'

export const getCopayData = (copaysData: any) =>
  copaysData?.map((item: RawCopayData) => ({
    title: item.benefit_type,
    value: item.copay_value,
    coverage_level: item.coverage_level,
    subtitle: item.messages?.[2],
    footer: 'Per Visit',
    messages: item.messages?.[1] || [],
    additionalInfo: {
      timePeriod: 'Per Visit',
      notes: item.messages?.[1],
    },
  })) || []
