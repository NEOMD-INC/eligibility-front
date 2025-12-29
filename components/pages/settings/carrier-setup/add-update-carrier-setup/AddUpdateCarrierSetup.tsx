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
  clearCarrierSetupsError,
  clearCurrentCarrierSetup,
  createCarrierSetup,
  fetchCarrierSetupById,
  updateCarrierSetup,
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

  const validationSchema = Yup.object({
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

  const formik = useFormik<CarrierSetupFormValues>({
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
    enableReinitialize: isEditMode,
    validationSchema,
    onSubmit: async values => {
      setIsError(false)
      setErrorMsg('')
      dispatch(clearCarrierSetupsError())
      try {
        if (isEditMode) {
          if (!carrierSetupId) return
          await dispatch(updateCarrierSetup({ carrierSetupId, carrierSetupData: values })).unwrap()
        } else {
          await dispatch(createCarrierSetup(values)).unwrap()
        }
        router.push('/settings/carrier-setup')
      } catch (err: any) {
        setIsError(true)
        setErrorMsg(
          err ||
            `An error occurred while ${isEditMode ? 'updating' : 'creating'} the carrier setup.`
        )
      }
    },
  })

  useEffect(() => {
    if (isEditMode && carrierSetupId) {
      dispatch(clearCarrierSetupsError())
      dispatch(fetchCarrierSetupById(carrierSetupId))
    }
    return () => {
      dispatch(clearCurrentCarrierSetup())
    }
  }, [dispatch, isEditMode, carrierSetupId])

  useEffect(() => {
    if (isEditMode && currentCarrierSetup) {
      formik.setValues({
        carrierGroupCode: currentCarrierSetup.carrier_group_code || '',
        carrierGroupDescription: currentCarrierSetup.carrier_group_description || '',
        carrierCode: currentCarrierSetup.carrier_code || '',
        carrierDescription: currentCarrierSetup.carrier_description || '',
        state: currentCarrierSetup.state || '',
        batchPlayerId: currentCarrierSetup.batch_payer_id || '',
        isClia:
          typeof currentCarrierSetup.is_clia === 'boolean'
            ? currentCarrierSetup.is_clia
            : currentCarrierSetup.is_clia === 1 || currentCarrierSetup.is_clia === '1'
              ? true
              : false,
        cob: currentCarrierSetup.cob || '',
        correctedClaim: currentCarrierSetup.corrected_claim || '',
        enrollmentRequired: currentCarrierSetup.enrollment_required || '',
      })
    }
  }, [currentCarrierSetup, isEditMode])

  useEffect(() => {
    if (error) {
      setIsError(true)
      setErrorMsg(error)
    }
  }, [error])

  const renderField = (
    name: keyof CarrierSetupFormValues,
    label: string,
    type: 'text' | 'select' = 'text',
    options?: { value: string; label: string }[]
  ) => {
    const value = formik.values[name]
    const touched = formik.touched[name]
    const error = formik.errors[name]
    const hasError = touched && error

    if (type === 'select') {
      return (
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-800 mb-1">{label}</label>
          <select
            name={name}
            onChange={e => {
              if (name === 'isClia') {
                formik.setFieldValue(
                  'isClia',
                  e.target.value === '' ? undefined : e.target.value === 'true'
                )
              } else {
                formik.handleChange(e)
              }
            }}
            onBlur={formik.handleBlur}
            value={
              name === 'isClia'
                ? formik.values.isClia === undefined
                  ? ''
                  : String(formik.values.isClia)
                : String(value || '')
            }
            className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
              hasError ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'
            }`}
          >
            {options?.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {hasError && <p className="text-red-600 text-sm mt-1">{error}</p>}
        </div>
      )
    }

    return (
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-800 mb-1">{label}</label>
        <input
          type="text"
          name={name}
          placeholder={label}
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

  if (isEditMode && fetchCarrierSetupLoading) {
    return <ComponentLoader component="Carrier Setup" message="Loading Carrier Setup data..." />
  }

  return (
    <PageTransition>
      <div className="flex flex-col justify-center bg-gray-100 p-6">
        <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8">
          <h1 className="text-2xl font-bold mb-6">
            {isEditMode ? 'Edit Carrier Setup' : 'Add Carrier Setup'}
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

            {renderField('carrierGroupCode', 'Carrier Group Code')}
            {renderField('carrierGroupDescription', 'Carrier Group Description')}
            {renderField('carrierCode', 'Carrier Code')}
            {renderField('carrierDescription', 'Carrier Description')}
            {renderField('state', 'State')}
            {renderField('batchPlayerId', 'Batch Player ID')}
            {renderField('isClia', 'Is CLIA', 'select', [
              { value: '', label: 'Select' },
              { value: 'true', label: 'Yes' },
              { value: 'false', label: 'No' },
            ])}
            {renderField('cob', 'COB')}
            {renderField('correctedClaim', 'Corrected Claim')}
            {renderField('enrollmentRequired', 'Enrollment Required', 'select', [
              { value: '', label: 'Select' },
              { value: 'Required', label: 'Required' },
              { value: 'Not Required', label: 'Not Required' },
            ])}

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
                title={isEditMode ? 'Update Carrier Setup' : 'Add Carrier Setup'}
                class_name="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                btnLoading={isEditMode ? updateLoading || fetchCarrierSetupLoading : createLoading}
                callback_event=""
              />
            </div>
          </form>
        </div>
      </div>
    </PageTransition>
  )
}
