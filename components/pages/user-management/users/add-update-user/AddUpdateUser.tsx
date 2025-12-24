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
import { PageTransition } from '@/components/providers/page-transition-provider/PageTransitionProvider'

type UserFormValues = {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  newPassword: string
  confirmNewPassword: string
  role: string
}

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
          rolesData = Object.values(response.data).find(val => Array.isArray(val)) || []
        }
        setAvailableRoles(rolesData)
      } catch (error: any) {
        console.error('Error fetching roles:', error)
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
  useEffect(() => {
    if (isEditMode && currentUser) {
      if (currentUser.roles && Array.isArray(currentUser.roles) && currentUser.roles.length > 0) {
        const roleNames = currentUser.roles
          .map((role: any) => (typeof role === 'string' ? role : role?.name || ''))
          .filter((name: string) => name !== '')
        setCurrentRoles(roleNames)
      } else if (currentUser.role) {
        const roleName =
          typeof currentUser.role === 'string' ? currentUser.role : currentUser.role?.name || ''
        if (roleName) {
          setCurrentRoles([roleName])
        } else {
          setCurrentRoles([])
        }
      } else {
        setCurrentRoles([])
      }
    }
  }, [currentUser, isEditMode])

  // Unified validation schema
  const validationSchema = Yup.object({
    fullName: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    ...(isEditMode
      ? {
          newPassword: Yup.string().test(
            'optional-password',
            'Password must be at least 6 characters',
            function (value) {
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
        }
      : {
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
              return availableRoles.some(
                role => String(role.id) === String(value) || role.name === value
              )
            }),
        }),
  })

  // Unified Formik instance
  const formik = useFormik<UserFormValues>({
    initialValues: {
      fullName: (isEditMode && currentUser) ? (currentUser.name || currentUser.full_name || '') : '',
      email: (isEditMode && currentUser) ? (currentUser.email || '') : '',
      password: '',
      confirmPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      role: '',
    },
    enableReinitialize: isEditMode,
    validationSchema,
    onSubmit: async values => {
      dispatch(clearUsersError())
      try {
        const userData: any = {
          name: values.fullName,
          email: values.email,
        }

        if (isEditMode) {
          if (!userId) return
          // Only include password if provided
          if (values.newPassword && values.newPassword.trim().length > 0) {
            userData.password = values.newPassword.trim()
            userData.password_confirmation = values.confirmNewPassword?.trim() || ''
          }
          // Preserve existing roles
          if (currentUser?.roles && Array.isArray(currentUser.roles) && currentUser.roles.length > 0) {
            const firstRole = currentUser.roles[0]
            if (firstRole && (firstRole.id || firstRole)) {
              userData.roles = [firstRole.id || firstRole]
            }
          }
          const result = await dispatch(updateUser({ userId, userData }))
          if (updateUser.fulfilled.match(result)) {
            router.push('/user-management/users')
          }
        } else {
          // Add mode - password is required
          userData.password = values.password
          userData.password_confirmation = values.confirmPassword
          // Add role if selected
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
          }
        }
      } catch (err: any) {
        // Error is handled by Redux state
      }
    },
  })

  // Ensure password fields stay empty in edit mode
  useEffect(() => {
    if (isEditMode) {
      formik.setFieldValue('newPassword', '', false)
      formik.setFieldValue('confirmNewPassword', '', false)
    }
  }, [isEditMode, currentUser])

  // Render field component to reduce duplication
  const renderField = (
    name: keyof UserFormValues,
    label: string,
    type: string = 'text',
    placeholder?: string,
    extraLabel?: string
  ) => {
    const value = formik.values[name]
    const touched = formik.touched[name]
    const error = formik.errors[name]
    const hasError = touched && error

    return (
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-800 mb-1">
          {label} {extraLabel && <span className="text-gray-500 text-xs">{extraLabel}</span>}
        </label>
        <input
          type={type}
          name={name}
          placeholder={placeholder || label}
          autoComplete={type === 'password' ? 'new-password' : 'off'}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={value || ''}
          className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
            hasError ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'
          }`}
        />
        {hasError && <p className="text-red-600 text-sm mt-1">{error}</p>}
      </div>
    )
  }

  if (isEditMode && (fetchUserLoading || !currentUser)) {
    return <ComponentLoader component="user" message="Loading user data..." />
  }

  return (
    <PageTransition>
      <div className="flex flex-col justify-center bg-gray-100 p-6">
        <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8">
          <h1 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit User' : 'Add User'}</h1>

          <form onSubmit={formik.handleSubmit}>
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-700">
                <span>{error}</span>
              </div>
            )}

            {renderField('fullName', 'Full Name')}
            {renderField('email', 'Email', 'email')}

            {isEditMode ? (
              <>
                {renderField(
                  'newPassword',
                  'New Password',
                  'password',
                  'New Password (Optional)',
                  '(Leave blank to keep current password)'
                )}
                {renderField(
                  'confirmNewPassword',
                  'Confirm New Password',
                  'password',
                  'Confirm New Password',
                  '(Required if password is provided)'
                )}
              </>
            ) : (
              <>
                {renderField('password', 'Password', 'password')}
                {renderField('confirmPassword', 'Confirm Password', 'password')}
              </>
            )}

            {isEditMode ? (
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
            ) : (
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
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          checked={String(formik.values.role) === String(role.id)}
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
                {formik.touched.role && formik.errors.role && (
                  <p className="text-red-600 text-sm mt-1">{formik.errors.role}</p>
                )}
              </div>
            )}

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
                title={isEditMode ? 'Update User' : 'Add User'}
                class_name="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                btnLoading={isEditMode ? updateLoading : createLoading}
                callback_event=""
              />
            </div>
          </form>
        </div>
      </div>
    </PageTransition>
  )
}
