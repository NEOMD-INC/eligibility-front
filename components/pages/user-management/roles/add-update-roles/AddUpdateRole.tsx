'use client'
import { useFormik } from 'formik'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'

import { PageTransition } from '@/components/providers/page-transition-provider/PageTransitionProvider'
import SubmitButton from '@/components/ui/buttons/submit-button/SubmitButton'
import ComponentLoader from '@/components/ui/loader/component-loader/ComponentLoader'
import { fetchAllPermissions } from '@/redux/slices/user-management/permissions/actions'
import {
  clearCurrentRole,
  clearRolesError,
  createRole,
  fetchRoleById,
  updateRole,
} from '@/redux/slices/user-management/roles/actions'
import { AppDispatch, RootState } from '@/redux/store'
import { themeColors } from '@/theme'
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

  const PERMISSIONS_GROUPED = (() => {
    if (!allPermissions || allPermissions.length === 0) {
      return []
    }

    const normalizedPermissions = allPermissions
      .map((perm: any) => {
        if (perm && typeof perm === 'object') {
          return {
            id: perm.id || perm.uuid || String(perm.id),
            name: perm.name || perm.permission_name || perm.permission || String(perm),
          }
        }
        return null
      })
      .filter((perm: any) => perm && perm.id && perm.name)

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

  const validationSchema = Yup.object({
    roleName: Yup.string().required('Role name is required'),
    permissions: Yup.array()
      .min(1, 'At least one permission must be selected')
      .required('Permissions are required'),
  })

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
            setErrorMsg((result.payload as string) || 'An error occurred while updating the role.')
          }
        } else {
          const result = await dispatch(createRole(roleData))
          if (createRole.fulfilled.match(result)) {
            router.push('/user-management/roles')
          } else {
            setIsError(true)
            setErrorMsg((result.payload as string) || 'An error occurred while creating the role.')
          }
        }
      } catch (err: any) {
        setIsError(true)
        setErrorMsg(
          err.message || `An error occurred while ${isEditMode ? 'updating' : 'creating'} the role.`
        )
      }
    },
  })

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

  useEffect(() => {
    if (isEditMode && currentRole && allPermissions.length > 0) {
      const roleName = currentRole.name || ''

      const permissions = currentRole.permissions || []
      const permissionIds: string[] = []

      permissions.forEach((perm: any) => {
        const permName =
          typeof perm === 'string'
            ? perm
            : perm?.name || perm?.permission_name || perm?.permission || String(perm)

        if (permName) {
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
  }, [currentRole, isEditMode, allPermissions])

  useEffect(() => {
    dispatch(fetchAllPermissions({ page: 1 }))
  }, [dispatch])

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
    <PageTransition>
      <div
        className="flex flex-col justify-center p-6"
        style={{ backgroundColor: themeColors.gray[100] }}
      >
        <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8">
          <h1 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Role' : 'Add Role'}</h1>

          <form onSubmit={formik.handleSubmit}>
            {errorMsg && (
              <div
                className="mb-6 p-4 rounded-lg"
                style={{
                  backgroundColor: isError ? themeColors.red[100] : themeColors.blue[100],
                  color: isError ? themeColors.red[700] : themeColors.blue[700],
                }}
              >
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="mb-6">
              <label
                className="block text-sm font-semibold mb-1"
                style={{ color: themeColors.text.secondary }}
              >
                Role Name
              </label>
              <input
                type="text"
                name="roleName"
                placeholder="Role Name"
                autoComplete="off"
                onChange={formik.handleChange}
                value={formik.values.roleName}
                className="w-full px-4 py-2 rounded-md border bg-white focus:outline-none focus:ring-2"
                style={{
                  color: themeColors.text.primary,
                  borderColor:
                    formik.touched.roleName && formik.errors.roleName
                      ? themeColors.border.error
                      : themeColors.border.default,
                }}
                onFocus={e => {
                  e.currentTarget.style.boxShadow = `0 0 0 2px ${formik.touched.roleName && formik.errors.roleName ? themeColors.border.focusRing.red : themeColors.border.focusRing.blue}`
                }}
                onBlur={e => {
                  e.currentTarget.style.boxShadow = ''
                  formik.handleBlur(e)
                }}
              />
              {formik.touched.roleName && formik.errors.roleName && (
                <p className="text-sm mt-1" style={{ color: themeColors.text.error }}>
                  {formik.errors.roleName}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label
                className="block text-sm font-semibold mb-3"
                style={{ color: themeColors.text.secondary }}
              >
                Permissions
              </label>
              {permissionsLoading ? (
                <div className="text-center py-4">
                  <ComponentLoader message="Loading permissions..." size="sm" variant="inline" />
                </div>
              ) : PERMISSIONS_GROUPED.length === 0 ? (
                <div className="text-center py-4">
                  <p style={{ color: themeColors.text.muted }}>No permissions available</p>
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
                        className={`border rounded-lg p-4 ${gridClass}`}
                        style={{ borderColor: themeColors.border.default }}
                      >
                        <h3
                          className="text-base font-semibold mb-3 capitalize"
                          style={{ color: themeColors.text.primary }}
                        >
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
                                  onChange={e =>
                                    handlePermissionChange(permissionId, e.target.checked)
                                  }
                                  className="w-4 h-4 border rounded focus:ring-2"
                                  style={{
                                    color: themeColors.blue[600],
                                    borderColor: themeColors.border.default,
                                  }}
                                  onFocus={e => {
                                    e.currentTarget.style.boxShadow = `0 0 0 2px ${themeColors.blue[400]}`
                                  }}
                                  onBlur={e => {
                                    e.currentTarget.style.boxShadow = ''
                                  }}
                                />
                                <label
                                  htmlFor={`permission-${groupIndex}-${permIndex}`}
                                  className="ml-2 text-sm font-medium cursor-pointer"
                                  style={{ color: themeColors.gray[700] }}
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
                <p className="text-sm mt-1" style={{ color: themeColors.text.error }}>
                  {formik.errors.permissions}
                </p>
              )}
            </div>

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
                title={isEditMode ? 'Update Role' : 'Add Role'}
                class_name="px-6 py-2 text-white rounded-md transition"
                style={{ backgroundColor: themeColors.blue[600] }}
                onMouseEnter={e => {
                  const btn = e.currentTarget as HTMLButtonElement
                  if (!btn.disabled) btn.style.backgroundColor = themeColors.blue[700]
                }}
                onMouseLeave={e => {
                  const btn = e.currentTarget as HTMLButtonElement
                  if (!btn.disabled) btn.style.backgroundColor = themeColors.blue[600]
                }}
                btnLoading={isEditMode ? updateLoading || fetchRoleLoading : createLoading}
                callback_event=""
              />
            </div>
          </form>
        </div>
      </div>
    </PageTransition>
  )
}
