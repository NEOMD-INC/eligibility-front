import Image from 'next/image'

import ForgotPasswordPage from '@/components/pages/auth/forgot-password/index'
import { themeColors } from '@/theme'

export default function ForgotPassword() {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8"
      style={{ backgroundColor: themeColors.background.secondary }}
    >
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <div className="mb-6">
            <Image
              src="/logo/neoLogo.png"
              alt="NeoMD Logo"
              width={150}
              height={60}
              priority
              unoptimized
              className="object-contain"
            />
          </div>
          <h2
            className="text-center text-3xl font-bold tracking-tight"
            style={{ color: themeColors.text.primary }}
          >
            Restore your account
          </h2>
        </div>
        <ForgotPasswordPage />
      </div>
    </div>
  )
}
