'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import ComponentLoader from '@/components/ui/loader/component-loader/ComponentLoader'
import SubmitButton from '@/components/ui/buttons/submit-button/SubmitButton'
import {
  fetchAvailityPayerById,
  createAvailityPayer,
  updateAvailityPayer,
  clearCurrentAvailityPayer,
  clearAvailityPayersError,
} from '@/redux/slices/settings/availity-payers/actions'
import { AppDispatch, RootState } from '@/redux/store'
import type { AvailityPayerFormValues } from '@/types'

export default function AddUpdateAvailityPayer() {
  const router = useRouter()
  const params = useParams()
  const payerId = params?.id as string | undefined
  const isEditMode = !!payerId

  const dispatch = useDispatch<AppDispatch>()
  const { currentAvailityPayer, createLoading, updateLoading, fetchAvailityPayerLoading, error } =
    useSelector((state: RootState) => state.availityPayers)

  const [isError, setIsError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Unified validation schema
  const validationSchema = Yup.object({
    payerId: Yup.string().required('Payer ID is required'),
    payerName: Yup.string().required('Payer name is required'),
    payerCode: Yup.string().required('Payer code is required'),
    contactName: Yup.string().required('Contact name is required'),
    addressLine1: Yup.string().required('Address line 1 is required'),
    addressLine2: Yup.string(),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    zipCode: Yup.string().required('Zip code is required'),
    phone: Yup.string().required('Phone is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    isActive: Yup.boolean(),
    notes: Yup.string(),
  })

  // Unified Formik instance
  const formik = useFormik<AvailityPayerFormValues>({
    initialValues: {
      payerId: '',
      payerName: '',
      payerCode: '',
      contactName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      email: '',
      isActive: true,
      notes: '',
    },
    enableReinitialize: isEditMode,
    validationSchema,
    onSubmit: async values => {
      setIsError(false)
      setErrorMsg('')
      dispatch(clearAvailityPayersError())
      try {
        if (isEditMode) {
          if (!payerId) return
          await dispatch(updateAvailityPayer({ payerId, payerData: values })).unwrap()
        } else {
          await dispatch(createAvailityPayer(values)).unwrap()
        }
        router.push('/settings/availity-payer')
      } catch (err: any) {
        setIsError(true)
        setErrorMsg(err || `An error occurred while ${isEditMode ? 'updating' : 'creating'} the payer.`)
      }
    },
  })

  // Load payer data in edit mode
  useEffect(() => {
    if (isEditMode && payerId) {
      dispatch(clearAvailityPayersError())
      dispatch(fetchAvailityPayerById(payerId))
    }
    return () => {
      dispatch(clearCurrentAvailityPayer())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isEditMode, payerId])

  // Update form values when payer data is loaded
  useEffect(() => {
    if (isEditMode && currentAvailityPayer) {
      formik.setValues({
        payerId: currentAvailityPayer.payer_id || '',
        payerName: currentAvailityPayer.payer_name || '',
        payerCode: currentAvailityPayer.payer_code || '',
        contactName: currentAvailityPayer.contact_name || '',
        addressLine1: currentAvailityPayer.address_line_1 || '',
        addressLine2: currentAvailityPayer.address_line_2 || '',
        city: currentAvailityPayer.city || '',
        state: currentAvailityPayer.state || '',
        zipCode: currentAvailityPayer.zip || '',
        phone: currentAvailityPayer.phone || '',
        email: currentAvailityPayer.email || '',
        isActive:
          typeof currentAvailityPayer.is_active === 'boolean'
            ? currentAvailityPayer.is_active
            : currentAvailityPayer.is_active === 1 ||
                currentAvailityPayer.is_active === '1' ||
                currentAvailityPayer.is_active === true
              ? true
              : false,
        notes: currentAvailityPayer.notes || '',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAvailityPayer, isEditMode])

  // Update error message from Redux
  useEffect(() => {
    if (error) {
      setIsError(true)
      setErrorMsg(error)
    }
  }, [error])

  if (isEditMode && fetchAvailityPayerLoading) {
    return <ComponentLoader component="Availity Payer" message="Loading Availity Payer data..." />
  }


  return (
    <div className="flex flex-col justify-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-6">
          {isEditMode ? 'Edit Availity Payer' : 'Add Availity Payer'}
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

          {renderField('payerId', 'Payer ID')}
          {renderField('payerName', 'Payer Name')}
          {renderField('payerCode', 'Payer Code')}
          {renderField('contactName', 'Contact Name')}
          {renderField('addressLine1', 'Address Line 1')}
          {renderField('addressLine2', 'Address Line 2')}
          {renderField('city', 'City')}
          {renderField('state', 'State')}
          {renderField('zipCode', 'Zip Code')}
          {renderField('phone', 'Phone')}
          {renderField('email', 'Email', 'email')}
          {renderField('isActive', 'Is Active')}
          {renderField('notes', 'Notes', 'textarea')}

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
              title={isEditMode ? 'Update Payer' : 'Add Payer'}
              class_name="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              btnLoading={isEditMode ? updateLoading || fetchAvailityPayerLoading : createLoading}
              callback_event=""
            />
          </div>
        </form>
      </div>
    </div>
  )
}
