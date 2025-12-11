'use client'
import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import SubmitButton from '@/components/ui/buttons/submit-button/SubmitButton'
// Theme colors - Tailwind classes like bg-blue-600, text-gray-800, etc. use theme colors via CSS variables
import { themeColors } from '@/theme'

export default function UpdatePasswordForm() {
  const [btnLoading, setBtnLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },

    validationSchema: Yup.object({
      currentPassword: Yup.string().required('Required'),
      newPassword: Yup.string().required('Required'),
      confirmPassword: Yup.string().required('Required'),
    }),

    onSubmit: async values => {
      console.log(values)
    },
  })

  return (
    <div>
      <form className="w-full" onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Current Password
            </label>
            <input
              type="text"
              name="Current Password"
              placeholder="Current Password"
              autoComplete="off"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.currentPassword}
              className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 
                            focus:outline-none focus:ring-2
                            ${
                              formik.touched.currentPassword && formik.errors.currentPassword
                                ? 'border-red-500 focus:ring-red-400'
                                : 'border-gray-300 focus:ring-blue-400'
                            }`}
            />
            {formik.touched.currentPassword && formik.errors.currentPassword && (
              <p className="text-red-600 text-sm mt-1">{formik.errors.currentPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">New Password</label>
            <input
              type="text"
              name="New Password"
              placeholder="New Password"
              autoComplete="off"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.newPassword}
              className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 
                            focus:outline-none focus:ring-2
                            ${
                              formik.touched.newPassword && formik.errors.newPassword
                                ? 'border-red-500 focus:ring-red-400'
                                : 'border-gray-300 focus:ring-blue-400'
                            }`}
            />
            {formik.touched.newPassword && formik.errors.newPassword && (
              <p className="text-red-600 text-sm mt-1">{formik.errors.newPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Confirm Password
            </label>
            <input
              type="text"
              name="Confirm Password"
              placeholder="Confirm Password"
              autoComplete="off"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
              className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 
                            focus:outline-none focus:ring-2
                            ${
                              formik.touched.confirmPassword && formik.errors.confirmPassword
                                ? 'border-red-500 focus:ring-red-400'
                                : 'border-gray-300 focus:ring-blue-400'
                            }`}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="text-red-600 text-sm mt-1">{formik.errors.confirmPassword}</p>
            )}
          </div>
        </div>

        {/* Submit button */}
        <div className="w-30 mt-6">
          <SubmitButton
            type="submit"
            class_name="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
            title="Save"
            callback_event=""
            btnLoading={btnLoading}
          />
        </div>
      </form>
    </div>
  )
}
