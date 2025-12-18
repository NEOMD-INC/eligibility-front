'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import ComponentLoader from '@/components/ui/loader/component-loader/ComponentLoader'
import SubmitButton from '@/components/ui/buttons/submit-button/SubmitButton'
import {
  fetchCarrierGroupById,
  createCarrierGroup,
  updateCarrierGroup,
  clearCurrentCarrierGroup,
  clearCarrierGroupsError,
} from '@/redux/slices/settings/carrier-groups/actions'
import { AppDispatch, RootState } from '@/redux/store'
import type { CarrierGroupFormValues } from '@/types'

export default function AddUpdateCarrierGroup() {
  const router = useRouter()
  const params = useParams()
  const carrierGroupId = params?.id as string | undefined
  const isEditMode = !!carrierGroupId

  const dispatch = useDispatch<AppDispatch>()
  const {
    currentCarrierGroup,
    createLoading,
    updateLoading,
    fetchCarrierGroupLoading,
    error,
  } = useSelector((state: RootState) => state.carrierGroups)

  const [isError, setIsError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Unified validation schema
  const validationSchema = Yup.object({
    description: Yup.string().required('Carrier group description is required'),
    code: Yup.string().required('Carrier group code is required'),
    fillingIndicator: Yup.string().required('Filling indicator is required'),
    isActive: Yup.boolean(),
  })

  // Unified Formik instance
  const formik = useFormik<CarrierGroupFormValues>({
    initialValues: {
      description: '',
      code: '',
      fillingIndicator: '',
      isActive: false,
    },
    enableReinitialize: isEditMode,
    validationSchema,
    onSubmit: async values => {
      setIsError(false)
      setErrorMsg('')
      dispatch(clearCarrierGroupsError())
      try {
        if (isEditMode) {
          if (!carrierGroupId) return
          await dispatch(
            updateCarrierGroup({ carrierGroupId, carrierGroupData: values })
          ).unwrap()
        } else {
          await dispatch(createCarrierGroup(values)).unwrap()
        }
        router.push('/settings/carrier-group')
      } catch (err: any) {
        setIsError(true)
        setErrorMsg(
          err ||
            `An error occurred while ${isEditMode ? 'updating' : 'creating'} the carrier group.`
        )
      }
    },
  })

  // Load carrier group data in edit mode
  useEffect(() => {
    if (isEditMode && carrierGroupId) {
      dispatch(clearCarrierGroupsError())
      dispatch(fetchCarrierGroupById(carrierGroupId))
    }
    return () => {
      dispatch(clearCurrentCarrierGroup())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isEditMode, carrierGroupId])

  // Update form values when carrier group data is loaded
  useEffect(() => {
    if (isEditMode && currentCarrierGroup) {
      // Determine isActive value from various possible status formats
      let isActiveValue = false
      if (typeof currentCarrierGroup.status === 'boolean') {
        isActiveValue = currentCarrierGroup.status
      } else if (currentCarrierGroup.isActive !== undefined) {
        isActiveValue = currentCarrierGroup.isActive
      } else if (currentCarrierGroup.is_active !== undefined) {
        isActiveValue = currentCarrierGroup.is_active
      } else if (typeof currentCarrierGroup.status === 'string') {
        isActiveValue =
          currentCarrierGroup.status.toLowerCase() === 'active' ||
          currentCarrierGroup.status === 'true'
      }

      formik.setValues({
        description:
          currentCarrierGroup.carrier_group_description ||
          currentCarrierGroup.description ||
          '',
        code:
          currentCarrierGroup.carrier_group_code || currentCarrierGroup.code || '',
        fillingIndicator:
          currentCarrierGroup.filling_indicator ||
          currentCarrierGroup.fillingIndicator ||
          '',
        isActive: isActiveValue,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCarrierGroup, isEditMode])

  // Update error message from Redux
  useEffect(() => {
    if (error) {
      setIsError(true)
      setErrorMsg(error)
    }
  }, [error])

  // Render field helper
  const renderField = (
    name: 'description' | 'code' | 'fillingIndicator',
    label: string,
    placeholder?: string
  ) => {
    const value = formik.values[name]
    const touched = formik.touched[name]
    const error = formik.errors[name]
    const hasError = touched && error

    return (
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-800 mb-1">{label}</label>
        <input
          type="text"
          name={name}
          placeholder={placeholder || label}
          autoComplete="off"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={String(value || '')}
          className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
            hasError ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'
          }`}
        />
        {hasError && <p className="text-red-600 text-sm mt-1">{error}</p>}
      </div>
    )
  }

  if (isEditMode && fetchCarrierGroupLoading) {
    return <ComponentLoader component="Carrier Group" message="Loading Carrier Group data..." />
  }

  return (
    <div className="flex flex-col justify-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-6">
          {isEditMode ? 'Edit Carrier Group' : 'Add Carrier Group'}
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

          {renderField('description', 'Carrier Group Description')}
          {renderField('code', 'Carrier Group Code')}
          {renderField('fillingIndicator', 'Filling Indicator')}

          <div className="mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formik.values.isActive || false}
                onChange={e => formik.setFieldValue('isActive', e.target.checked)}
                onBlur={formik.handleBlur}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
                Is Active
              </label>
            </div>
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
              title={isEditMode ? 'Update Carrier Group' : 'Add Carrier Group'}
              class_name="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              btnLoading={isEditMode ? updateLoading || fetchCarrierGroupLoading : createLoading}
              callback_event=""
            />
          </div>
        </form>
      </div>
    </div>
  )
}

