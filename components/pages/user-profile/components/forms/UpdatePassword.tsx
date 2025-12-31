'use client'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'

import SubmitButton from '@/components/ui/buttons/submit-button/SubmitButton'
import { clearPasswordError, updateUserPassword } from '@/redux/slices/user-profile/reducer'
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
          <div
            className="mb-4 p-4 rounded-lg"
            style={{ backgroundColor: themeColors.red[100], color: themeColors.red[700] }}
          >
            <span>{updatePasswordError}</span>
          </div>
        )}

        {showSuccess && !updatePasswordError && (
          <div
            className="mb-4 p-4 rounded-lg"
            style={{ backgroundColor: themeColors.green[100], color: themeColors.green[600] }}
          >
            <span>Password updated successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              className="block text-sm font-semibold mb-1"
              style={{ color: themeColors.text.secondary }}
            >
              Current Password
            </label>
            <input
              type="password"
              name="current_password"
              placeholder="Current Password"
              autoComplete="current-password"
              onChange={formik.handleChange}
              value={formik.values.current_password}
              className="w-full px-4 py-2 rounded-md border bg-white focus:outline-none focus:ring-2"
              style={{
                color: themeColors.text.primary,
                borderColor:
                  formik.touched.current_password && formik.errors.current_password
                    ? themeColors.border.error
                    : themeColors.border.default,
              }}
              onFocus={e => {
                e.currentTarget.style.boxShadow = `0 0 0 2px ${formik.touched.current_password && formik.errors.current_password ? themeColors.border.focusRing.red : themeColors.border.focusRing.blue}`
              }}
              onBlur={e => {
                e.currentTarget.style.boxShadow = ''
                formik.handleBlur(e)
              }}
            />
            {formik.touched.current_password && formik.errors.current_password && (
              <p className="text-sm mt-1" style={{ color: themeColors.text.error }}>
                {formik.errors.current_password}
              </p>
            )}
          </div>

          <div>
            <label
              className="block text-sm font-semibold mb-1"
              style={{ color: themeColors.text.secondary }}
            >
              New Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="New Password"
              autoComplete="new-password"
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

          <div>
            <label
              className="block text-sm font-semibold mb-1"
              style={{ color: themeColors.text.secondary }}
            >
              Confirm Password
            </label>
            <input
              type="password"
              name="password_confirmation"
              placeholder="Confirm Password"
              autoComplete="new-password"
              onChange={formik.handleChange}
              value={formik.values.password_confirmation}
              className="w-full px-4 py-2 rounded-md border bg-white focus:outline-none focus:ring-2"
              style={{
                color: themeColors.text.primary,
                borderColor:
                  formik.touched.password_confirmation && formik.errors.password_confirmation
                    ? themeColors.border.error
                    : themeColors.border.default,
              }}
              onFocus={e => {
                e.currentTarget.style.boxShadow = `0 0 0 2px ${formik.touched.password_confirmation && formik.errors.password_confirmation ? themeColors.border.focusRing.red : themeColors.border.focusRing.blue}`
              }}
              onBlur={e => {
                e.currentTarget.style.boxShadow = ''
                formik.handleBlur(e)
              }}
            />
            {formik.touched.password_confirmation && formik.errors.password_confirmation && (
              <p className="text-sm mt-1" style={{ color: themeColors.text.error }}>
                {formik.errors.password_confirmation}
              </p>
            )}
          </div>
        </div>

        <div className="w-30 mt-6">
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
            title="Save"
            callback_event=""
            btnLoading={updatePasswordLoading}
          />
        </div>
      </form>
    </div>
  )
}
