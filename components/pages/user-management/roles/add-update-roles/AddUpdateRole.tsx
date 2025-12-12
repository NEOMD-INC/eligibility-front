'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import SubmitButton from '@/components/ui/buttons/submit-button/SubmitButton'

interface AddRoleValues {
  roleName: string
  permissions: string[]
}

interface EditRoleValues {
  roleName: string
  permissions: string[]
}

const PERMISSIONS_GROUPED = [
  {
    title: 'view',
    permissions: ['view role', 'view users'],
  },
  {
    title: 'create',
    permissions: ['create role'],
  },
  {
    title: 'edit',
    permissions: ['edit role', 'edit users', 'edit permissions'],
  },
  {
    title: 'delete',
    permissions: ['delete role', 'delete users', 'delete permissions'],
  },
  {
    title: 'import',
    permissions: ['import role'],
  },
  {
    title: 'retry',
    permissions: ['retry submission'],
  },
]

export default function AddUpdateRole() {
  const router = useRouter()
  const params = useParams()
  const roleId = params?.id as string | undefined
  const isEditMode = !!roleId

  const [btnLoading, setBtnLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Add Role Validation Schema
  const addRoleValidationSchema = Yup.object({
    roleName: Yup.string().required('Role name is required'),
    permissions: Yup.array()
      .min(1, 'At least one permission must be selected')
      .required('Permissions are required'),
  })

  // Edit Role Validation Schema
  const editRoleValidationSchema = Yup.object({
    roleName: Yup.string().required('Role name is required'),
    permissions: Yup.array()
      .min(1, 'At least one permission must be selected')
      .required('Permissions are required'),
  })

  // Add Role Formik
  const addRoleFormik = useFormik<AddRoleValues>({
    initialValues: {
      roleName: '',
      permissions: [],
    },
    validationSchema: addRoleValidationSchema,
    onSubmit: async values => {
      setBtnLoading(true)
      setIsError(false)
      try {
        console.log('Add Role Values:', values)
        // TODO: Add API call to create role
        // await createRole(values)
        setTimeout(() => {
          setBtnLoading(false)
          router.push('/user-management/roles')
        }, 1000)
      } catch (err: any) {
        setBtnLoading(false)
        setIsError(true)
        setErrorMsg(err.message || 'An error occurred while creating the role.')
      }
    },
  })

  // Edit Role Formik
  const editRoleFormik = useFormik<EditRoleValues>({
    initialValues: {
      roleName: '',
      permissions: [],
    },
    validationSchema: editRoleValidationSchema,
    onSubmit: async values => {
      setBtnLoading(true)
      setIsError(false)
      try {
        console.log('Edit Role Values:', values)
        // TODO: Add API call to update role
        // await updateRole(roleId, values)
        setTimeout(() => {
          setBtnLoading(false)
          router.push('/user-management/roles')
        }, 1000)
      } catch (err: any) {
        setBtnLoading(false)
        setIsError(true)
        setErrorMsg(err.message || 'An error occurred while updating the role.')
      }
    },
  })

  // Load role data in edit mode
  useEffect(() => {
    if (isEditMode && roleId) {
      const loadRoleData = async () => {
        try {
          editRoleFormik.setValues({
            roleName: 'admin',
            permissions: ['view role', 'view users', 'edit role', 'edit users'],
          })
        } catch (error) {
          console.error('Error loading role data:', error)
        }
      }
      loadRoleData()
    }
  }, [isEditMode, roleId])

  const handleAddPermissionChange = (permission: string, isChecked: boolean) => {
    const currentPermissions = [...addRoleFormik.values.permissions]

    if (isChecked) {
      if (!currentPermissions.includes(permission)) {
        addRoleFormik.setFieldValue('permissions', [...currentPermissions, permission])
      }
    } else {
      addRoleFormik.setFieldValue(
        'permissions',
        currentPermissions.filter(p => p !== permission)
      )
    }
  }

  const handleEditPermissionChange = (permission: string, isChecked: boolean) => {
    const currentPermissions = [...editRoleFormik.values.permissions]

    if (isChecked) {
      if (!currentPermissions.includes(permission)) {
        editRoleFormik.setFieldValue('permissions', [...currentPermissions, permission])
      }
    } else {
      editRoleFormik.setFieldValue(
        'permissions',
        currentPermissions.filter(p => p !== permission)
      )
    }
  }

  if (isEditMode) {
    return (
      <div className="flex flex-col justify-center bg-gray-100 p-6">
        <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8">
          <h1 className="text-2xl font-bold mb-6">Edit Role</h1>

          <form onSubmit={editRoleFormik.handleSubmit}>
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
                onChange={editRoleFormik.handleChange}
                onBlur={editRoleFormik.handleBlur}
                value={editRoleFormik.values.roleName}
                className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                  editRoleFormik.touched.roleName && editRoleFormik.errors.roleName
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-blue-400'
                }`}
              />
              {editRoleFormik.touched.roleName && editRoleFormik.errors.roleName && (
                <p className="text-red-600 text-sm mt-1">{editRoleFormik.errors.roleName}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-800 mb-3">Permissions</label>
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
                        {group.permissions.map((permission, permIndex) => {
                          const isChecked = editRoleFormik.values.permissions.includes(permission)
                          return (
                            <div key={permIndex} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`edit-permission-${groupIndex}-${permIndex}`}
                                checked={isChecked}
                                onChange={e =>
                                  handleEditPermissionChange(permission, e.target.checked)
                                }
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                              />
                              <label
                                htmlFor={`edit-permission-${groupIndex}-${permIndex}`}
                                className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
                              >
                                {permission}
                              </label>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
              {editRoleFormik.touched.permissions && editRoleFormik.errors.permissions && (
                <p className="text-red-600 text-sm mt-1">{editRoleFormik.errors.permissions}</p>
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
                title="Update Role"
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

  return (
    <div className="flex flex-col justify-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-6">Add Role</h1>

        <form onSubmit={addRoleFormik.handleSubmit}>
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
              onChange={addRoleFormik.handleChange}
              onBlur={addRoleFormik.handleBlur}
              value={addRoleFormik.values.roleName}
              className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                addRoleFormik.touched.roleName && addRoleFormik.errors.roleName
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-gray-300 focus:ring-blue-400'
              }`}
            />
            {addRoleFormik.touched.roleName && addRoleFormik.errors.roleName && (
              <p className="text-red-600 text-sm mt-1">{addRoleFormik.errors.roleName}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-800 mb-3">Permissions</label>
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
                        permissionCount <= 3 ? 'grid grid-cols-1 gap-2' : 'grid grid-cols-2 gap-2'
                      }
                    >
                      {group.permissions.map((permission, permIndex) => {
                        const isChecked = addRoleFormik.values.permissions.includes(permission)
                        return (
                          <div key={permIndex} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`add-permission-${groupIndex}-${permIndex}`}
                              checked={isChecked}
                              onChange={e =>
                                handleAddPermissionChange(permission, e.target.checked)
                              }
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <label
                              htmlFor={`add-permission-${groupIndex}-${permIndex}`}
                              className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
                            >
                              {permission}
                            </label>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
            {addRoleFormik.touched.permissions && addRoleFormik.errors.permissions && (
              <p className="text-red-600 text-sm mt-1">{addRoleFormik.errors.permissions}</p>
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
              title="Add Role"
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
