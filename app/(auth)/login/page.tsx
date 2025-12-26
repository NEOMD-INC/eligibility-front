// Theme colors - Tailwind classes use theme colors via CSS variables
import Image from 'next/image'
import LoginPage from '@/components/pages/auth/login/index'
import { themeColors } from '@/theme'

export default function Login() {
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
              className="object-contain"
            />
          </div>
          <h2
            className="text-center text-3xl font-bold tracking-tight"
            style={{ color: themeColors.text.primary }}
          >
            Sign in to your account
          </h2>
        </div>
        <LoginPage />
      </div>
    </div>
  )
}
