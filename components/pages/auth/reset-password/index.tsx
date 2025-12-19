'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import SubmitButton from '@/components/ui/buttons/submit-button/SubmitButton'
import { themeColors } from '@/theme'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/auth.service'
import { useSearchParams } from 'next/navigation'
import { PageTransition } from '@/components/providers/page-transition-provider/PageTransitionProvider'

export default function ResetPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [btnLoading, setBtnLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('Reset Your Password to access the Elegibility system.')
  const token = searchParams.get('token')
  const email = searchParams.get('email')

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },

    validationSchema: Yup.object({
      password: Yup.string().min(6, 'Minimum 6 characters').required('Required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Required'),
    }),

    onSubmit: async values => {
      setBtnLoading(true)
      setIsError(false)

      try {
        const payload = {
          token,
          email,
          password: values.password,
          password_confirmation: values.confirmPassword,
        }

        await authService.resetPassword(payload)

        router.push('/login')
      } catch (err: any) {
        setIsError(true)

        const message =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          'Registration failed. Please try again.'

        setErrorMsg(message)
      } finally {
        setBtnLoading(false)
      }
    },
  })

  return (
    <PageTransition>
      <form className="w-full" onSubmit={formik.handleSubmit}>
        <div
          className={`mb-6 p-4 rounded-lg ${
            isError ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
          }`}
        >
          <span>{errorMsg}</span>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-800 mb-1">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="off"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
              formik.touched.password && formik.errors.password
                ? 'border-red-500 focus:ring-red-400'
                : 'border-gray-300 focus:ring-blue-400'
            }`}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-600 text-sm mt-1">{formik.errors.password}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-800 mb-1">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            autoComplete="off"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
            className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
              formik.touched.confirmPassword && formik.errors.confirmPassword
                ? 'border-red-500 focus:ring-red-400'
                : 'border-gray-300 focus:ring-blue-400'
            }`}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="text-red-600 text-sm mt-1">{formik.errors.confirmPassword}</p>
          )}
        </div>

        <div className="flex justify-end mb-6 text-sm">
          <Link href="/login" className="text-blue-600">
            Already have an account?
          </Link>
        </div>

        <SubmitButton
          type="submit"
          title="Reset Password"
          class_name="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
          btnLoading={btnLoading}
          callback_event=""
        />
      </form>
    </PageTransition>
  )
}
