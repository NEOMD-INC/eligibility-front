export function setCookie(name: string, value: string, maxAge?: number) {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge ?? 0}`
}

export function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0`
}

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null // SSR safe
  const cookieString = document.cookie
  const cookies = cookieString.split('; ').reduce((acc: Record<string, string>, current) => {
    const [key, val] = current.split('=')
    acc[key] = val
    return acc
  }, {})
  return cookies[name] || null
}
