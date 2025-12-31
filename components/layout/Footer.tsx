'use client'

import { useEffect, useMemo, useState } from 'react'

import { themeColors } from '@/theme'

import type { FooterConfig, FooterProps } from './types/types'
export { type FooterConfig, type FooterProps }

export const Footer: React.FC<FooterProps> = ({ config = {} }) => {
  const [hover, setHover] = useState(false)

  const footerConfig: FooterConfig = useMemo(
    () => ({
      display: true,
      containerClass: '',
      fixed: {
        desktop: false,
        mobile: false,
      },
      ...config?.app?.footer,
    }),
    [config?.app?.footer]
  )

  const [currentYear, setCurrentYear] = useState<string>('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentYear(new Date().getFullYear().toString())
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      updateDOM(footerConfig)
    }
  }, [footerConfig])

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
        className="transition-colors duration-200"
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
        style={{ color: hover ? themeColors.blue[600] : themeColors.text.primary }}
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

const updateDOM = (config: FooterConfig): void => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return
  }

  document.body.classList.remove('data-kt-app-footer-fixed', 'data-kt-app-footer-fixed-mobile')

  if (config.fixed?.desktop) {
    document.body.classList.add('data-kt-app-footer-fixed')
  }

  if (config.fixed?.mobile) {
    document.body.classList.add('data-kt-app-footer-fixed-mobile')
  }
}
