'use client'

import Link from 'next/link'
import axios from 'axios'

const MenuItems = () => {
  const logoutbtn = async e => {
    e.preventDefault()

    if (typeof window === 'undefined') {
      return
    }

    try {
      const token = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('token') : null
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/logout`, config)
    } catch (error) {
      console.error('Error:', error)
    }

    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.clear()
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
    window.location.reload()
  }

  return (
    <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-4 text-sm font-semibold w-64 z-50">
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
