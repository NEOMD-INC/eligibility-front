// lib/utils/token.ts
import Cookies from 'js-cookie'

export const TokenManager = {
  setToken(token: string): void {
    // Store token in cookie for middleware
    Cookies.set('token', token, {
      expires: 1,
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    })

    // Optional: store in localStorage for client use
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token)
    }
  },

  getToken(): string | undefined {
    if (typeof window === 'undefined') return undefined

    // Prefer cookie over localStorage for consistency with middleware
    return Cookies.get('token') || localStorage.getItem('token') || undefined
  },

  removeToken(): void {
    Cookies.remove('token')
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
    }
  },

  hasToken(): boolean {
    return !!this.getToken()
  },
}
