'use client'
import { useEffect, useState, useRef } from 'react'
import { MenuItems } from './MenuItem'
import { themeColors } from '@/theme'
import Link from 'next/link'

const Header = () => {
  const [eligibilityOpen, setEligibilityOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [userMgmtOpen, setUserMgmtOpen] = useState(false)
  const [isProductOpen, setIsProductOpen] = useState(false)
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

          <a style={{ color: 'white', fontWeight: 500, cursor: 'pointer' }}>Patient Dashboard</a>

          <div ref={eligibilityRef} className="relative">
            <button
              onClick={() => setEligibilityOpen(!eligibilityOpen)}
              style={{ color: 'white', fontWeight: 500, cursor: 'pointer' }}
            >
              Eligibility ▾
            </button>

            {eligibilityOpen && (
              <div className="absolute mt-2 bg-white text-black shadow-md rounded-md min-w-[200px] p-2">
                <a className="block px-3 py-2 hover:bg-gray-100 cursor-pointer">Indivitual</a>
                <a className="block px-3 py-2 hover:bg-gray-100 cursor-pointer">Bulk</a>
                <a className="block px-3 py-2 hover:bg-gray-100 cursor-pointer">History</a>
                <a className="block px-3 py-2 hover:bg-gray-100 cursor-pointer">Settings</a>
              </div>
            )}
          </div>

          <div ref={settingsRef} className="relative">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              style={{ color: 'white', fontWeight: 500, cursor: 'pointer' }}
            >
              Settings ▾
            </button>

            {settingsOpen && (
              <div className="absolute mt-2 bg-white text-black shadow-md rounded-md min-w-[200px] p-2">
                <Link
                  className="block px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  href="/settings/carrier-group"
                >
                  Carrier Groups
                </Link>
                <Link
                  className="block px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  href="/settings/carrier-address"
                >
                  Carrier Addresses
                </Link>
                <Link
                  className="block px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  href="/settings/carrier-setup"
                >
                  Carrier Setup
                </Link>
                <a className="block px-3 py-2 hover:bg-gray-100 cursor-pointer">Availity Payer</a>
              </div>
            )}
          </div>

          <a style={{ color: 'white', fontWeight: 500, cursor: 'pointer' }}>Logs</a>

          <div ref={userMgmtRef} className="relative">
            <button
              onClick={() => setUserMgmtOpen(!userMgmtOpen)}
              style={{ color: 'white', fontWeight: 500, cursor: 'pointer' }}
            >
              User Management ▾
            </button>

            {userMgmtOpen && (
              <div className="absolute mt-2 bg-white text-black shadow-md rounded-md min-w-[200px] p-2">
                <Link
                  className="block px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  href="/user-management/users"
                >
                  Users
                </Link>
                <Link
                  className="block px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  href="/user-management/roles"
                >
                  Roles
                </Link>
                <Link
                  className="block px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  href="/user-management/permissions"
                >
                  Permissions
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="relative mt-3" ref={profileRef}>
          <div onClick={() => setIsProductOpen(!isProductOpen)} className="cursor-pointer">
            <div className="w-40 h-10 flex justify-end overflow-hidden">
              <div>Super Admin ▾</div>
            </div>
          </div>

          {isProductOpen && <MenuItems />}
        </div>
      </nav>
    </header>
  )
}

export default Header
