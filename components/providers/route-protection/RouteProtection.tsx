'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { RootState } from '@/redux/store'
import { getCookie } from '@/lib/cookies/cookies'

interface RouteProtectionProps {
  children: React.ReactNode
}

export function RouteProtection({ children }: RouteProtectionProps) {
  const router = useRouter()
  const pathname = usePathname()
  const user = useSelector((state: RootState) => state?.user?.user)

  useEffect(() => {
    const token = getCookie('access_token')
    const protectedPaths = [
      '/patient-dashboard',
      '/settings',
      '/user-management',
      '/user-profile',
      '/eligibility',
      '/logs',
    ]

    const authPaths = ['/login', '/register', '/forgot-password', '/reset-password']

    // Handle root path
    if (pathname === '/') {
      if (token) {
        router.replace('/quick-link-dashboard')
      } else {
        router.replace('/login')
      }
      return
    }

    // Protect routes that require authentication
    if (!token && protectedPaths.some(p => pathname.startsWith(p))) {
      router.replace('/login')
      return
    }

    // Redirect authenticated users away from auth pages
    if (token && authPaths.some(p => pathname.startsWith(p))) {
      router.replace('/patient-dashboard')
      return
    }
  }, [pathname, router])

  return <>{children}</>
}

