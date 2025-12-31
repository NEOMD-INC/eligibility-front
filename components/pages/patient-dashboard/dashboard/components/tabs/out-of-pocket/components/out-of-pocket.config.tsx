export const getOutOfPocketData = (outOfPocketData: any) =>
  outOfPocketData?.map((item: any) => {
    const messages = item.messages || []
    const remaining = parseFloat(item.out_of_pocket?.remaining || 0)
    const total = parseFloat(item.out_of_pocket?.total || 0)
    const used = Math.max(0, total - remaining)

    return {
      title: item.benefit_type,
      value: `$${remaining} Remaining`,
      used: used,
      total: total,
      footer: 'Resets on 12/31/2024',
      additionalInfo: {
        timePeriod: 'Year to Date',
        notes: messages?.[1],
      },
    }
  }) || []
