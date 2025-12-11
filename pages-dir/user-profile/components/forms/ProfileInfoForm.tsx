'use client'
import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import SubmitButton from '@/components/ui/buttons/submit-button/SubmitButton'
// Theme colors - Tailwind classes like bg-blue-600, text-gray-800, etc. use theme colors via CSS variables
import { themeColors } from '@/theme'

export default function ProfileInfoForm() {
  const [btnLoading, setBtnLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
    },

    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
    }),

    onSubmit: async values => {
      console.log(values)
    },
  })

  return (
    <div>
      <form className="w-full" onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name field */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Name</label>
            <input
              type="name"
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
