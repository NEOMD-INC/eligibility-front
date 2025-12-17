'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import ComponentLoader from '@/components/ui/loader/component-loader/ComponentLoader'
import SubmitButton from '@/components/ui/buttons/submit-button/SubmitButton'
import {
  fetchCarrierAddressById,
  createCarrierAddress,
  updateCarrierAddress,
  clearCurrentCarrierAddress,
  clearCarrierAddressesError,
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

  // Add Carrier Address Validation Schema
  const addCarrierAddressValidationSchema = Yup.object({
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

  // Edit Carrier Address Validation Schema
  const editCarrierAddressValidationSchema = Yup.object({
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

  // Add Carrier Address Formik
  const addCarrierAddressFormik = useFormik<CarrierAddressFormValues>({
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
    validationSchema: addCarrierAddressValidationSchema,
    onSubmit: async values => {
      setIsError(false)
      setErrorMsg('')
      dispatch(clearCarrierAddressesError())
      try {
        await dispatch(createCarrierAddress(values)).unwrap()
        router.push('/settings/carrier-address')
      } catch (err: any) {
        setIsError(true)
        setErrorMsg(err || 'An error occurred while creating the carrier address.')
      }
    },
  })

  // Edit Carrier Address Formik
  const editCarrierAddressFormik = useFormik<CarrierAddressFormValues>({
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
    validationSchema: editCarrierAddressValidationSchema,
    onSubmit: async values => {
      if (!carrierAddressId) return
      setIsError(false)
      setErrorMsg('')
      dispatch(clearCarrierAddressesError())
      try {
        await dispatch(
          updateCarrierAddress({ carrierAddressId, carrierAddressData: values })
        ).unwrap()
        router.push('/settings/carrier-address')
      } catch (err: any) {
        setIsError(true)
        setErrorMsg(err || 'An error occurred while updating the carrier address.')
      }
    },
  })

  // Load carrier address data in edit mode
  useEffect(() => {
    if (isEditMode && carrierAddressId) {
      dispatch(clearCarrierAddressesError())
      dispatch(fetchCarrierAddressById(carrierAddressId))
    }
    return () => {
      dispatch(clearCurrentCarrierAddress())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isEditMode, carrierAddressId])

  // Update form values when carrier address data is loaded
  useEffect(() => {
    if (isEditMode && currentCarrierAddress) {
      editCarrierAddressFormik.setValues({
        carrierCode: currentCarrierAddress.carrier_code || '',
        actualName: currentCarrierAddress.actual_name || '',
        addressId: currentCarrierAddress.address_id || '',
        addressLine1: currentCarrierAddress.address1 || '',
        city: currentCarrierAddress.city || '',
        state: currentCarrierAddress.state || '',
        zipCode: currentCarrierAddress.zip_code || '',
        phoneType: currentCarrierAddress.insurance_phone_type1 || '',
        phoneNumber: currentCarrierAddress.insurance_phone_number1 || '',
        insuranceDepartment: currentCarrierAddress.insurance_department || '',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCarrierAddress, isEditMode])

  // Update error message from Redux
  useEffect(() => {
    if (error) {
      setIsError(true)
      setErrorMsg(error)
    }
  }, [error])

  const renderFormFields = (formik: any, prefix: string) => (
    <>
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
        <label className="block text-sm font-semibold text-gray-800 mb-1">Actual Name</label>
        <input
          type="text"
          name="actualName"
          placeholder="Actual Name"
          autoComplete="off"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.actualName}
          className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
            formik.touched.actualName && formik.errors.actualName
              ? 'border-red-500 focus:ring-red-400'
              : 'border-gray-300 focus:ring-blue-400'
          }`}
        />
        {formik.touched.actualName && formik.errors.actualName && (
          <p className="text-red-600 text-sm mt-1">{formik.errors.actualName}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-800 mb-1">Address ID</label>
        <input
          type="text"
          name="addressId"
          placeholder="Address ID"
          autoComplete="off"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.addressId}
          className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
            formik.touched.addressId && formik.errors.addressId
              ? 'border-red-500 focus:ring-red-400'
              : 'border-gray-300 focus:ring-blue-400'
          }`}
        />
        {formik.touched.addressId && formik.errors.addressId && (
          <p className="text-red-600 text-sm mt-1">{formik.errors.addressId}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-800 mb-1">Address 1</label>
        <input
          type="text"
          name="addressLine1"
          placeholder="Address 1"
          autoComplete="off"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.addressLine1}
          className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
            formik.touched.addressLine1 && formik.errors.addressLine1
              ? 'border-red-500 focus:ring-red-400'
              : 'border-gray-300 focus:ring-blue-400'
          }`}
        />
        {formik.touched.addressLine1 && formik.errors.addressLine1 && (
          <p className="text-red-600 text-sm mt-1">{formik.errors.addressLine1}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-800 mb-1">City</label>
        <input
          type="text"
          name="city"
          placeholder="City"
          autoComplete="off"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.city}
          className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
            formik.touched.city && formik.errors.city
              ? 'border-red-500 focus:ring-red-400'
              : 'border-gray-300 focus:ring-blue-400'
          }`}
        />
        {formik.touched.city && formik.errors.city && (
          <p className="text-red-600 text-sm mt-1">{formik.errors.city}</p>
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
        <label className="block text-sm font-semibold text-gray-800 mb-1">Zip Code</label>
        <input
          type="text"
          name="zipCode"
          placeholder="Zip Code"
          autoComplete="off"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.zipCode}
          className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
            formik.touched.zipCode && formik.errors.zipCode
              ? 'border-red-500 focus:ring-red-400'
              : 'border-gray-300 focus:ring-blue-400'
          }`}
        />
        {formik.touched.zipCode && formik.errors.zipCode && (
          <p className="text-red-600 text-sm mt-1">{formik.errors.zipCode}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-800 mb-1">Phone Type</label>
        <input
          type="text"
          name="phoneType"
          placeholder="Phone Type"
          autoComplete="off"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.phoneType}
          className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
            formik.touched.phoneType && formik.errors.phoneType
              ? 'border-red-500 focus:ring-red-400'
              : 'border-gray-300 focus:ring-blue-400'
          }`}
        />
        {formik.touched.phoneType && formik.errors.phoneType && (
          <p className="text-red-600 text-sm mt-1">{formik.errors.phoneType}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-800 mb-1">Phone Number</label>
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          autoComplete="off"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.phoneNumber}
          className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
            formik.touched.phoneNumber && formik.errors.phoneNumber
              ? 'border-red-500 focus:ring-red-400'
              : 'border-gray-300 focus:ring-blue-400'
          }`}
        />
        {formik.touched.phoneNumber && formik.errors.phoneNumber && (
          <p className="text-red-600 text-sm mt-1">{formik.errors.phoneNumber}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-800 mb-1">
          Insurance Department
        </label>
        <input
          type="text"
          name="insuranceDepartment"
          placeholder="Insurance Department"
          autoComplete="off"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.insuranceDepartment}
          className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
            formik.touched.insuranceDepartment && formik.errors.insuranceDepartment
              ? 'border-red-500 focus:ring-red-400'
              : 'border-gray-300 focus:ring-blue-400'
          }`}
        />
        {formik.touched.insuranceDepartment && formik.errors.insuranceDepartment && (
          <p className="text-red-600 text-sm mt-1">{formik.errors.insuranceDepartment}</p>
        )}
      </div>
    </>
  )

  if (isEditMode && fetchCarrierAddressLoading) {
    return <ComponentLoader component="Carrier Address" message="Loading Carrier Address data..." />
  }

  if (isEditMode) {
    return (
      <div className="flex flex-col justify-center bg-gray-100 p-6">
        <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8">
          <h1 className="text-2xl font-bold mb-6">Edit Carrier Address</h1>

          <form onSubmit={editCarrierAddressFormik.handleSubmit}>
            {errorMsg && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  isError ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}
              >
                <span>{errorMsg}</span>
              </div>
            )}

            {renderFormFields(editCarrierAddressFormik, 'edit')}

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
                title="Update Carrier Address"
                class_name="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                btnLoading={updateLoading || fetchCarrierAddressLoading}
                callback_event=""
              />
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Add Carrier Address Form
  return (
    <div className="flex flex-col justify-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-6">Add Carrier Address</h1>

        <form onSubmit={addCarrierAddressFormik.handleSubmit}>
          {errorMsg && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                isError ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}
            >
              <span>{errorMsg}</span>
            </div>
          )}

          {renderFormFields(addCarrierAddressFormik, 'add')}

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
              title="Add Carrier Address"
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
