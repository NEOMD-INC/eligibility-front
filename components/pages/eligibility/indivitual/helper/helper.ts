export const getDOBMaxDate = () => {
  const today = new Date()
  today.setDate(today.getDate() - 1)
  return today.toISOString().split('T')[0]
}

export const getServiceDateMinMax = () => {
  const today = new Date()
  const oneYearAndTenDaysAgo = new Date(today)
  oneYearAndTenDaysAgo.setFullYear(today.getFullYear() - 1)
  oneYearAndTenDaysAgo.setDate(oneYearAndTenDaysAgo.getDate() - 10)
  const twoMonthsFuture = new Date(today)
  twoMonthsFuture.setMonth(today.getMonth() + 2)

  return {
    min: oneYearAndTenDaysAgo.toISOString().split('T')[0],
    max: twoMonthsFuture.toISOString().split('T')[0],
  }
}

export const splitName = (fullName: string | null | undefined) => {
  if (!fullName) return { lastName: '', firstName: '' }

  if (fullName.includes(',')) {
    const parts = fullName.split(',').map(p => p.trim())
    return {
      lastName: parts[0] || '',
      firstName: parts[1] || '',
    }
  }

  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) {
    return { lastName: parts[0], firstName: '' }
  }
  const lastName = parts[parts.length - 1]
  const firstName = parts.slice(0, -1).join(' ')
  return { lastName, firstName }
}
