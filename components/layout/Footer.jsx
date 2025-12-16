'use client'

import { useEffect, useState } from 'react'
// Theme colors - Tailwind classes like text-gray-800, hover:text-blue-600 use theme colors via CSS variables
import { themeColors } from '@/theme'

const Footer = ({ config = {} }) => {
  // Default footer configuration if no config is provided
  const footerConfig = {
    display: true,
    containerClass: '',
    fixed: {
      desktop: false,
      mobile: false,
    },
    ...config?.app?.footer,
  }

  // Use state for year to prevent hydration mismatch
  const [currentYear, setCurrentYear] = useState('')

  // Set year only on client side to prevent hydration mismatch
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentYear(new Date().getFullYear().toString())
    }
  }, [])

  useEffect(() => {
    // Only update DOM on client side
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      updateDOM(footerConfig)
    }
  }, [footerConfig])

  // Return null if footer should not be displayed
  if (!footerConfig.display) {
    return null
  }

  const footerContent = (
    <div className="text-dark order-2 order-md-1 ml-5">
      <span className="text-muted font-semibold me-1" suppressHydrationWarning>
        {currentYear || '2024'}&copy;
      </span>
      <a
        href="https://neomdinc.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-800 hover:text-blue-600 transition-colors duration-200"
      >
        NeoMD PMS
      </a>
    </div>
  )

  return (
    <div
      id="kt_app_footer"
      className={`
        app-footer
        ${footerConfig.fixed?.desktop ? 'fixed bottom-0 left-0 right-0' : ''}
        ${footerConfig.fixed?.mobile ? 'md:fixed' : ''}
      `.trim()}
    >
      {footerConfig.containerClass ? (
        <div className={`app-container ${footerConfig.containerClass}`}>{footerContent}</div>
      ) : (
        footerContent
      )}
    </div>
  )
}

const updateDOM = config => {
  // Guard against server-side execution
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return
  }

  // Remove existing classes
  document.body.classList.remove('data-kt-app-footer-fixed', 'data-kt-app-footer-fixed-mobile')

  // Add classes based on configuration
  if (config.fixed?.desktop) {
    document.body.classList.add('data-kt-app-footer-fixed')
  }

  if (config.fixed?.mobile) {
    document.body.classList.add('data-kt-app-footer-fixed-mobile')
  }
}

export { Footer }
