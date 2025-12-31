'use client'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'

import SubmitButton from '@/components/ui/buttons/submit-button/SubmitButton'
import { setUser } from '@/redux/slices/current-user/userSlice'
import { clearProfileError, updateUserProfile } from '@/redux/slices/user-profile/reducer'
import { AppDispatch, RootState } from '@/redux/store'
import { themeColors } from '@/theme'

export default function ProfileInfoForm() {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.user)
  const { updateProfileLoading, updateProfileError } = useSelector(
    (state: RootState) => state.userProfile
  )
  const [showSuccess, setShowSuccess] = useState(false)

  const formik = useFormik({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
    }),

    onSubmit: async values => {
      dispatch(clearProfileError())
      setShowSuccess(false)
      const result = await dispatch(updateUserProfile({ name: values.name, email: values.email }))
      if (updateUserProfile.fulfilled.match(result)) {
        if (result.payload?.data) {
          dispatch(setUser({ ...user, ...result.payload.data }))
        } else {
          dispatch(setUser({ ...user, name: values.name, email: values.email }))
        }
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      }
    },
  })

  useEffect(() => {
    return () => {
      dispatch(clearProfileError())
    }
  }, [dispatch])

  return (
    <div>
      <form className="w-full" onSubmit={formik.handleSubmit}>
        {updateProfileError && (
          <div
            className="mb-4 p-4 rounded-lg"
            style={{ backgroundColor: themeColors.red[100], color: themeColors.red[700] }}
          >
            <span>{updateProfileError}</span>
          </div>
        )}

        {showSuccess && !updateProfileError && (
          <div
            className="mb-4 p-4 rounded-lg"
            style={{ backgroundColor: themeColors.green[100], color: themeColors.green[600] }}
          >
            <span>Profile updated successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              className="block text-sm font-semibold mb-1"
              style={{ color: themeColors.text.secondary }}
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              autoComplete="off"
              onChange={formik.handleChange}
              value={formik.values.name}
              className="w-full px-4 py-2 rounded-md border bg-white focus:outline-none focus:ring-2"
              style={{
                color: themeColors.text.primary,
                borderColor:
                  formik.touched.name && formik.errors.name
                    ? themeColors.border.error
                    : themeColors.border.default,
              }}
              onFocus={e => {
                e.currentTarget.style.boxShadow = `0 0 0 2px ${formik.touched.name && formik.errors.name ? themeColors.border.focusRing.red : themeColors.border.focusRing.blue}`
              }}
              onBlur={e => {
                e.currentTarget.style.boxShadow = ''
                formik.handleBlur(e)
              }}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-sm mt-1" style={{ color: themeColors.text.error }}>
                {formik.errors.name as any}
              </p>
            )}
          </div>

          <div>
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
                {formik.errors.email as any}
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
            btnLoading={updateProfileLoading}
          />
        </div>
      </form>
    </div>
  )
}
