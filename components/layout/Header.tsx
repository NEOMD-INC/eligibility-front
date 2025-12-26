'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import { RootState } from '@/redux/store'
import { themeColors } from '@/theme'

import { PageTransition } from '../providers/page-transition-provider/PageTransitionProvider'
import { TitleTransitionButton } from '../providers/title-transition-provider/TittleTransitionProvider'
import { MenuItems } from './MenuItem'

const Header = () => {
  const [eligibilityOpen, setEligibilityOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [userMgmtOpen, setUserMgmtOpen] = useState(false)
  const [isProductOpen, setIsProductOpen] = useState(false)
  const eligibilityRef = useRef(null)
  const settingsRef = useRef(null)
  const userMgmtRef = useRef(null)
  const profileRef = useRef(null)
  const user = useSelector((state: RootState) => state?.user?.user)

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

          <TitleTransitionButton>
            <Link
              style={{ color: 'white', fontWeight: 500, cursor: 'pointer' }}
              href="/quick-link-dashboard"
            >
              Dashboard
            </Link>
          </TitleTransitionButton>

          <TitleTransitionButton>
            <Link
              style={{ color: 'white', fontWeight: 500, cursor: 'pointer' }}
              href="/eligibility/history"
            >
              Eligibility History
            </Link>
          </TitleTransitionButton>

          <div ref={eligibilityRef} className="relative">
            <TitleTransitionButton>
              <button
                onClick={() => setEligibilityOpen(!eligibilityOpen)}
                style={{ color: 'white', fontWeight: 500, cursor: 'pointer' }}
              >
                Eligibility ▾
              </button>
            </TitleTransitionButton>

            {eligibilityOpen && (
              <PageTransition>
                <div className="absolute mt-2 bg-white text-black shadow-md rounded-md min-w-[200px] p-2">
                  <Link
                    className="block px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    href="/eligibility/indivitual"
                    onClick={() => setEligibilityOpen(!eligibilityOpen)}
                  >
                    Indivitual
                  </Link>
                  <Link
                    className="block px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    href="/eligibility/bulk"
                    onClick={() => setEligibilityOpen(!eligibilityOpen)}
                  >
                    Bulk
                  </Link>
                  <Link
                    className="block px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    // href="/eligibility/settings"
                    href="#"
                    onClick={() => setEligibilityOpen(!eligibilityOpen)}
                  >
                    Settings
                  </Link>
                </div>
              </PageTransition>
            )}
          </div>

          <div ref={settingsRef} className="relative">
            <TitleTransitionButton>
              <button
                onClick={() => setSettingsOpen(!settingsOpen)}
                style={{ color: 'white', fontWeight: 500, cursor: 'pointer' }}
              >
                Settings ▾
              </button>
            </TitleTransitionButton>

            {settingsOpen && (
              <PageTransition>
                <div className="absolute mt-2 bg-white text-black shadow-md rounded-md min-w-[200px] p-2">
                  <Link
                    className="block px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    href="/settings/carrier-group"
                    onClick={() => setSettingsOpen(!settingsOpen)}
                  >
                    Carrier Groups
                  </Link>
                  <Link
                    className="block px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    href="/settings/carrier-address"
                    onClick={() => setSettingsOpen(!settingsOpen)}
                  >
                    Carrier Addresses
                  </Link>
                  <Link
                    className="block px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    // href="/settings/carrier-setup"
                    href="#"
                    onClick={() => setSettingsOpen(!settingsOpen)}
                  >
                    Carrier Setup
                  </Link>
                  <Link
                    className="block px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    // href="/settings/availity-payer"
                    href="#"
                    onClick={() => setSettingsOpen(!settingsOpen)}
                  >
                    Availity Payer
                  </Link>
                </div>
              </PageTransition>
            )}
          </div>

          <TitleTransitionButton>
            <Link style={{ color: 'white', fontWeight: 500, cursor: 'pointer' }} href="/logs">
              Logs
            </Link>
          </TitleTransitionButton>

          <div ref={userMgmtRef} className="relative">
            <TitleTransitionButton>
              <button
                onClick={() => setUserMgmtOpen(!userMgmtOpen)}
                style={{ color: 'white', fontWeight: 500, cursor: 'pointer' }}
              >
                User Management ▾
              </button>
            </TitleTransitionButton>

            {userMgmtOpen && (
              <PageTransition>
                <div className="absolute mt-2 bg-white text-black shadow-md rounded-md min-w-[200px] p-2">
                  <Link
                    className="block px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    href="/user-management/users"
                    onClick={() => setUserMgmtOpen(!userMgmtOpen)}
                  >
                    Users
                  </Link>
                  <Link
                    className="block px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    href="/user-management/roles"
                    onClick={() => setUserMgmtOpen(!userMgmtOpen)}
                  >
                    Roles
                  </Link>
                  <Link
                    className="block px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    href="/user-management/permissions"
                    onClick={() => setUserMgmtOpen(!userMgmtOpen)}
                  >
                    Permissions
                  </Link>
                </div>
              </PageTransition>
            )}
          </div>
        </div>

        <div className="relative mt-3" ref={profileRef}>
          <TitleTransitionButton>
            <div onClick={() => setIsProductOpen(!isProductOpen)} className="cursor-pointer">
              <div className="w-40 h-10 flex justify-end overflow-hidden">
                <div>{user?.name ? `${user.name} ▾` : 'Super Admin ▾'}</div>
              </div>
            </div>
          </TitleTransitionButton>

          {isProductOpen && (
            <div onClick={() => setIsProductOpen(!isProductOpen)}>
              <PageTransition>
                <MenuItems />
              </PageTransition>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header
