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
  clearCurrentPermission,
  clearPermissionsError,
  createPermission,
  fetchPermissionById,
  updatePermission,
} from '@/redux/slices/user-management/permissions/actions'
import { AppDispatch, RootState } from '@/redux/store'
import type { PermissionFormValues } from '@/types'

export default function AddUpdatePermission() {
  const router = useRouter()
  const params = useParams()
  const permissionId = params?.id as string | undefined
  const isEditMode = !!permissionId
  const dispatch = useDispatch<AppDispatch>()
  const { currentPermission, createLoading, updateLoading, fetchPermissionLoading, error } =
    useSelector((state: RootState) => state.permissions)

  const [isError, setIsError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const validationSchema = Yup.object({
    permissionName: Yup.string().required('Permission name is required'),
  })

  const formik = useFormik<PermissionFormValues>({
    initialValues: {
      permissionName: '',
    },
    enableReinitialize: isEditMode,
    validationSchema,
    onSubmit: async values => {
      dispatch(clearPermissionsError())
      setIsError(false)
      setErrorMsg('')

      try {
        const permissionData = {
          name: values.permissionName,
        }

        if (isEditMode) {
          if (!permissionId) return
          const result = await dispatch(updatePermission({ permissionId, permissionData }))
          if (updatePermission.fulfilled.match(result)) {
            router.push('/user-management/permissions')
          } else {
            setIsError(true)
            setErrorMsg(
              (result.payload as string) || 'An error occurred while updating the permission.'
            )
          }
        } else {
          const result = await dispatch(createPermission(permissionData))
          if (createPermission.fulfilled.match(result)) {
            router.push('/user-management/permissions')
          } else {
            setIsError(true)
            setErrorMsg(
              (result.payload as string) || 'An error occurred while creating the permission.'
            )
          }
        }
      } catch (err: any) {
        setIsError(true)
        setErrorMsg(
          err.message ||
            `An error occurred while ${isEditMode ? 'updating' : 'creating'} the permission.`
        )
      }
    },
  })

  useEffect(() => {
    if (isEditMode && permissionId) {
      dispatch(clearPermissionsError())
      dispatch(clearCurrentPermission())
      dispatch(fetchPermissionById(permissionId))
    }

    return () => {
      if (isEditMode) {
        dispatch(clearCurrentPermission())
      }
    }
  }, [dispatch, isEditMode, permissionId])

  useEffect(() => {
    if (isEditMode && currentPermission) {
      const permissionName = currentPermission.name || ''
      formik.setValues({
        permissionName,
      })
    }
  }, [currentPermission, isEditMode])

  useEffect(() => {
    if (error) {
      setIsError(true)
      setErrorMsg(error)
    }
  }, [error])

  if (isEditMode && fetchPermissionLoading) {
    return <ComponentLoader component="permission" message="Loading permission data..." />
  }

  return (
    <PageTransition>
      <div className="flex flex-col justify-center bg-gray-100 p-6">
        <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8">
          <h1 className="text-2xl font-bold mb-6">
            {isEditMode ? 'Edit Permission' : 'Add Permission'}
          </h1>

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
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Permission Name
              </label>
              <input
                type="text"
                name="permissionName"
                placeholder="Permission Name"
                autoComplete="off"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.permissionName}
                className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                  formik.touched.permissionName && formik.errors.permissionName
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-blue-400'
                }`}
              />
              {formik.touched.permissionName && formik.errors.permissionName && (
                <p className="text-red-600 text-sm mt-1">{formik.errors.permissionName}</p>
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
                title={isEditMode ? 'Update Permission' : 'Add Permission'}
                class_name="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                btnLoading={isEditMode ? updateLoading || fetchPermissionLoading : createLoading}
                callback_event=""
              />
            </div>
          </form>
        </div>
      </div>
    </PageTransition>
  )
}
