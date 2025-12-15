// Theme colors - Tailwind classes use theme colors via CSS variables
import { themeColors } from '@/theme'
import LoginPage from '@/components/pages/auth/login/index'

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <LoginPage />
      </div>
    </div>
  )
}
