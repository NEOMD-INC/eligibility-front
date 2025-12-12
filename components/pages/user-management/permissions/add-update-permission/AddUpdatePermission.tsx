'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import SubmitButton from '@/components/ui/buttons/submit-button/SubmitButton'

interface AddPermissionValues {
  permissionName: string
}

interface EditPermissionValues {
  permissionName: string
}

export default function AddUpdatePermission() {
  const router = useRouter()
  const params = useParams()
  const permissionId = params?.id as string | undefined
  const isEditMode = !!permissionId

  const [btnLoading, setBtnLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Add Permission Validation Schema
  const addPermissionValidationSchema = Yup.object({
    permissionName: Yup.string().required('Permission name is required'),
  })

  // Edit Permission Validation Schema
  const editPermissionValidationSchema = Yup.object({
    permissionName: Yup.string().required('Permission name is required'),
  })

  // Add Permission Formik
  const addPermissionFormik = useFormik<AddPermissionValues>({
    initialValues: {
      permissionName: '',
    },
    validationSchema: addPermissionValidationSchema,
    onSubmit: async values => {
      setBtnLoading(true)
      setIsError(false)
      try {
        console.log('Add Permission Values:', values)
        // TODO: Add API call to create permission
        // await createPermission(values)
        setTimeout(() => {
          setBtnLoading(false)
          router.push('/user-management/permissions')
        }, 1000)
      } catch (err: any) {
        setBtnLoading(false)
        setIsError(true)
        setErrorMsg(err.message || 'An error occurred while creating the permission.')
      }
    },
  })

  // Edit Permission Formik
  const editPermissionFormik = useFormik<EditPermissionValues>({
    initialValues: {
      permissionName: '',
    },
    validationSchema: editPermissionValidationSchema,
    onSubmit: async values => {
      setBtnLoading(true)
      setIsError(false)
      try {
        console.log('Edit Permission Values:', values)
        // TODO: Add API call to update permission
        // await updatePermission(permissionId, values)
        setTimeout(() => {
          setBtnLoading(false)
          router.push('/user-management/permissions')
        }, 1000)
      } catch (err: any) {
        setBtnLoading(false)
        setIsError(true)
        setErrorMsg(err.message || 'An error occurred while updating the permission.')
      }
    },
  })

  // Load permission data in edit mode
  useEffect(() => {
    if (isEditMode && permissionId) {
      const loadPermissionData = async () => {
        try {
          // TODO: Fetch permission data from API
          // const permissionData = await fetchPermission(permissionId)
          // For now, using mock data
          editPermissionFormik.setValues({
            permissionName: 'View Users',
          })
        } catch (error) {
          console.error('Error loading permission data:', error)
        }
      }
      loadPermissionData()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [isEditMode, permissionId])

  if (isEditMode) {
    return (
      <div className="flex flex-col justify-center bg-gray-100 p-6">
        <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8">
          <h1 className="text-2xl font-bold mb-6">Edit Permission</h1>

          <form onSubmit={editPermissionFormik.handleSubmit}>
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
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Permission Name
              </label>
              <input
                type="text"
                name="permissionName"
                placeholder="Permission Name"
                autoComplete="off"
                onChange={editPermissionFormik.handleChange}
                onBlur={editPermissionFormik.handleBlur}
                value={editPermissionFormik.values.permissionName}
                className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                  editPermissionFormik.touched.permissionName &&
                  editPermissionFormik.errors.permissionName
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-blue-400'
                }`}
              />
              {editPermissionFormik.touched.permissionName &&
                editPermissionFormik.errors.permissionName && (
                  <p className="text-red-600 text-sm mt-1">
                    {editPermissionFormik.errors.permissionName}
                  </p>
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
                title="Update Permission"
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

  // Add Permission Form
  return (
    <div className="flex flex-col justify-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-6">Add Permission</h1>

        <form onSubmit={addPermissionFormik.handleSubmit}>
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
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Permission Name
            </label>
            <input
              type="text"
              name="permissionName"
              placeholder="Permission Name"
              autoComplete="off"
              onChange={addPermissionFormik.handleChange}
              onBlur={addPermissionFormik.handleBlur}
              value={addPermissionFormik.values.permissionName}
              className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                addPermissionFormik.touched.permissionName &&
                addPermissionFormik.errors.permissionName
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-gray-300 focus:ring-blue-400'
              }`}
            />
            {addPermissionFormik.touched.permissionName &&
              addPermissionFormik.errors.permissionName && (
                <p className="text-red-600 text-sm mt-1">
                  {addPermissionFormik.errors.permissionName}
                </p>
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
              title="Add Permission"
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

