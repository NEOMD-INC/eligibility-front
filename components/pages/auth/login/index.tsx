'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import SubmitButton from '@/components/ui/buttons/submit-button/SubmitButton'
import { themeColors } from '@/theme'
import { authService } from '@/services/auth.service'
import { setCookie } from '@/lib/cookies/cookies'
import { useDispatch } from 'react-redux'
import { setUser } from '@/redux/slices/current-user/userSlice'
import { PageTransition } from '@/components/providers/page-transition-provider/PageTransitionProvider'

interface LoginValues {
  email: string
  password: string
}

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
            className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 
            ${
              formik.touched.email && formik.errors.email
                ? 'border-red-500 focus:ring-red-400'
                : 'border-gray-300 focus:ring-blue-400'
            }`}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-600 text-sm mt-1">{formik.errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-800 mb-1">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="off"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 
            ${
              formik.touched.password && formik.errors.password
                ? 'border-red-500 focus:ring-red-400'
                : 'border-gray-300 focus:ring-blue-400'
            }`}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-600 text-sm mt-1">{formik.errors.password}</p>
          )}
        </div>

        <div className="flex justify-end mb-6">
          <Link href="/register" className="text-blue-600 text-sm mr-3">
            Register
          </Link>
          <Link href="/forgot-password" className="text-blue-600 text-sm">
            Forgot Password ?
          </Link>
        </div>

        <div className="w-full">
          <SubmitButton
            type="submit"
            class_name="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
            title="Continue"
            callback_event=""
            btnLoading={btnLoading}
          />
        </div>
      </form>
    </PageTransition>
  )
}
