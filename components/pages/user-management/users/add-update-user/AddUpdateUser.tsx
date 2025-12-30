'use client'
import { useFormik } from 'formik'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'

import { PageTransition } from '@/components/providers/page-transition-provider/PageTransitionProvider'
import SubmitButton from '@/components/ui/buttons/submit-button/SubmitButton'
import ComponentLoader from '@/components/ui/loader/component-loader/ComponentLoader'
import {
  clearCurrentUser,
  clearUsersError,
  createUser,
  fetchUserById,
  updateUser,
} from '@/redux/slices/user-management/users/actions'
import { AppDispatch, RootState } from '@/redux/store'
import { rolesService } from '@/services/user-management/roles/roles.service'
import { themeColors } from '@/theme'

import { UserFormValues } from './types/types'

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

  const formik = useFormik<UserFormValues>({
    initialValues: {
      fullName: isEditMode && currentUser ? currentUser.name || currentUser.full_name || '' : '',
      email: isEditMode && currentUser ? currentUser.email || '' : '',
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
          if (values.newPassword && values.newPassword.trim().length > 0) {
            userData.password = values.newPassword.trim()
            userData.password_confirmation = values.confirmNewPassword?.trim() || ''
          }
          if (
            currentUser?.roles &&
            Array.isArray(currentUser.roles) &&
            currentUser.roles.length > 0
          ) {
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
          userData.password = values.password
          userData.password_confirmation = values.confirmPassword
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
        console.log(err)
      }
    },
  })

  useEffect(() => {
    if (isEditMode) {
      formik.setFieldValue('newPassword', '', false)
      formik.setFieldValue('confirmNewPassword', '', false)
    }
  }, [isEditMode, currentUser])

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
        <label
          className="block text-sm font-semibold mb-1"
          style={{ color: themeColors.text.secondary }}
        >
          {label}{' '}
          {extraLabel && (
            <span className="text-xs" style={{ color: themeColors.text.muted }}>
              {extraLabel}
            </span>
          )}
        </label>
        <input
          type={type}
          name={name}
          placeholder={placeholder || label}
          autoComplete={type === 'password' ? 'new-password' : 'off'}
          onChange={formik.handleChange}
          value={value || ''}
          className="w-full px-4 py-2 rounded-md border bg-white focus:outline-none focus:ring-2"
          style={{
            color: themeColors.text.primary,
            borderColor: hasError ? themeColors.border.error : themeColors.border.default,
          }}
          onFocus={e => {
            e.currentTarget.style.boxShadow = `0 0 0 2px ${hasError ? themeColors.border.focusRing.red : themeColors.border.focusRing.blue}`
          }}
          onBlur={e => {
            e.currentTarget.style.boxShadow = ''
            formik.handleBlur(e)
          }}
        />
        {hasError && (
          <p className="text-sm mt-1" style={{ color: themeColors.text.error }}>
            {error}
          </p>
        )}
      </div>
    )
  }

  if (isEditMode && (fetchUserLoading || !currentUser)) {
    return <ComponentLoader component="user" message="Loading user data..." />
  }

  return (
    <PageTransition>
      <div
        className="flex flex-col justify-center p-6"
        style={{ backgroundColor: themeColors.gray[100] }}
      >
        <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8">
          <h1 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit User' : 'Add User'}</h1>

          <form onSubmit={formik.handleSubmit}>
            {error && (
              <div
                className="mb-6 p-4 rounded-lg"
                style={{ backgroundColor: themeColors.red[100], color: themeColors.red[700] }}
              >
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
              <div
                className="mb-6 pt-4 border-t"
                style={{ borderColor: themeColors.border.default }}
              >
                <label
                  className="block text-sm font-semibold mb-3"
                  style={{ color: themeColors.text.secondary }}
                >
                  Current Roles
                </label>
                <div className="flex flex-wrap gap-2">
                  {currentRoles.length > 0 ? (
                    currentRoles.map((role, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: themeColors.green[100],
                          color: themeColors.green[600],
                        }}
                      >
                        {role}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm" style={{ color: themeColors.text.muted }}>
                      No roles assigned
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <label
                  className="block text-sm font-semibold mb-3"
                  style={{ color: themeColors.text.secondary }}
                >
                  Role
                </label>
                {rolesLoading ? (
                  <ComponentLoader message="Loading roles..." size="sm" variant="inline" />
                ) : availableRoles.length === 0 ? (
                  <div className="text-sm" style={{ color: themeColors.red[500] }}>
                    No roles available
                  </div>
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
                          checked={String(formik.values.role) === String(role.id)}
                          className="w-4 h-4 border focus:ring-2"
                          style={{
                            color: themeColors.blue[600],
                            borderColor: themeColors.border.default,
                          }}
                          onFocus={e => {
                            e.currentTarget.style.boxShadow = `0 0 0 2px ${themeColors.blue[400]}`
                          }}
                          onBlur={e => {
                            e.currentTarget.style.boxShadow = ''
                            formik.handleBlur(e)
                          }}
                        />
                        <label
                          htmlFor={`role-${role.id}`}
                          className="ml-2 text-sm font-medium capitalize cursor-pointer"
                          style={{ color: themeColors.gray[700] }}
                        >
                          {role.name || role.title || `Role ${role.id}`}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
                {formik.touched.role && formik.errors.role && (
                  <p className="text-sm mt-1" style={{ color: themeColors.text.error }}>
                    {formik.errors.role}
                  </p>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-8">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border rounded-md transition"
                style={{
                  borderColor: themeColors.border.default,
                  color: themeColors.gray[700],
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = themeColors.gray[50])}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
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
