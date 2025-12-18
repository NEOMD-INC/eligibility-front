export const formatDate = (dateString?: string, comp?: string) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: comp === 'user' ? 'short' : '2-digit',
      day: comp === 'user' ? 'numeric' : '2-digit',
    })
  } catch {
    return dateString
  }
}
