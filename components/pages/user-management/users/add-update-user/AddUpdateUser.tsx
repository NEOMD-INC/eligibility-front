'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import ComponentLoader from '@/components/ui/loader/component-loader/ComponentLoader'
import SubmitButton from '@/components/ui/buttons/submit-button/SubmitButton'
import {
  createUser,
  updateUser,
  fetchUserById,
  clearUsersError,
  clearCurrentUser,
} from '@/redux/slices/user-management/users/actions'
import { AppDispatch, RootState } from '@/redux/store'
import { rolesService } from '@/services/user-management/roles/roles.service'
import type { AddUserFormValues, EditUserFormValues } from '@/types'

export default function AddUpdateUser() {
  const router = useRouter()
  const params = useParams()
  const userId = params?.id as string | undefined
  const isEditMode = !!userId
  const dispatch = useDispatch<AppDispatch>()
  const { currentUser, createLoading, updateLoading, fetchUserLoading, error } = useSelector(
    (state: RootState) => state.users
  )

  const [currentRoles, setCurrentRoles] = useState<string[]>([])
  const [availableRoles, setAvailableRoles] = useState<any[]>([])
  const [rolesLoading, setRolesLoading] = useState(false)

  // Fetch available roles from API
  useEffect(() => {
    const fetchRoles = async () => {
      setRolesLoading(true)
      try {
        const response = await rolesService.getAllRoles(1)
        console.log('Roles API Response:', response)
        console.log('Roles API Response Data:', response.data)

        // Handle different response structures
        let rolesData = []
        if (response.data?.data && Array.isArray(response.data.data)) {
          rolesData = response.data.data
        } else if (
          response.data?.data &&
          response.data.data?.data &&
          Array.isArray(response.data.data.data)
        ) {
          rolesData = response.data.data.data
        } else if (Array.isArray(response.data)) {
          rolesData = response.data
        } else if (response.data && typeof response.data === 'object') {
          // If response.data is an object, try to find an array property
          rolesData = Object.values(response.data).find(val => Array.isArray(val)) || []
        }

        console.log('Extracted Roles Data:', rolesData)
        setAvailableRoles(rolesData)
      } catch (error: any) {
        console.error('Error fetching roles:', error)
        console.error('Error response:', error?.response?.data)
        setAvailableRoles([])
      } finally {
        setRolesLoading(false)
      }
    }

    fetchRoles()
  }, [])

  // Fetch user data in edit mode
  useEffect(() => {
    if (isEditMode && userId) {
      dispatch(clearUsersError())
      dispatch(clearCurrentUser())
      dispatch(fetchUserById(userId))
    }

    return () => {
      if (isEditMode) {
        dispatch(clearCurrentUser())
      }
    }
  }, [dispatch, isEditMode, userId])

  // Extract current roles when user data is loaded
  // NOTE: Password fields are NEVER populated from API data - they always remain empty
  // Users can manually enter a new password if they want to change it
  useEffect(() => {
    if (isEditMode && currentUser) {
      // Extract current roles (but NEVER password data)
      if (currentUser.roles && Array.isArray(currentUser.roles)) {
        const roleNames = currentUser.roles.map((role: any) =>
          typeof role === 'string' ? role : role?.name || ''
        )
        setCurrentRoles(roleNames)
      } else if (currentUser.role) {
        const roleName =
          typeof currentUser.role === 'string' ? currentUser.role : currentUser.role?.name || ''
        setCurrentRoles([roleName])
      }

      // Explicitly ensure password fields are ALWAYS empty (prevent any accidental population)
      // This runs after formik initializes, ensuring passwords stay empty
      editUserFormik.setFieldValue('newPassword', '', false)
      editUserFormik.setFieldValue('confirmNewPassword', '', false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, isEditMode])

  // Add User Validation Schema
  const addUserValidationSchema = Yup.object({
    fullName: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
    role: Yup.string()
      .required('Role selection is required')
      .test('valid-role', 'Please select a valid role', function (value) {
        if (!value) return false
        // Check if the selected role ID exists in available roles
        return availableRoles.some(role => String(role.id) === String(value) || role.name === value)
      }),
  })

  // Edit User Validation Schema - password is optional for edit
  const editUserValidationSchema = Yup.object({
    fullName: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    newPassword: Yup.string().test(
      'optional-password',
      'Password must be at least 6 characters',
      function (value) {
        // Only validate if a value is provided (password is optional)
        if (!value || value.trim().length === 0) return true
        return value.length >= 6
      }
    ),
    confirmNewPassword: Yup.string().when('newPassword', {
      is: (value: string) => value && value.trim().length > 0,
      then: schema =>
        schema
          .required('Confirm password is required when password is provided')
          .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
      otherwise: schema => schema,
    }),
  })

  // Add User Formik
  const addUserFormik = useFormik<AddUserFormValues>({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
    },
    validationSchema: addUserValidationSchema,
    onSubmit: async values => {
      dispatch(clearUsersError())
      try {
        // Map form data to API format
        const userData: any = {
          name: values.fullName,
          email: values.email,
          password: values.password,
          password_confirmation: values.confirmPassword,
        }

        // Add roles if role is selected (use the role ID from the selected role)
        if (values.role) {
          const selectedRole = availableRoles.find(
            role => String(role.id) === String(values.role) || role.name === values.role
          )
          if (selectedRole) {
            userData.roles = [selectedRole.id]
          }
        }

        const result = await dispatch(createUser(userData))

        if (createUser.fulfilled.match(result)) {
          router.push('/user-management/users')
        } else {
          // Error is handled by Redux state
        }
      } catch (err: any) {
        // Error is handled by Redux state
      }
    },
  })

  // Edit User Formik
  // NOTE: We use enableReinitialize for name/email but explicitly keep passwords empty
  const editUserFormik = useFormik<EditUserFormValues>({
    initialValues: {
      fullName: currentUser?.name || currentUser?.full_name || '',
      email: currentUser?.email || '',
      // Password fields should ALWAYS be empty - never populate from API data
      newPassword: '',
      confirmNewPassword: '',
    },
    enableReinitialize: true,
    validationSchema: editUserValidationSchema,
    onSubmit: async values => {
      if (!userId) return

      dispatch(clearUsersError())
      try {
        // Map form data to API format
        const userData: any = {
          name: values.fullName,
          email: values.email,
        }

        // Only include password if actually provided (not empty or whitespace)
        if (values.newPassword && values.newPassword.trim().length > 0) {
          userData.password = values.newPassword.trim()
          userData.password_confirmation = values.confirmNewPassword?.trim() || ''
        }

        // Preserve existing roles (or you can allow role updates here)
        if (currentUser?.roles) {
          userData.roles = [currentUser.roles[0].id]
        }

        const result = await dispatch(updateUser({ userId, userData }))

        if (updateUser.fulfilled.match(result)) {
          router.push('/user-management/users')
        } else {
        }
      } catch (err: any) {}
    },
  })

  if (isEditMode) {
    if (fetchUserLoading || !currentUser) {
      return <ComponentLoader component="user" message="Loading user data..." />
    }

    return (
      <div className="flex flex-col justify-center bg-gray-100 p-6">
        <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8">
          <h1 className="text-2xl font-bold mb-6">Edit User</h1>

          <form onSubmit={editUserFormik.handleSubmit}>
            {/* ALERT BOX */}
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-700">
                <span>{error}</span>
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

            {/* NEW PASSWORD (Optional) */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                New Password{' '}
                <span className="text-gray-500 text-xs">
                  (Leave blank to keep current password)
                </span>
              </label>
              <input
                type="password"
                name="newPassword"
                placeholder="New Password (Optional)"
                autoComplete="new-password"
                onChange={editUserFormik.handleChange}
                onBlur={editUserFormik.handleBlur}
                value={editUserFormik.values.newPassword || ''}
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

            {/* CONFIRM NEW PASSWORD (Optional) */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Confirm New Password{' '}
                <span className="text-gray-500 text-xs">(Required if password is provided)</span>
              </label>
              <input
                type="password"
                name="confirmNewPassword"
                placeholder="Confirm New Password"
                autoComplete="new-password"
                onChange={editUserFormik.handleChange}
                onBlur={editUserFormik.handleBlur}
                value={editUserFormik.values.confirmNewPassword || ''}
                className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                  editUserFormik.touched.confirmNewPassword &&
                  editUserFormik.errors.confirmNewPassword
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-blue-400'
                }`}
              />
              {editUserFormik.touched.confirmNewPassword &&
                editUserFormik.errors.confirmNewPassword && (
                  <p className="text-red-600 text-sm mt-1">
                    {editUserFormik.errors.confirmNewPassword}
                  </p>
                )}
            </div>

            {/* CURRENT ROLES - At the bottom before buttons */}
            <div className="mb-6 pt-4 border-t border-gray-200">
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Current Roles
              </label>
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
                btnLoading={updateLoading}
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
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-700">
              <span>{error}</span>
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
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Confirm Password
            </label>
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
            {rolesLoading ? (
              <ComponentLoader message="Loading roles..." size="sm" variant="inline" />
            ) : availableRoles.length === 0 ? (
              <div className="text-red-500 text-sm">No roles available</div>
            ) : (
              <div className="space-y-2">
                {availableRoles.map(role => (
                  <div key={role.id} className="flex items-center">
                    <input
                      type="radio"
                      id={`role-${role.id}`}
                      name="role"
                      value={role.id}
                      onChange={addUserFormik.handleChange}
                      onBlur={addUserFormik.handleBlur}
                      checked={String(addUserFormik.values.role) === String(role.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
                    />
                    <label
                      htmlFor={`role-${role.id}`}
                      className="ml-2 text-sm font-medium text-gray-700 capitalize cursor-pointer"
                    >
                      {role.name || role.title || `Role ${role.id}`}
                    </label>
                  </div>
                ))}
              </div>
            )}
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
              btnLoading={createLoading}
              callback_event=""
            />
          </div>
        </form>
      </div>
    </div>
  )
}
