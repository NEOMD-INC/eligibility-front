'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import ComponentLoader from '@/components/ui/loader/component-loader/ComponentLoader'
import SubmitButton from '@/components/ui/buttons/submit-button/SubmitButton'
import {
  fetchCarrierSetupById,
  createCarrierSetup,
  updateCarrierSetup,
  clearCurrentCarrierSetup,
  clearCarrierSetupsError,
} from '@/redux/slices/settings/carrier-setups/actions'
import { AppDispatch, RootState } from '@/redux/store'
import type { CarrierSetupFormValues } from '@/types'

export default function AddUpdateCarrierSetup() {
  const router = useRouter()
  const params = useParams()
  const carrierSetupId = params?.id as string | undefined
  const isEditMode = !!carrierSetupId

  const dispatch = useDispatch<AppDispatch>()
  const { currentCarrierSetup, createLoading, updateLoading, fetchCarrierSetupLoading, error } =
    useSelector((state: RootState) => state.carrierSetups)

  const [isError, setIsError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Add Carrier Setup Validation Schema
  const addCarrierSetupValidationSchema = Yup.object({
    carrierGroupCode: Yup.string().required('Carrier group code is required'),
    carrierGroupDescription: Yup.string().required('Carrier group description is required'),
    carrierCode: Yup.string().required('Carrier code is required'),
    carrierDescription: Yup.string().required('Carrier description is required'),
    state: Yup.string().required('State is required'),
    batchPlayerId: Yup.string().required('Batch player ID is required'),
    isClia: Yup.boolean().required('Is CLIA is required'),
    cob: Yup.string().required('COB is required'),
    correctedClaim: Yup.string().required('Corrected claim is required'),
    enrollmentRequired: Yup.string().required('Enrollment required is required'),
  })

  // Edit Carrier Setup Validation Schema
  const editCarrierSetupValidationSchema = Yup.object({
    carrierGroupCode: Yup.string().required('Carrier group code is required'),
    carrierGroupDescription: Yup.string().required('Carrier group description is required'),
    carrierCode: Yup.string().required('Carrier code is required'),
    carrierDescription: Yup.string().required('Carrier description is required'),
    state: Yup.string().required('State is required'),
    batchPlayerId: Yup.string().required('Batch player ID is required'),
    isClia: Yup.boolean().required('Is CLIA is required'),
    cob: Yup.string().required('COB is required'),
    correctedClaim: Yup.string().required('Corrected claim is required'),
    enrollmentRequired: Yup.string().required('Enrollment required is required'),
  })

  // Add Carrier Setup Formik
  const addCarrierSetupFormik = useFormik<CarrierSetupFormValues>({
    initialValues: {
      carrierGroupCode: '',
      carrierGroupDescription: '',
      carrierCode: '',
      carrierDescription: '',
      state: '',
      batchPlayerId: '',
      isClia: false,
      cob: '',
      correctedClaim: '',
      enrollmentRequired: '',
    },
    validationSchema: addCarrierSetupValidationSchema,
    onSubmit: async values => {
      setIsError(false)
      setErrorMsg('')
      dispatch(clearCarrierSetupsError())
      try {
        await dispatch(createCarrierSetup(values)).unwrap()
        router.push('/settings/carrier-setup')
      } catch (err: any) {
        setIsError(true)
        setErrorMsg(err || 'An error occurred while creating the carrier setup.')
      }
    },
  })

  // Edit Carrier Setup Formik
  const editCarrierSetupFormik = useFormik<CarrierSetupFormValues>({
    initialValues: {
      carrierGroupCode: '',
      carrierGroupDescription: '',
      carrierCode: '',
      carrierDescription: '',
      state: '',
      batchPlayerId: '',
      isClia: false,
      cob: '',
      correctedClaim: '',
      enrollmentRequired: '',
    },
    validationSchema: editCarrierSetupValidationSchema,
    onSubmit: async values => {
      if (!carrierSetupId) return
      setIsError(false)
      setErrorMsg('')
      dispatch(clearCarrierSetupsError())
      try {
        await dispatch(updateCarrierSetup({ carrierSetupId, carrierSetupData: values })).unwrap()
        router.push('/settings/carrier-setup')
      } catch (err: any) {
        setIsError(true)
        setErrorMsg(err || 'An error occurred while updating the carrier setup.')
      }
    },
  })

  // Load carrier setup data in edit mode
  useEffect(() => {
    if (isEditMode && carrierSetupId) {
      dispatch(clearCarrierSetupsError())
      dispatch(fetchCarrierSetupById(carrierSetupId))
    }
    return () => {
      dispatch(clearCurrentCarrierSetup())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isEditMode, carrierSetupId])

  // Update form values when carrier setup data is loaded
  useEffect(() => {
    if (isEditMode && currentCarrierSetup) {
      editCarrierSetupFormik.setValues({
        carrierGroupCode: currentCarrierSetup.carrier_group_code || '',
        carrierGroupDescription: currentCarrierSetup.carrier_group_description || '',
        carrierCode: currentCarrierSetup.carrier_code || '',
        carrierDescription: currentCarrierSetup.carrier_description || '',
        state: currentCarrierSetup.state || '',
        batchPlayerId: currentCarrierSetup.batch_payer_id || '',
        isClia:
          typeof currentCarrierSetup.is_clia === 'boolean'
            ? currentCarrierSetup.is_clia
            : currentCarrierSetup.is_clia === 1 ||
                currentCarrierSetup.is_clia === '1' ||
                currentCarrierSetup.is_clia === true
              ? true
              : false,
        cob: currentCarrierSetup.cob || '',
        correctedClaim: currentCarrierSetup.corrected_claim || '',
        enrollmentRequired: currentCarrierSetup.enrollment_required || '',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCarrierSetup, isEditMode])

  // Update error message from Redux
  useEffect(() => {
    if (error) {
      setIsError(true)
      setErrorMsg(error)
    }
  }, [error])

  if (isEditMode && fetchCarrierSetupLoading) {
    return <ComponentLoader component="Carrier Setup" message="Loading Carrier Setup data..." />
  }

  const renderFormFields = (formik: any) => (
    <>
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-800 mb-1">Carrier Group Code</label>
        <input
          type="text"
          name="carrierGroupCode"
          placeholder="Carrier Group Code"
          autoComplete="off"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.carrierGroupCode}
          className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
            formik.touched.carrierGroupCode && formik.errors.carrierGroupCode
              ? 'border-red-500 focus:ring-red-400'
              : 'border-gray-300 focus:ring-blue-400'
          }`}
        />
        {formik.touched.carrierGroupCode && formik.errors.carrierGroupCode && (
          <p className="text-red-600 text-sm mt-1">{formik.errors.carrierGroupCode}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-800 mb-1">
          Carrier Group Description
        </label>
        <input
          type="text"
          name="carrierGroupDescription"
          placeholder="Carrier Group Description"
          autoComplete="off"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.carrierGroupDescription}
          className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
            formik.touched.carrierGroupDescription && formik.errors.carrierGroupDescription
              ? 'border-red-500 focus:ring-red-400'
              : 'border-gray-300 focus:ring-blue-400'
          }`}
        />
        {formik.touched.carrierGroupDescription && formik.errors.carrierGroupDescription && (
          <p className="text-red-600 text-sm mt-1">{formik.errors.carrierGroupDescription}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-800 mb-1">Carrier Code</label>
        <input
          type="text"
          name="carrierCode"
          placeholder="Carrier Code"
          autoComplete="off"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.carrierCode}
          className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
            formik.touched.carrierCode && formik.errors.carrierCode
              ? 'border-red-500 focus:ring-red-400'
              : 'border-gray-300 focus:ring-blue-400'
          }`}
        />
        {formik.touched.carrierCode && formik.errors.carrierCode && (
          <p className="text-red-600 text-sm mt-1">{formik.errors.carrierCode}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-800 mb-1">
          Carrier Description
        </label>
        <input
          type="text"
          name="carrierDescription"
          placeholder="Carrier Description"
          autoComplete="off"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.carrierDescription}
          className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
            formik.touched.carrierDescription && formik.errors.carrierDescription
              ? 'border-red-500 focus:ring-red-400'
              : 'border-gray-300 focus:ring-blue-400'
          }`}
        />
        {formik.touched.carrierDescription && formik.errors.carrierDescription && (
          <p className="text-red-600 text-sm mt-1">{formik.errors.carrierDescription}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-800 mb-1">State</label>
        <input
          type="text"
          name="state"
          placeholder="State"
          autoComplete="off"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.state}
          className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
            formik.touched.state && formik.errors.state
              ? 'border-red-500 focus:ring-red-400'
              : 'border-gray-300 focus:ring-blue-400'
          }`}
        />
        {formik.touched.state && formik.errors.state && (
          <p className="text-red-600 text-sm mt-1">{formik.errors.state}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-800 mb-1">Batch Player ID</label>
        <input
          type="text"
          name="batchPlayerId"
          placeholder="Batch Player ID"
          autoComplete="off"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.batchPlayerId}
          className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
            formik.touched.batchPlayerId && formik.errors.batchPlayerId
              ? 'border-red-500 focus:ring-red-400'
              : 'border-gray-300 focus:ring-blue-400'
          }`}
        />
        {formik.touched.batchPlayerId && formik.errors.batchPlayerId && (
          <p className="text-red-600 text-sm mt-1">{formik.errors.batchPlayerId}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-800 mb-1">Is CLIA</label>
        <select
          name="isClia"
          onChange={e => {
            const value = e.target.value
            formik.setFieldValue('isClia', value === '' ? undefined : value === 'true')
          }}
          onBlur={formik.handleBlur}
          value={formik.values.isClia === undefined ? '' : String(formik.values.isClia)}
          className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
            formik.touched.isClia && formik.errors.isClia
              ? 'border-red-500 focus:ring-red-400'
              : 'border-gray-300 focus:ring-blue-400'
          }`}
        >
          <option value="">Select</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        {formik.touched.isClia && formik.errors.isClia && (
          <p className="text-red-600 text-sm mt-1">{formik.errors.isClia}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-800 mb-1">COB</label>
        <input
          type="text"
          name="cob"
          placeholder="COB"
          autoComplete="off"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.cob}
          className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
            formik.touched.cob && formik.errors.cob
              ? 'border-red-500 focus:ring-red-400'
              : 'border-gray-300 focus:ring-blue-400'
          }`}
        />
        {formik.touched.cob && formik.errors.cob && (
          <p className="text-red-600 text-sm mt-1">{formik.errors.cob}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-800 mb-1">Corrected Claim</label>
        <input
          type="text"
          name="correctedClaim"
          placeholder="Corrected Claim"
          autoComplete="off"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.correctedClaim}
          className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
            formik.touched.correctedClaim && formik.errors.correctedClaim
              ? 'border-red-500 focus:ring-red-400'
              : 'border-gray-300 focus:ring-blue-400'
          }`}
        />
        {formik.touched.correctedClaim && formik.errors.correctedClaim && (
          <p className="text-red-600 text-sm mt-1">{formik.errors.correctedClaim}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-800 mb-1">
          Enrollment Required
        </label>
        <select
          name="enrollmentRequired"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.enrollmentRequired}
          className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
            formik.touched.enrollmentRequired && formik.errors.enrollmentRequired
              ? 'border-red-500 focus:ring-red-400'
              : 'border-gray-300 focus:ring-blue-400'
          }`}
        >
          <option value="">Select</option>
          <option value="Required">Required</option>
          <option value="Not Required">Not Required</option>
        </select>
        {formik.touched.enrollmentRequired && formik.errors.enrollmentRequired && (
          <p className="text-red-600 text-sm mt-1">{formik.errors.enrollmentRequired}</p>
        )}
      </div>
    </>
  )

  if (isEditMode) {
    return (
      <div className="flex flex-col justify-center bg-gray-100 p-6">
        <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8">
          <h1 className="text-2xl font-bold mb-6">Edit Carrier Setup</h1>

          <form onSubmit={editCarrierSetupFormik.handleSubmit}>
            {errorMsg && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  isError ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}
              >
                <span>{errorMsg}</span>
              </div>
            )}

            {renderFormFields(editCarrierSetupFormik)}

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
                title="Update Carrier Setup"
                class_name="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                btnLoading={updateLoading || fetchCarrierSetupLoading}
                callback_event=""
              />
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Add Carrier Setup Form
  return (
    <div className="flex flex-col justify-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-6">Add Carrier Setup</h1>

        <form onSubmit={addCarrierSetupFormik.handleSubmit}>
          {errorMsg && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                isError ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}
            >
              <span>{errorMsg}</span>
            </div>
          )}

          {renderFormFields(addCarrierSetupFormik)}

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
              title="Add Carrier Setup"
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
