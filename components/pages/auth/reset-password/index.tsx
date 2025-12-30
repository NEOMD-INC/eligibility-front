'use client'
import { useFormik } from 'formik'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import * as Yup from 'yup'

import { PageTransition } from '@/components/providers/page-transition-provider/PageTransitionProvider'
import SubmitButton from '@/components/ui/buttons/submit-button/SubmitButton'
import { authService } from '@/services/auth.service'
import { themeColors } from '@/theme'

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

        await authService.resetPassword(payload as any)

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
          className="mb-6 p-4 rounded-lg"
          style={{
            backgroundColor: isError ? themeColors.red[100] : themeColors.blue[100],
            color: isError ? themeColors.red[700] : themeColors.blue[700],
          }}
        >
          <span>{errorMsg}</span>
        </div>

        <div className="mb-6">
          <label
            className="block text-sm font-semibold mb-1"
            style={{ color: themeColors.text.secondary }}
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="off"
            onChange={formik.handleChange}
            value={formik.values.password}
            className="w-full px-4 py-2 rounded-md border bg-white focus:outline-none focus:ring-2"
            style={{
              color: themeColors.text.primary,
              borderColor:
                formik.touched.password && formik.errors.password
                  ? themeColors.border.error
                  : themeColors.border.default,
            }}
            onFocus={e => {
              e.currentTarget.style.boxShadow = `0 0 0 2px ${formik.touched.password && formik.errors.password ? themeColors.border.focusRing.red : themeColors.border.focusRing.blue}`
            }}
            onBlur={e => {
              e.currentTarget.style.boxShadow = ''
              formik.handleBlur(e)
            }}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-sm mt-1" style={{ color: themeColors.text.error }}>
              {formik.errors.password}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label
            className="block text-sm font-semibold mb-1"
            style={{ color: themeColors.text.secondary }}
          >
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            autoComplete="off"
            onChange={formik.handleChange}
            value={formik.values.confirmPassword}
            className="w-full px-4 py-2 rounded-md border bg-white focus:outline-none focus:ring-2"
            style={{
              color: themeColors.text.primary,
              borderColor:
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? themeColors.border.error
                  : themeColors.border.default,
            }}
            onFocus={e => {
              e.currentTarget.style.boxShadow = `0 0 0 2px ${formik.touched.confirmPassword && formik.errors.confirmPassword ? themeColors.border.focusRing.red : themeColors.border.focusRing.blue}`
            }}
            onBlur={e => {
              e.currentTarget.style.boxShadow = ''
              formik.handleBlur(e)
            }}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="text-sm mt-1" style={{ color: themeColors.text.error }}>
              {formik.errors.confirmPassword}
            </p>
          )}
        </div>

        <div className="flex justify-end mb-6 text-sm">
          <Link href="/login" style={{ color: themeColors.blue[600] }}>
            Already have an account?
          </Link>
        </div>

        <SubmitButton
          type="submit"
          title="Reset Password"
          class_name="w-full text-white py-3 rounded-md transition"
          style={{ backgroundColor: themeColors.blue[600] }}
          onMouseEnter={e => {
            const btn = e.currentTarget as HTMLButtonElement
            if (!btn.disabled) btn.style.backgroundColor = themeColors.blue[700]
          }}
          onMouseLeave={e => {
            const btn = e.currentTarget as HTMLButtonElement
            if (!btn.disabled) btn.style.backgroundColor = themeColors.blue[600]
          }}
          btnLoading={btnLoading}
          callback_event=""
        />
      </form>
    </PageTransition>
  )
}
