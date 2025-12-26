'use client'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'

import SubmitButton from '@/components/ui/buttons/submit-button/SubmitButton'
import { setUser } from '@/redux/slices/current-user/userSlice'
import { clearProfileError, updateUserProfile } from '@/redux/slices/user-profile/reducer'
import { AppDispatch, RootState } from '@/redux/store'
// Theme colors - Tailwind classes like bg-blue-600, text-gray-800, etc. use theme colors via CSS variables
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
        // Update user data in current-user slice if response contains updated user data
        if (result.payload?.data) {
          dispatch(setUser({ ...user, ...result.payload.data }))
        } else {
          // Otherwise update with the values we just submitted
          dispatch(setUser({ ...user, name: values.name, email: values.email }))
        }
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      }
    },
  })

  // Clear error when component unmounts or form is reset
  useEffect(() => {
    return () => {
      dispatch(clearProfileError())
    }
  }, [dispatch])

  return (
    <div>
      <form className="w-full" onSubmit={formik.handleSubmit}>
        {/* Error message */}
        {updateProfileError && (
          <div className="mb-4 p-4 rounded-lg bg-red-100 text-red-700">
            <span>{updateProfileError}</span>
          </div>
        )}

        {/* Success message */}
        {showSuccess && !updateProfileError && (
          <div className="mb-4 p-4 rounded-lg bg-green-100 text-green-700">
            <span>Profile updated successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name field */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              autoComplete="off"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 
                            focus:outline-none focus:ring-2
                            ${
                              formik.touched.name && formik.errors.name
                                ? 'border-red-500 focus:ring-red-400'
                                : 'border-gray-300 focus:ring-blue-400'
                            }`}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-600 text-sm mt-1">{formik.errors.name}</p>
            )}
          </div>

          {/* Email field */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              autoComplete="off"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 
                            focus:outline-none focus:ring-2
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
        </div>

        <div className="w-30 mt-6">
          <SubmitButton
            type="submit"
            class_name="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
            title="Save"
            callback_event=""
            btnLoading={updateProfileLoading}
          />
        </div>
      </form>
    </div>
  )
}
