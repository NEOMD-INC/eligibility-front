'use client'
import { useFormik } from 'formik'
import Link from 'next/link'
import { useState } from 'react'
import * as Yup from 'yup'

import { PageTransition } from '@/components/providers/page-transition-provider/PageTransitionProvider'
import SubmitButton from '@/components/ui/buttons/submit-button/SubmitButton'
import { authService } from '@/services/auth.service'
import { themeColors } from '@/theme'

export default function ForgotPasswordPage() {
  const [btnLoading, setBtnLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMsg, setErrorMsg] = useState(
    'Enter your email and we will send you a password reset link.'
  )

  const formik = useFormik({
    initialValues: {
      email: '',
    },

    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Required'),
    }),

    onSubmit: async values => {
      try {
        setBtnLoading(true)
        setIsError(false)

        await authService.forgotPassword({
          email: values.email,
        })
      } catch (error: any) {
        setIsError(true)
        setErrorMsg(error.response?.data?.message || 'Something went wrong')
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
            Email
          </label>
          <div
            style={
              {
                '--input-border':
                  formik.touched.email && formik.errors.email
                    ? themeColors.border.error
                    : themeColors.border.default,
                '--input-ring':
                  formik.touched.email && formik.errors.email
                    ? themeColors.border.focusRing.red
                    : themeColors.border.focusRing.blue,
              } as React.CSSProperties
            }
            className="[&>input]:border-[var(--input-border)] [&>input:focus]:ring-[var(--input-ring)]"
          >
            <input
              type="email"
              name="email"
              placeholder="Email"
              autoComplete="off"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className="w-full px-4 py-2 rounded-md border bg-white focus:outline-none focus:ring-2"
              style={{
                color: themeColors.text.primary,
              }}
            />
          </div>
          {formik.touched.email && formik.errors.email && (
            <p className="text-sm mt-1" style={{ color: themeColors.text.error }}>
              {formik.errors.email}
            </p>
          )}
        </div>

        <div className="flex justify-end mb-6 text-sm">
          <Link href="/login" style={{ color: themeColors.text.link }}>
            Back to login
          </Link>
        </div>

        <div
          style={
            {
              '--btn-bg': themeColors.blue[600],
              '--btn-hover-bg': themeColors.blue[700],
            } as React.CSSProperties
          }
          className="[&>button]:!bg-[var(--btn-bg)] [&>button:hover:not(:disabled)]:!bg-[var(--btn-hover-bg)]"
        >
          <SubmitButton
            type="submit"
            title="Send Reset Link"
            class_name="w-full text-white py-3 rounded-md transition"
            btnLoading={btnLoading}
            callback_event=""
          />
        </div>
      </form>
    </PageTransition>
  )
}
