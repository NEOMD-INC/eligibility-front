'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import SubmitButton from '@/components/ui/buttons/submit-button/SubmitButton'
// import { useAppDispatch } from '../../redux/hooks/hooks'
// import { addUser, setProfileId, setLoading, setError, clearError } from '@/redux/slices/userSlice'
import { TokenManager } from '../../../utils/token'
// Theme colors - Tailwind classes like bg-blue-600, text-gray-800, etc. use theme colors via CSS variables
import { themeColors } from '@/theme'

interface LoginValues {
  email: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  //   const dispatch = useAppDispatch()

  const [btnLoading, setBtnLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMsg, setErrorMsg] = useState(
    'Please login! if you have credential or contact NeoMD Billing team'
  )

  const redirect = searchParams.get('redirect') || '/dashboard'

  // Clear errors when component unmounts
  //   useEffect(() => {
  //     return () => {
  //       dispatch(clearError())
  //     }
  //   }, [dispatch])

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
      console.log(values)
      setBtnLoading(true)
      setIsError(false)
      //   dispatch(setLoading(true))
      //   dispatch(clearError())

      //   try {
      //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      //       method: 'POST',
      //       headers: {
      //         'Content-Type': 'application/json',
      //       },
      //       body: JSON.stringify(values),
      //     })

      //     const data = await response.json()

      //     if (!response.ok) {
      //       throw new Error(data.message || 'Login failed')
      //     }

      //     const userData = data.data
      //     const accessToken = userData.bearer_token.accessToken

      //     // Store token
      //     TokenManager.setToken(accessToken)

      //     // Update Redux state
      //     console.log(userData, "userData")
      //     dispatch(addUser(userData))
      //     dispatch(setProfileId(userData.id))

      //     // Redirect to dashboard
      //     router.replace(redirect)
      //   } catch (err: any) {
      //     setBtnLoading(false)
      //     dispatch(setLoading(false))

      //     const errorMessage = err.message || 'An error occurred during login.'
      // setErrorMsg(errorMessage)
      //     dispatch(setError(errorMessage))
      //     setIsError(true)
      //   }
    },
  })

  return (
    <form className="w-full" onSubmit={formik.handleSubmit} id="kt_login_signin_form">
      {/* ALERT BOX */}
      <div
        className={`mb-6 p-4 rounded-lg ${
          isError ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
        }`}
      >
        <span>{errorMsg}</span>
      </div>

      {/* EMAIL */}
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

      {/* PASSWORD */}
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

      {/* FORGOT PASSWORD */}
      <div className="flex justify-end mb-6">
        <Link href="/register" className="text-blue-600 text-sm mr-3">
          Register
        </Link>
        <Link href="/forgot-password" className="text-blue-600 text-sm">
          Forgot Password ?
        </Link>
      </div>

      {/* SUBMIT */}
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
  )
}
