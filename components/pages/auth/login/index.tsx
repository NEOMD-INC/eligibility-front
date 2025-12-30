'use client'
import { useFormik } from 'formik'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import * as Yup from 'yup'

import { PageTransition } from '@/components/providers/page-transition-provider/PageTransitionProvider'
import SubmitButton from '@/components/ui/buttons/submit-button/SubmitButton'
import { setCookie } from '@/lib/cookies/cookies'
import { setUser } from '@/redux/slices/current-user/userSlice'
import { authService } from '@/services/auth.service'
import { themeColors } from '@/theme'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useDispatch()

  const [btnLoading, setBtnLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMsg, setErrorMsg] = useState(
    'Please login! if you have credential or contact NeoMD Billing team'
  )

  const redirect = searchParams.get('redirect') || '/'

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },

    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().required('Required'),
    }),

    onSubmit: async values => {
      setBtnLoading(true)
      setIsError(false)

      try {
        const res = await authService.login({
          email: values.email,
          password: values.password,
        })

        const { access_token } = res.data.data.token
        const { user } = res.data.data

        setCookie('access_token', access_token, 60 * 60 * 4)
        dispatch(setUser(user))

        router.push(redirect)
      } catch (err: any) {
        setIsError(true)
        setErrorMsg(err?.response?.data?.message || 'Invalid credentials')
      } finally {
        setBtnLoading(false)
      }
    },
  })

  return (
    <PageTransition>
      <form className="w-full" onSubmit={formik.handleSubmit} id="kt_login_signin_form">
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
          <input
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="off"
            onChange={formik.handleChange}
            value={formik.values.email}
            className="w-full px-4 py-2 rounded-md border bg-white focus:outline-none focus:ring-2"
            style={{
              color: themeColors.text.primary,
              borderColor:
                formik.touched.email && formik.errors.email
                  ? themeColors.border.error
                  : themeColors.border.default,
            }}
            onFocus={e => {
              e.currentTarget.style.boxShadow = `0 0 0 2px ${formik.touched.email && formik.errors.email ? themeColors.border.focusRing.red : themeColors.border.focusRing.blue}`
            }}
            onBlur={e => {
              e.currentTarget.style.boxShadow = ''
              formik.handleBlur(e)
            }}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-sm mt-1" style={{ color: themeColors.text.error }}>
              {formik.errors.email}
            </p>
          )}
        </div>

        <div className="mb-4">
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

        <div className="flex justify-end mb-6">
          <Link href="/register" className="text-sm mr-3" style={{ color: themeColors.blue[600] }}>
            Register
          </Link>
          <Link
            href="/forgot-password"
            className="text-sm"
            style={{ color: themeColors.blue[600] }}
          >
            Forgot Password ?
          </Link>
        </div>

        <div className="w-full">
          <SubmitButton
            type="submit"
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
            title="Continue"
            callback_event=""
            btnLoading={btnLoading}
          />
        </div>
      </form>
    </PageTransition>
  )
}
