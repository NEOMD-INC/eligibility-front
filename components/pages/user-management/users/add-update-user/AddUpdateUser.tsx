'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import SubmitButton from '@/components/ui/buttons/submit-button/SubmitButton'

interface AddUserValues {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  role: string
}

interface EditUserValues {
  fullName: string
  email: string
  newPassword: string
  confirmNewPassword: string
}

const ROLES = ['employee', 'manager', 'superadmin', 'team lead']

export default function AddUpdateUser() {
  const router = useRouter()
  const params = useParams()
  const userId = params?.id as string | undefined
  const isEditMode = !!userId

  const [btnLoading, setBtnLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [currentRoles, setCurrentRoles] = useState<string[]>([])

  // Mock current roles for edit mode - replace with actual API call
  useEffect(() => {
    if (isEditMode && userId) {
      // TODO: Fetch user data including current roles
      // For now, using mock data
      setCurrentRoles(['superAdmin', 'Admin'])
    }
  }, [isEditMode, userId])

  // Add User Validation Schema
  const addUserValidationSchema = Yup.object({
    fullName: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
    role: Yup.string().oneOf(ROLES, 'Please select a valid role').required('Role selection is required'),
  })

  // Edit User Validation Schema
  const editUserValidationSchema = Yup.object({
    fullName: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    newPassword: Yup.string().min(6, 'Password must be at least 6 characters').required('New password is required'),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], 'Passwords must match')
      .required('Confirm new password is required'),
  })

  // Add User Formik
  const addUserFormik = useFormik<AddUserValues>({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
    },
    validationSchema: addUserValidationSchema,
    onSubmit: async values => {
      setBtnLoading(true)
      setIsError(false)
      try {
        console.log('Add User Values:', values)
        // TODO: Add API call to create user
        // await createUser(values)
        setTimeout(() => {
          setBtnLoading(false)
          router.push('/user-management/users')
        }, 1000)
      } catch (err: any) {
        setBtnLoading(false)
        setIsError(true)
        setErrorMsg(err.message || 'An error occurred while creating the user.')
      }
    },
  })

  // Edit User Formik
  const editUserFormik = useFormik<EditUserValues>({
    initialValues: {
      fullName: '',
      email: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    validationSchema: editUserValidationSchema,
    onSubmit: async values => {
      setBtnLoading(true)
      setIsError(false)
      try {
        console.log('Edit User Values:', values)
        // TODO: Add API call to update user
        // await updateUser(userId, values)
        setTimeout(() => {
          setBtnLoading(false)
          router.push('/user-management/users')
        }, 1000)
      } catch (err: any) {
        setBtnLoading(false)
        setIsError(true)
        setErrorMsg(err.message || 'An error occurred while updating the user.')
      }
    },
  })

  // Load user data in edit mode
  useEffect(() => {
    if (isEditMode && userId) {
      // TODO: Fetch user data from API
      // For now, using mock data
      const loadUserData = async () => {
        try {
          // const userData = await fetchUser(userId)
          // For now, using mock data
          editUserFormik.setValues({
            fullName: 'Super Admin',
            email: 'superAdmin@gmail.com',
            newPassword: '',
            confirmNewPassword: '',
          })
        } catch (error) {
          console.error('Error loading user data:', error)
        }
      }
      loadUserData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, userId])

  if (isEditMode) {
    return (
      <div className="flex flex-col justify-center bg-gray-100 p-6">
        <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8">
          <h1 className="text-2xl font-bold mb-6">Edit User</h1>

          <form onSubmit={editUserFormik.handleSubmit}>
            {/* ALERT BOX */}
            {errorMsg && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  isError ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}
              >
                <span>{errorMsg}</span>
              </div>
            )}

            {/* FULL NAME */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-800 mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                autoComplete="off"
                onChange={editUserFormik.handleChange}
                onBlur={editUserFormik.handleBlur}
                value={editUserFormik.values.fullName}
                className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                  editUserFormik.touched.fullName && editUserFormik.errors.fullName
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-blue-400'
                }`}
              />
              {editUserFormik.touched.fullName && editUserFormik.errors.fullName && (
                <p className="text-red-600 text-sm mt-1">{editUserFormik.errors.fullName}</p>
              )}
            </div>

            {/* EMAIL */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-800 mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                autoComplete="off"
                onChange={editUserFormik.handleChange}
                onBlur={editUserFormik.handleBlur}
                value={editUserFormik.values.email}
                className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                  editUserFormik.touched.email && editUserFormik.errors.email
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-blue-400'
                }`}
              />
              {editUserFormik.touched.email && editUserFormik.errors.email && (
                <p className="text-red-600 text-sm mt-1">{editUserFormik.errors.email}</p>
              )}
            </div>

            {/* NEW PASSWORD */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-800 mb-1">New Password</label>
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                autoComplete="off"
                onChange={editUserFormik.handleChange}
                onBlur={editUserFormik.handleBlur}
                value={editUserFormik.values.newPassword}
                className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                  editUserFormik.touched.newPassword && editUserFormik.errors.newPassword
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-blue-400'
                }`}
              />
              {editUserFormik.touched.newPassword && editUserFormik.errors.newPassword && (
                <p className="text-red-600 text-sm mt-1">{editUserFormik.errors.newPassword}</p>
              )}
            </div>

            {/* CONFIRM NEW PASSWORD */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-800 mb-1">Confirm New Password</label>
              <input
                type="password"
                name="confirmNewPassword"
                placeholder="Confirm New Password"
                autoComplete="off"
                onChange={editUserFormik.handleChange}
                onBlur={editUserFormik.handleBlur}
                value={editUserFormik.values.confirmNewPassword}
                className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                  editUserFormik.touched.confirmNewPassword && editUserFormik.errors.confirmNewPassword
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-blue-400'
                }`}
              />
              {editUserFormik.touched.confirmNewPassword && editUserFormik.errors.confirmNewPassword && (
                <p className="text-red-600 text-sm mt-1">{editUserFormik.errors.confirmNewPassword}</p>
              )}
            </div>

            {/* CURRENT ROLES */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-800 mb-3">Current Roles</label>
              <div className="flex flex-wrap gap-2">
                {currentRoles.length > 0 ? (
                  currentRoles.map((role, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700"
                    >
                      {role}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No roles assigned</span>
                )}
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 mt-8">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <SubmitButton
                type="submit"
                title="Update User"
                class_name="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                btnLoading={btnLoading}
                callback_event=""
              />
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Add User Form
  return (
    <div className="flex flex-col justify-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-6">Add User</h1>

        <form onSubmit={addUserFormik.handleSubmit}>
          {/* ALERT BOX */}
          {errorMsg && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                isError ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}
            >
              <span>{errorMsg}</span>
            </div>
          )}

          {/* FULL NAME */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-800 mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              autoComplete="off"
              onChange={addUserFormik.handleChange}
              onBlur={addUserFormik.handleBlur}
              value={addUserFormik.values.fullName}
              className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                addUserFormik.touched.fullName && addUserFormik.errors.fullName
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-gray-300 focus:ring-blue-400'
              }`}
            />
            {addUserFormik.touched.fullName && addUserFormik.errors.fullName && (
              <p className="text-red-600 text-sm mt-1">{addUserFormik.errors.fullName}</p>
            )}
          </div>

          {/* EMAIL */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-800 mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              autoComplete="off"
              onChange={addUserFormik.handleChange}
              onBlur={addUserFormik.handleBlur}
              value={addUserFormik.values.email}
              className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                addUserFormik.touched.email && addUserFormik.errors.email
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-gray-300 focus:ring-blue-400'
              }`}
            />
            {addUserFormik.touched.email && addUserFormik.errors.email && (
              <p className="text-red-600 text-sm mt-1">{addUserFormik.errors.email}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-800 mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              autoComplete="off"
              onChange={addUserFormik.handleChange}
              onBlur={addUserFormik.handleBlur}
              value={addUserFormik.values.password}
              className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                addUserFormik.touched.password && addUserFormik.errors.password
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-gray-300 focus:ring-blue-400'
              }`}
            />
            {addUserFormik.touched.password && addUserFormik.errors.password && (
              <p className="text-red-600 text-sm mt-1">{addUserFormik.errors.password}</p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-800 mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              autoComplete="off"
              onChange={addUserFormik.handleChange}
              onBlur={addUserFormik.handleBlur}
              value={addUserFormik.values.confirmPassword}
              className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                addUserFormik.touched.confirmPassword && addUserFormik.errors.confirmPassword
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-gray-300 focus:ring-blue-400'
              }`}
            />
            {addUserFormik.touched.confirmPassword && addUserFormik.errors.confirmPassword && (
              <p className="text-red-600 text-sm mt-1">{addUserFormik.errors.confirmPassword}</p>
            )}
          </div>

          {/* ROLE SELECTION */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-800 mb-3">Role</label>
            <div className="space-y-2">
              {ROLES.map(role => (
                <div key={role} className="flex items-center">
                  <input
                    type="radio"
                    id={`role-${role}`}
                    name="role"
                    value={role}
                    onChange={addUserFormik.handleChange}
                    onBlur={addUserFormik.handleBlur}
                    checked={addUserFormik.values.role === role}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
                  />
                  <label
                    htmlFor={`role-${role}`}
                    className="ml-2 text-sm font-medium text-gray-700 capitalize cursor-pointer"
                  >
                    {role}
                  </label>
                </div>
              ))}
            </div>
            {addUserFormik.touched.role && addUserFormik.errors.role && (
              <p className="text-red-600 text-sm mt-1">{addUserFormik.errors.role}</p>
            )}
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <SubmitButton
              type="submit"
              title="Add User"
              class_name="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              btnLoading={btnLoading}
              callback_event=""
            />
          </div>
        </form>
      </div>
    </div>
  )
}

