'use client'
import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import SubmitButton from '@/components/ui/buttons/submit-button/SubmitButton'
import Link from 'next/link'
import { themeColors } from '@/theme'
import { authService } from '@/services/auth.service'
import { PageTransition } from '@/components/providers/page-transition-provider/PageTransitionProvider'

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
          className={`mb-6 p-4 rounded-lg ${
            isError ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
          }`}
        >
          <span>{errorMsg}</span>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-800 mb-1">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="off"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
              formik.touched.email && formik.errors.email
                ? 'border-red-500 focus:ring-red-400'
                : 'border-gray-300 focus:ring-blue-400'
            }`}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-600 text-sm mt-1">{formik.errors.email}</p>
          )}
        </div>

        <div className="flex justify-end mb-6 text-sm">
          <Link href="/login" className="text-blue-600">
            Back to login
          </Link>
        </div>

        <SubmitButton
          type="submit"
          title="Send Reset Link"
          class_name="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
          btnLoading={btnLoading}
          callback_event=""
        />
      </form>
    </PageTransition>
  )
}
