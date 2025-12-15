// Theme colors - Tailwind classes use theme colors via CSS variables
import { themeColors } from '@/theme'
import ResetPage from '@/components/pages/auth/reset-password/index'

export default function ResetPassword() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Reset Your Password
          </h2>
        </div>
        <ResetPage />
      </div>
    </div>
  )
}
