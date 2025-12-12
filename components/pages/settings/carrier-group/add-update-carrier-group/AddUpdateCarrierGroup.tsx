'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import SubmitButton from '@/components/ui/buttons/submit-button/SubmitButton'

interface AddCarrierGroupValues {
  description: string
  code: string
  fillingIndicator: string
  isActive: boolean
}

interface EditCarrierGroupValues {
  description: string
  code: string
  fillingIndicator: string
  isActive: boolean
}

export default function AddUpdateCarrierGroup() {
  const router = useRouter()
  const params = useParams()
  const carrierGroupId = params?.id as string | undefined
  const isEditMode = !!carrierGroupId

  const [btnLoading, setBtnLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Add Carrier Group Validation Schema
  const addCarrierGroupValidationSchema = Yup.object({
    description: Yup.string().required('Carrier group description is required'),
    code: Yup.string().required('Carrier group code is required'),
    fillingIndicator: Yup.string().required('Filling indicator is required'),
    isActive: Yup.boolean(),
  })

  // Edit Carrier Group Validation Schema
  const editCarrierGroupValidationSchema = Yup.object({
    description: Yup.string().required('Carrier group description is required'),
    code: Yup.string().required('Carrier group code is required'),
    fillingIndicator: Yup.string().required('Filling indicator is required'),
    isActive: Yup.boolean(),
  })

  // Add Carrier Group Formik
  const addCarrierGroupFormik = useFormik<AddCarrierGroupValues>({
    initialValues: {
      description: '',
      code: '',
      fillingIndicator: '',
      isActive: false,
    },
    validationSchema: addCarrierGroupValidationSchema,
    onSubmit: async values => {
      setBtnLoading(true)
      setIsError(false)
      try {
        console.log('Add Carrier Group Values:', values)
        // TODO: Add API call to create carrier group
        // await createCarrierGroup(values)
        setTimeout(() => {
          setBtnLoading(false)
          router.push('/settings/carrier-group')
        }, 1000)
      } catch (err: any) {
        setBtnLoading(false)
        setIsError(true)
        setErrorMsg(err.message || 'An error occurred while creating the carrier group.')
      }
    },
  })

  // Edit Carrier Group Formik
  const editCarrierGroupFormik = useFormik<EditCarrierGroupValues>({
    initialValues: {
      description: '',
      code: '',
      fillingIndicator: '',
      isActive: false,
    },
    validationSchema: editCarrierGroupValidationSchema,
    onSubmit: async values => {
      setBtnLoading(true)
      setIsError(false)
      try {
        console.log('Edit Carrier Group Values:', values)
        // TODO: Add API call to update carrier group
        // await updateCarrierGroup(carrierGroupId, values)
        setTimeout(() => {
          setBtnLoading(false)
          router.push('/settings/carrier-group')
        }, 1000)
      } catch (err: any) {
        setBtnLoading(false)
        setIsError(true)
        setErrorMsg(err.message || 'An error occurred while updating the carrier group.')
      }
    },
  })

  // Load carrier group data in edit mode
  useEffect(() => {
    if (isEditMode && carrierGroupId) {
      const loadCarrierGroupData = async () => {
        try {
          // TODO: Fetch carrier group data from API
          // const carrierGroupData = await fetchCarrierGroup(carrierGroupId)
          // For now, using mock data
          editCarrierGroupFormik.setValues({
            description: 'Insurance Group A',
            code: 'IGA001',
            fillingIndicator: 'Full Coverage',
            isActive: true,
          })
        } catch (error) {
          console.error('Error loading carrier group data:', error)
        }
      }
      loadCarrierGroupData()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [isEditMode, carrierGroupId])

  if (isEditMode) {
    return (
      <div className="flex flex-col justify-center bg-gray-100 p-6">
        <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8">
          <h1 className="text-2xl font-bold mb-6">Edit Carrier Group</h1>

          <form onSubmit={editCarrierGroupFormik.handleSubmit}>
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
                Carrier Group Description
              </label>
              <input
                type="text"
                name="description"
                placeholder="Carrier Group Description"
                autoComplete="off"
                onChange={editCarrierGroupFormik.handleChange}
                onBlur={editCarrierGroupFormik.handleBlur}
                value={editCarrierGroupFormik.values.description}
                className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                  editCarrierGroupFormik.touched.description &&
                  editCarrierGroupFormik.errors.description
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-blue-400'
                }`}
              />
              {editCarrierGroupFormik.touched.description &&
                editCarrierGroupFormik.errors.description && (
                  <p className="text-red-600 text-sm mt-1">
                    {editCarrierGroupFormik.errors.description}
                  </p>
                )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Carrier Group Code
              </label>
              <input
                type="text"
                name="code"
                placeholder="Carrier Group Code"
                autoComplete="off"
                onChange={editCarrierGroupFormik.handleChange}
                onBlur={editCarrierGroupFormik.handleBlur}
                value={editCarrierGroupFormik.values.code}
                className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                  editCarrierGroupFormik.touched.code && editCarrierGroupFormik.errors.code
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-blue-400'
                }`}
              />
              {editCarrierGroupFormik.touched.code && editCarrierGroupFormik.errors.code && (
                <p className="text-red-600 text-sm mt-1">{editCarrierGroupFormik.errors.code}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Filling Indicator
              </label>
              <input
                type="text"
                name="fillingIndicator"
                placeholder="Filling Indicator"
                autoComplete="off"
                onChange={editCarrierGroupFormik.handleChange}
                onBlur={editCarrierGroupFormik.handleBlur}
                value={editCarrierGroupFormik.values.fillingIndicator}
                className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                  editCarrierGroupFormik.touched.fillingIndicator &&
                  editCarrierGroupFormik.errors.fillingIndicator
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-blue-400'
                }`}
              />
              {editCarrierGroupFormik.touched.fillingIndicator &&
                editCarrierGroupFormik.errors.fillingIndicator && (
                  <p className="text-red-600 text-sm mt-1">
                    {editCarrierGroupFormik.errors.fillingIndicator}
                  </p>
                )}
            </div>

            <div className="mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="edit-isActive"
                  name="isActive"
                  checked={editCarrierGroupFormik.values.isActive}
                  onChange={editCarrierGroupFormik.handleChange}
                  onBlur={editCarrierGroupFormik.handleBlur}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="edit-isActive" className="ml-2 text-sm font-medium text-gray-700">
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
                title="Update Carrier Group"
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

  // Add Carrier Group Form
  return (
    <div className="flex flex-col justify-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-6">Add Carrier Group</h1>

        <form onSubmit={addCarrierGroupFormik.handleSubmit}>
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
              Carrier Group Description
            </label>
            <input
              type="text"
              name="description"
              placeholder="Carrier Group Description"
              autoComplete="off"
              onChange={addCarrierGroupFormik.handleChange}
              onBlur={addCarrierGroupFormik.handleBlur}
              value={addCarrierGroupFormik.values.description}
              className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                addCarrierGroupFormik.touched.description &&
                addCarrierGroupFormik.errors.description
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-gray-300 focus:ring-blue-400'
              }`}
            />
            {addCarrierGroupFormik.touched.description &&
              addCarrierGroupFormik.errors.description && (
                <p className="text-red-600 text-sm mt-1">
                  {addCarrierGroupFormik.errors.description}
                </p>
              )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Carrier Group Code
            </label>
            <input
              type="text"
              name="code"
              placeholder="Carrier Group Code"
              autoComplete="off"
              onChange={addCarrierGroupFormik.handleChange}
              onBlur={addCarrierGroupFormik.handleBlur}
              value={addCarrierGroupFormik.values.code}
              className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                addCarrierGroupFormik.touched.code && addCarrierGroupFormik.errors.code
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-gray-300 focus:ring-blue-400'
              }`}
            />
            {addCarrierGroupFormik.touched.code && addCarrierGroupFormik.errors.code && (
              <p className="text-red-600 text-sm mt-1">{addCarrierGroupFormik.errors.code}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Filling Indicator
            </label>
            <input
              type="text"
              name="fillingIndicator"
              placeholder="Filling Indicator"
              autoComplete="off"
              onChange={addCarrierGroupFormik.handleChange}
              onBlur={addCarrierGroupFormik.handleBlur}
              value={addCarrierGroupFormik.values.fillingIndicator}
              className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                addCarrierGroupFormik.touched.fillingIndicator &&
                addCarrierGroupFormik.errors.fillingIndicator
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-gray-300 focus:ring-blue-400'
              }`}
            />
            {addCarrierGroupFormik.touched.fillingIndicator &&
              addCarrierGroupFormik.errors.fillingIndicator && (
                <p className="text-red-600 text-sm mt-1">
                  {addCarrierGroupFormik.errors.fillingIndicator}
                </p>
              )}
          </div>

          <div className="mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="add-isActive"
                name="isActive"
                checked={addCarrierGroupFormik.values.isActive}
                onChange={addCarrierGroupFormik.handleChange}
                onBlur={addCarrierGroupFormik.handleBlur}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="add-isActive" className="ml-2 text-sm font-medium text-gray-700">
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
              title="Add Carrier Group"
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

