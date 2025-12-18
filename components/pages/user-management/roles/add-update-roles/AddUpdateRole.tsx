'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import ComponentLoader from '@/components/ui/loader/component-loader/ComponentLoader'
import SubmitButton from '@/components/ui/buttons/submit-button/SubmitButton'
import {
  createRole,
  updateRole,
  fetchRoleById,
  clearRolesError,
  clearCurrentRole,
} from '@/redux/slices/user-management/roles/actions'
import { fetchAllPermissions } from '@/redux/slices/user-management/permissions/actions'
import { AppDispatch, RootState } from '@/redux/store'
import type { RoleFormValues } from '@/types'

export default function AddUpdateRole() {
  const router = useRouter()
  const params = useParams()
  const roleId = params?.id as string | undefined
  const isEditMode = !!roleId
  const dispatch = useDispatch<AppDispatch>()
  const { currentRole, createLoading, updateLoading, fetchRoleLoading, error } = useSelector(
    (state: RootState) => state.roles
  )
  const { permissions: allPermissions, loading: permissionsLoading } = useSelector(
    (state: RootState) => state.permissions
  )

  const [isError, setIsError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Group permissions by prefix (e.g., "view_", "create_", etc.)
  // Store permission objects with id and name
  const PERMISSIONS_GROUPED = (() => {
    if (!allPermissions || allPermissions.length === 0) {
      return []
    }

    // Normalize permissions to objects with id and name
    const normalizedPermissions = allPermissions
      .map((perm: any) => {
        if (perm && typeof perm === 'object') {
          return {
            id: perm.id || perm.uuid || String(perm.id),
            name: perm.name || perm.permission_name || perm.permission || String(perm),
          }
        }
        // If it's a string, we can't get the ID, so skip it
        return null
      })
      .filter((perm: any) => perm && perm.id && perm.name)

    // Group by prefix
    return normalizedPermissions.reduce((acc: any[], perm: any) => {
      if (!perm || !perm.name) return acc

      const prefix = perm.name.split('_')[0] || 'other'
      const existingGroup = acc.find(g => g.title === prefix)
      if (existingGroup) {
        existingGroup.permissions.push(perm)
      } else {
        acc.push({
          title: prefix,
          permissions: [perm],
        })
      }
      return acc
    }, [])
  })()

  // Unified validation schema
  const validationSchema = Yup.object({
    roleName: Yup.string().required('Role name is required'),
    permissions: Yup.array()
      .min(1, 'At least one permission must be selected')
      .required('Permissions are required'),
  })

  // Unified Formik instance
  const formik = useFormik<RoleFormValues>({
    initialValues: {
      roleName: '',
      permissions: [],
    },
    enableReinitialize: isEditMode,
    validationSchema,
    onSubmit: async values => {
      dispatch(clearRolesError())
      setIsError(false)
      setErrorMsg('')

      try {
        const roleData = {
          name: values.roleName,
          permissions: values.permissions,
        }

        if (isEditMode) {
          if (!roleId) return
          const result = await dispatch(updateRole({ roleId, roleData }))
          if (updateRole.fulfilled.match(result)) {
            router.push('/user-management/roles')
          } else {
            setIsError(true)
            setErrorMsg(
              (result.payload as string) || 'An error occurred while updating the role.'
            )
          }
        } else {
          const result = await dispatch(createRole(roleData))
          if (createRole.fulfilled.match(result)) {
            router.push('/user-management/roles')
          } else {
            setIsError(true)
            setErrorMsg(
              (result.payload as string) || 'An error occurred while creating the role.'
            )
          }
        }
      } catch (err: any) {
        setIsError(true)
        setErrorMsg(err.message || `An error occurred while ${isEditMode ? 'updating' : 'creating'} the role.`)
      }
    },
  })

  // Fetch role data in edit mode
  useEffect(() => {
    if (isEditMode && roleId) {
      dispatch(clearRolesError())
      dispatch(clearCurrentRole())
      dispatch(fetchRoleById(roleId))
    }

    return () => {
      if (isEditMode) {
        dispatch(clearCurrentRole())
      }
    }
  }, [dispatch, isEditMode, roleId])

  // Populate form with role data when it's loaded
  useEffect(() => {
    if (isEditMode && currentRole && allPermissions.length > 0) {
      // Extract role name
      const roleName = currentRole.name || ''

      // Extract permissions - map permission names to IDs
      const permissions = currentRole.permissions || []
      const permissionIds: string[] = []

      permissions.forEach((perm: any) => {
        // Get permission name
        const permName =
          typeof perm === 'string'
            ? perm
            : perm?.name || perm?.permission_name || perm?.permission || String(perm)

        if (permName) {
          // Find the permission in allPermissions by name and get its ID
          const foundPerm = allPermissions.find((p: any) => {
            const pName = p.name || p.permission_name || p.permission
            return pName === permName
          })

          if (foundPerm && foundPerm.id) {
            permissionIds.push(foundPerm.id || foundPerm.uuid)
          }
        }
      })

      formik.setValues({
        roleName,
        permissions: permissionIds,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRole, isEditMode, allPermissions])

  // Fetch permissions on component mount
  useEffect(() => {
    // Fetch all permissions (use a large page size to get all permissions)
    dispatch(fetchAllPermissions({ page: 1 }))
  }, [dispatch])

  // Update error message from Redux state
  useEffect(() => {
    if (error) {
      setIsError(true)
      setErrorMsg(error)
    }
  }, [error])

  const handlePermissionChange = (permissionId: string, isChecked: boolean) => {
    const currentPermissions = [...formik.values.permissions]

    if (isChecked) {
      if (!currentPermissions.includes(permissionId)) {
        formik.setFieldValue('permissions', [...currentPermissions, permissionId])
      }
    } else {
      formik.setFieldValue(
        'permissions',
        currentPermissions.filter(p => p !== permissionId)
      )
    }
  }

  if (isEditMode && fetchRoleLoading) {
    return <ComponentLoader component="role" message="Loading role data..." />
  }

  return (
    <div className="flex flex-col justify-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Role' : 'Add Role'}</h1>

        <form onSubmit={formik.handleSubmit}>
          {errorMsg && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                isError ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}
            >
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-800 mb-1">Role Name</label>
            <input
              type="text"
              name="roleName"
              placeholder="Role Name"
              autoComplete="off"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.roleName}
              className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                formik.touched.roleName && formik.errors.roleName
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-gray-300 focus:ring-blue-400'
              }`}
            />
            {formik.touched.roleName && formik.errors.roleName && (
              <p className="text-red-600 text-sm mt-1">{formik.errors.roleName}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-800 mb-3">Permissions</label>
            {permissionsLoading ? (
              <div className="text-center py-4">
                <ComponentLoader message="Loading permissions..." size="sm" variant="inline" />
              </div>
            ) : PERMISSIONS_GROUPED.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500">No permissions available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {PERMISSIONS_GROUPED.map((group, groupIndex) => {
                  const permissionCount = group.permissions.length
                  const gridClass =
                    permissionCount <= 3
                      ? 'md:col-span-1'
                      : permissionCount <= 5
                        ? 'md:col-span-2'
                        : 'md:col-span-2 lg:col-span-3'
                  return (
                    <div
                      key={groupIndex}
                      className={`border border-gray-200 rounded-lg p-4 ${gridClass}`}
                    >
                      <h3 className="text-base font-semibold text-gray-900 mb-3 capitalize">
                        {group.title}
                      </h3>
                      <div
                        className={
                          permissionCount <= 3
                            ? 'grid grid-cols-1 gap-2'
                            : 'grid grid-cols-2 gap-2'
                        }
                      >
                        {group.permissions.map((permission: any, permIndex: number) => {
                          const permissionId = permission.id || permission.uuid
                          const permissionName = permission.name
                          const isChecked = formik.values.permissions.includes(permissionId)
                          return (
                            <div key={permIndex} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`permission-${groupIndex}-${permIndex}`}
                                checked={isChecked}
                                onChange={e => handlePermissionChange(permissionId, e.target.checked)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                              />
                              <label
                                htmlFor={`permission-${groupIndex}-${permIndex}`}
                                className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
                              >
                                {permissionName}
                              </label>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
            {formik.touched.permissions && formik.errors.permissions && (
              <p className="text-red-600 text-sm mt-1">{formik.errors.permissions}</p>
            )}
          </div>

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
              title={isEditMode ? 'Update Role' : 'Add Role'}
              class_name="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              btnLoading={isEditMode ? updateLoading || fetchRoleLoading : createLoading}
              callback_event=""
            />
          </div>
        </form>
      </div>
    </div>
  )
}
