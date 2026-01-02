'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCookie } from '@/lib/cookies/cookies'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const token = getCookie('access_token')
    if (token) {
      router.replace('/quick-link-dashboard')
    } else {
      router.replace('/login')
    }
  }, [router])

  return null
}
