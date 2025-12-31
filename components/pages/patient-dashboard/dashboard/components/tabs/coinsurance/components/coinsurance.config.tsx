import { CoinsuranceItem } from '../types/types'

export const getCoInsuranceData = (coinsuranceData: any) =>
  coinsuranceData?.map((item: CoinsuranceItem) => {
    const messages = item.messages || []
    const subtitle =
      messages.length > 2 ? messages[2] : messages[0] || 'Primary Care Visit. Copay Included in OOP'
    const allMessages = messages.length > 0 ? messages.join('; ') : 'Up to 30% of Hospital Charges'

    const coinsurancePercent = item.coinsurance_percent ?? item.coinsurance_value
    const timePeriod = item.coinsurance_time_period || 'Calendar Year'

    let displayValue: string
    if (coinsurancePercent === null || coinsurancePercent === undefined) {
      displayValue = 'N/A'
    } else if (typeof coinsurancePercent === 'string') {
      displayValue = coinsurancePercent.includes('%')
        ? coinsurancePercent
        : `${coinsurancePercent}%`
    } else {
      displayValue = `${coinsurancePercent}%`
    }

    return {
      title: item.benefit_type,
      value: displayValue,
      subtitle: subtitle,
      footer: timePeriod,
      additionalInfo: {
        timePeriod: timePeriod,
        notes: allMessages,
      },
    }
  }) || []
