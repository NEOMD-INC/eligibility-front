'use client'
import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import SubmitButton from '@/components/ui/buttons/submit-button/SubmitButton'
import { updateUserPassword, clearPasswordError } from '@/redux/slices/user-profile/reducer'
import { AppDispatch, RootState } from '@/redux/store'
import { themeColors } from '@/theme'

export default function UpdatePasswordForm() {
  const dispatch = useDispatch<AppDispatch>()
  const { updatePasswordLoading, updatePasswordError } = useSelector(
    (state: RootState) => state.userProfile
  )
  const [showSuccess, setShowSuccess] = useState(false)

  const formik = useFormik({
    initialValues: {
      current_password: '',
      password: '',
      password_confirmation: '',
    },

    validationSchema: Yup.object({
      current_password: Yup.string().required('Current password is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('New password is required'),
      password_confirmation: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Please confirm your password'),
    }),

    onSubmit: async (values, { resetForm }) => {
      dispatch(clearPasswordError())
      setShowSuccess(false)
      const result = await dispatch(updateUserPassword(values))
      if (updateUserPassword.fulfilled.match(result)) {
        resetForm()
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      }
    },
  })

  useEffect(() => {
    return () => {
      dispatch(clearPasswordError())
    }
  }, [dispatch])

  return (
    <div>
      <form className="w-full" onSubmit={formik.handleSubmit}>
        {updatePasswordError && (
          <div className="mb-4 p-4 rounded-lg bg-red-100 text-red-700">
            <span>{updatePasswordError}</span>
          </div>
        )}

        {showSuccess && !updatePasswordError && (
          <div className="mb-4 p-4 rounded-lg bg-green-100 text-green-700">
            <span>Password updated successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Current Password
            </label>
            <input
              type="password"
              name="current_password"
              placeholder="Current Password"
              autoComplete="current-password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.current_password}
              className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 
                            focus:outline-none focus:ring-2
                            ${
                              formik.touched.current_password && formik.errors.current_password
                                ? 'border-red-500 focus:ring-red-400'
                                : 'border-gray-300 focus:ring-blue-400'
                            }`}
            />
            {formik.touched.current_password && formik.errors.current_password && (
              <p className="text-red-600 text-sm mt-1">{formik.errors.current_password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">New Password</label>
            <input
              type="password"
              name="password"
              placeholder="New Password"
              autoComplete="new-password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 
                            focus:outline-none focus:ring-2
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

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="password_confirmation"
              placeholder="Confirm Password"
              autoComplete="new-password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password_confirmation}
              className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 
                            focus:outline-none focus:ring-2
                            ${
                              formik.touched.password_confirmation &&
                              formik.errors.password_confirmation
                                ? 'border-red-500 focus:ring-red-400'
                                : 'border-gray-300 focus:ring-blue-400'
                            }`}
            />
            {formik.touched.password_confirmation && formik.errors.password_confirmation && (
              <p className="text-red-600 text-sm mt-1">{formik.errors.password_confirmation}</p>
            )}
          </div>
        </div>

        <div className="w-30 mt-6">
          <SubmitButton
            type="submit"
            class_name="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
            title="Save"
            callback_event=""
            btnLoading={updatePasswordLoading}
          />
        </div>
      </form>
    </div>
  )
}
