'use client'
import { useEffect, useState, useRef } from 'react'
import { UserProfileImage } from '@/components/ui/image/Image'
import { MenuItems } from './MenuItem'
import { themeColors } from '@/theme'
import Link from 'next/link'

const Header = () => {
  const [eligibilityOpen, setEligibilityOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [userMgmtOpen, setUserMgmtOpen] = useState(false)
  const [isProductOpen, setIsProductOpen] = useState(false)

  const user = null
  const userProfile = user ?? {}

  const eligibilityRef = useRef(null)
  const settingsRef = useRef(null)
  const userMgmtRef = useRef(null)
  const profileRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleClickOutside = event => {
      if (eligibilityRef.current && !eligibilityRef.current.contains(event.target))
        setEligibilityOpen(false)

      if (settingsRef.current && !settingsRef.current.contains(event.target)) setSettingsOpen(false)

      if (userMgmtRef.current && !userMgmtRef.current.contains(event.target)) setUserMgmtOpen(false)

      if (profileRef.current && !profileRef.current.contains(event.target)) setIsProductOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header
      style={{
        backgroundColor: themeColors.custom.headerBlue,
        color: themeColors.white,
        height: 50,
        fontFamily: 'Arial, sans-serif',
        zIndex: 1000,
      }}
    >
      <nav
        style={{
          maxWidth: '100%',
          margin: '0 30px',
          height: '100%',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 40,
            fontSize: 14,
            userSelect: 'none',
          }}
        >
          <a style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>NeoMD</a>

          <a style={{ color: 'white', fontWeight: 500 }}>Patient Dashboard</a>

          <div ref={eligibilityRef} className="relative">
            <button
              onClick={() => setEligibilityOpen(!eligibilityOpen)}
              style={{ color: 'white', fontWeight: 500 }}
            >
              Eligibility ▾
            </button>

            {eligibilityOpen && (
              <div className="absolute mt-2 bg-white text-black shadow-md rounded-md min-w-[200px] p-2">
                <a className="block px-3 py-2 hover:bg-gray-100">Indivitual</a>
                <a className="block px-3 py-2 hover:bg-gray-100">Bulk</a>
                <a className="block px-3 py-2 hover:bg-gray-100">History</a>
                <a className="block px-3 py-2 hover:bg-gray-100">Settings</a>
              </div>
            )}
          </div>

          <div ref={settingsRef} className="relative">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              style={{ color: 'white', fontWeight: 500 }}
            >
              Settings ▾
            </button>

            {settingsOpen && (
              <div className="absolute mt-2 bg-white text-black shadow-md rounded-md min-w-[200px] p-2">
                <a className="block px-3 py-2 hover:bg-gray-100">Carrier Groups</a>
                <a className="block px-3 py-2 hover:bg-gray-100">Carrier Addresses</a>
                <a className="block px-3 py-2 hover:bg-gray-100">Carrier Setup</a>
                <a className="block px-3 py-2 hover:bg-gray-100">Availity Payer</a>
              </div>
            )}
          </div>

          <a style={{ color: 'white', fontWeight: 500 }}>Logs</a>

          <div ref={userMgmtRef} className="relative">
            <button
              onClick={() => setUserMgmtOpen(!userMgmtOpen)}
              style={{ color: 'white', fontWeight: 500 }}
            >
              User Management ▾
            </button>

            {userMgmtOpen && (
              <div className="absolute mt-2 bg-white text-black shadow-md rounded-md min-w-[200px] p-2">
                <Link className="block px-3 py-2 hover:bg-gray-100" href="/user-management/users">
                  Users
                </Link>
                <a className="block px-3 py-2 hover:bg-gray-100">Roles</a>
                <a className="block px-3 py-2 hover:bg-gray-100">Permissions</a>
              </div>
            )}
          </div>
        </div>

        <div className="relative mt-2" ref={profileRef}>
          <div onClick={() => setIsProductOpen(!isProductOpen)} className="cursor-pointer">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <UserProfileImage
                profileImagePath={userProfile.profile_image_path}
                gender={userProfile.gender}
              />
            </div>
          </div>

          {isProductOpen && <MenuItems />}
        </div>
      </nav>
    </header>
  )
}

export default Header
