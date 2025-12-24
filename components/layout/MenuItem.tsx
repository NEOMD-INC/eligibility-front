'use client'

import Link from 'next/link'
import { deleteCookie } from '@/lib/cookies/cookies'
import { authService } from '@/services/auth.service'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { clearUser } from '@/redux/slices/current-user/userSlice'

const MenuItems = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const logoutbtn = async (e: any) => {
    e.preventDefault()

    try {
      await authService.logout()
      deleteCookie('access_token')
      dispatch(clearUser())
      router.push('/login')
    } catch (err: any) {
      console.error('Logout failed:', err)
    }
  }

  return (
    <div className="absolute right-0 top-full mt-0 bg-white rounded-lg shadow-xl border border-gray-200 py-4 text-sm font-semibold w-64 z-50">
      <div className="px-3 hover:bg-gray-50 rounded">
        <Link href={`/user-profile`} className="block px-3 py-2 text-gray-700 hover:text-gray-900">
          User Profile
        </Link>
      </div>

      <div className="border-t border-gray-200 my-2"></div>

      <div className="px-3 hover:bg-gray-50 rounded">
        <Link
          href="#"
          onClick={logoutbtn}
          className="block px-3 py-2 text-gray-700 hover:text-gray-900"
        >
          Sign Out
        </Link>
      </div>
    </div>
  )
}

export { MenuItems }
