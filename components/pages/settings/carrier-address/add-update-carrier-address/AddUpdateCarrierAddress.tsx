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
  clearCarrierAddressesError,
  clearCurrentCarrierAddress,
  createCarrierAddress,
  fetchCarrierAddressById,
  updateCarrierAddress,
} from '@/redux/slices/settings/carrier-addresses/actions'
import { AppDispatch, RootState } from '@/redux/store'
import type { CarrierAddressFormValues } from '@/types'

export default function AddUpdateCarrierAddress() {
  const router = useRouter()
  const params = useParams()
  const carrierAddressId = params?.id as string | undefined
  const isEditMode = !!carrierAddressId

  const dispatch = useDispatch<AppDispatch>()
  const { currentCarrierAddress, createLoading, updateLoading, fetchCarrierAddressLoading, error } =
    useSelector((state: RootState) => state.carrierAddresses)

  const [isError, setIsError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const validationSchema = Yup.object({
    carrierCode: Yup.string().required('Carrier code is required'),
    actualName: Yup.string().required('Actual name is required'),
    addressId: Yup.string().required('Address ID is required'),
    addressLine1: Yup.string().required('Address line 1 is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    zipCode: Yup.string().required('Zip code is required'),
    phoneType: Yup.string().required('Phone type is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    insuranceDepartment: Yup.string().required('Insurance department is required'),
  })

  const formik = useFormik<CarrierAddressFormValues>({
    initialValues: {
      carrierCode: '',
      actualName: '',
      addressId: '',
      addressLine1: '',
      city: '',
      state: '',
      zipCode: '',
      phoneType: '',
      phoneNumber: '',
      insuranceDepartment: '',
    },
    enableReinitialize: isEditMode,
    validationSchema,
    onSubmit: async values => {
      setIsError(false)
      setErrorMsg('')
      dispatch(clearCarrierAddressesError())
      try {
        if (isEditMode) {
          if (!carrierAddressId) return
          await dispatch(
            updateCarrierAddress({ carrierAddressId, carrierAddressData: values })
          ).unwrap()
        } else {
          await dispatch(createCarrierAddress(values)).unwrap()
        }
        router.push('/settings/carrier-address')
      } catch (err: any) {
        setIsError(true)
        setErrorMsg(
          err ||
            `An error occurred while ${isEditMode ? 'updating' : 'creating'} the carrier address.`
        )
      }
    },
  })

  useEffect(() => {
    if (isEditMode && carrierAddressId) {
      dispatch(clearCarrierAddressesError())
      dispatch(fetchCarrierAddressById(carrierAddressId))
    }
    return () => {
      dispatch(clearCurrentCarrierAddress())
    }
  }, [dispatch, isEditMode, carrierAddressId])

  useEffect(() => {
    if (isEditMode && currentCarrierAddress) {
      formik.setValues({
        carrierCode: currentCarrierAddress.carrier_code || '',
        actualName: currentCarrierAddress.actual_name || '',
        addressId: currentCarrierAddress.address_id || '',
        addressLine1:
          currentCarrierAddress.address_line1 || currentCarrierAddress.address_line_1 || '',
        city: currentCarrierAddress.city || '',
        state: currentCarrierAddress.state || '',
        zipCode: currentCarrierAddress.zip_code || '',
        phoneType: currentCarrierAddress.phone_type || '',
        phoneNumber: currentCarrierAddress.phone_number || '',
        insuranceDepartment: currentCarrierAddress.insurance_department || '',
      })
    }
  }, [currentCarrierAddress, isEditMode])

  useEffect(() => {
    if (error) {
      setIsError(true)
      setErrorMsg(error)
    }
  }, [error])

  const renderField = (name: keyof CarrierAddressFormValues, label: string) => {
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
          placeholder={label}
          autoComplete="off"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={value || ''}
          className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
            hasError ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'
          }`}
        />
        {hasError && <p className="text-red-600 text-sm mt-1">{error}</p>}
      </div>
    )
  }

  if (isEditMode && fetchCarrierAddressLoading) {
    return <ComponentLoader component="Carrier Address" message="Loading Carrier Address data..." />
  }

  return (
    <PageTransition>
      <div className="flex flex-col justify-center bg-gray-100 p-6">
        <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8">
          <h1 className="text-2xl font-bold mb-6">
            {isEditMode ? 'Edit Carrier Address' : 'Add Carrier Address'}
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

            {renderField('carrierCode', 'Carrier Code')}
            {renderField('actualName', 'Actual Name')}
            {renderField('addressId', 'Address ID')}
            {renderField('addressLine1', 'Address 1')}
            {renderField('city', 'City')}
            {renderField('state', 'State')}
            {renderField('zipCode', 'Zip Code')}
            {renderField('phoneType', 'Phone Type')}
            {renderField('phoneNumber', 'Phone Number')}
            {renderField('insuranceDepartment', 'Insurance Department')}

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
                title={isEditMode ? 'Update Carrier Address' : 'Add Carrier Address'}
                class_name="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                btnLoading={
                  isEditMode ? updateLoading || fetchCarrierAddressLoading : createLoading
                }
                callback_event=""
              />
            </div>
          </form>
        </div>
      </div>
    </PageTransition>
  )
}
