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

  // Add Payer Validation Schema
  const addPayerValidationSchema = Yup.object({
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

  // Edit Payer Validation Schema
  const editPayerValidationSchema = Yup.object({
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

  // Add Payer Formik
  const addPayerFormik = useFormik<AvailityPayerFormValues>({
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
    validationSchema: addPayerValidationSchema,
    onSubmit: async values => {
      setIsError(false)
      setErrorMsg('')
      dispatch(clearAvailityPayersError())
      try {
        await dispatch(createAvailityPayer(values)).unwrap()
        router.push('/settings/availity-payer')
      } catch (err: any) {
        setIsError(true)
        setErrorMsg(err || 'An error occurred while creating the payer.')
      }
    },
  })

  // Edit Payer Formik
  const editPayerFormik = useFormik<AvailityPayerFormValues>({
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
    validationSchema: editPayerValidationSchema,
    onSubmit: async values => {
      if (!payerId) return
      setIsError(false)
      setErrorMsg('')
      dispatch(clearAvailityPayersError())
      try {
        await dispatch(updateAvailityPayer({ payerId, payerData: values })).unwrap()
        router.push('/settings/availity-payer')
      } catch (err: any) {
        setIsError(true)
        setErrorMsg(err || 'An error occurred while updating the payer.')
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
      editPayerFormik.setValues({
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

  const renderFormFields = (formik: any, prefix: string) => (
    <>
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-800 mb-1">Payer ID</label>
        <input
          type="text"
          name="payerId"
          placeholder="Payer ID"
          autoComplete="off"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.payerId}
          className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
            formik.touched.payerId && formik.errors.payerId
              ? 'border-red-500 focus:ring-red-400'
              : 'border-gray-300 focus:ring-blue-400'
          }`}
        />
        {formik.touched.payerId && formik.errors.payerId && (
          <p className="text-red-600 text-sm mt-1">{formik.errors.payerId}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-800 mb-1">Payer Name</label>
        <input
          type="text"
          name="payerName"
          placeholder="Payer Name"
          autoComplete="off"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.payerName}
          className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
            formik.touched.payerName && formik.errors.payerName
              ? 'border-red-500 focus:ring-red-400'
              : 'border-gray-300 focus:ring-blue-400'
          }`}
        />
        {formik.touched.payerName && formik.errors.payerName && (
          <p className="text-red-600 text-sm mt-1">{formik.errors.payerName}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-800 mb-1">Payer Code</label>
        <input
          type="text"
          name="payerCode"
          placeholder="Payer Code"
          autoComplete="off"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.payerCode}
          className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
            formik.touched.payerCode && formik.errors.payerCode
              ? 'border-red-500 focus:ring-red-400'
              : 'border-gray-300 focus:ring-blue-400'
          }`}
        />
        {formik.touched.payerCode && formik.errors.payerCode && (
          <p className="text-red-600 text-sm mt-1">{formik.errors.payerCode}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-800 mb-1">Contact Name</label>
        <input
          type="text"
          name="contactName"
          placeholder="Contact Name"
          autoComplete="off"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.contactName}
          className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
            formik.touched.contactName && formik.errors.contactName
              ? 'border-red-500 focus:ring-red-400'
              : 'border-gray-300 focus:ring-blue-400'
          }`}
        />
        {formik.touched.contactName && formik.errors.contactName && (
          <p className="text-red-600 text-sm mt-1">{formik.errors.contactName}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-800 mb-1">Address Line 1</label>
        <input
          type="text"
          name="addressLine1"
          placeholder="Address Line 1"
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
        <label className="block text-sm font-semibold text-gray-800 mb-1">Address Line 2</label>
        <input
          type="text"
          name="addressLine2"
          placeholder="Address Line 2"
          autoComplete="off"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.addressLine2}
          className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
            formik.touched.addressLine2 && formik.errors.addressLine2
              ? 'border-red-500 focus:ring-red-400'
              : 'border-gray-300 focus:ring-blue-400'
          }`}
        />
        {formik.touched.addressLine2 && formik.errors.addressLine2 && (
          <p className="text-red-600 text-sm mt-1">{formik.errors.addressLine2}</p>
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
        <label className="block text-sm font-semibold text-gray-800 mb-1">Phone</label>
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          autoComplete="off"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.phone}
          className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
            formik.touched.phone && formik.errors.phone
              ? 'border-red-500 focus:ring-red-400'
              : 'border-gray-300 focus:ring-blue-400'
          }`}
        />
        {formik.touched.phone && formik.errors.phone && (
          <p className="text-red-600 text-sm mt-1">{formik.errors.phone}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-800 mb-1">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          autoComplete="off"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
            formik.touched.email && formik.errors.email
              ? 'border-red-500 focus:ring-red-400'
              : 'border-gray-300 focus:ring-blue-400'
          }`}
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-red-600 text-sm mt-1">{formik.errors.email}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-800 mb-1">Is Active</label>
        <select
          name="isActive"
          onChange={e => formik.setFieldValue('isActive', e.target.value === 'true')}
          onBlur={formik.handleBlur}
          value={formik.values.isActive ? 'true' : 'false'}
          className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
            formik.touched.isActive && formik.errors.isActive
              ? 'border-red-500 focus:ring-red-400'
              : 'border-gray-300 focus:ring-blue-400'
          }`}
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        {formik.touched.isActive && formik.errors.isActive && (
          <p className="text-red-600 text-sm mt-1">{formik.errors.isActive}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-800 mb-1">Notes</label>
        <textarea
          name="notes"
          placeholder="Notes"
          rows={4}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.notes}
          className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
            formik.touched.notes && formik.errors.notes
              ? 'border-red-500 focus:ring-red-400'
              : 'border-gray-300 focus:ring-blue-400'
          }`}
        />
        {formik.touched.notes && formik.errors.notes && (
          <p className="text-red-600 text-sm mt-1">{formik.errors.notes}</p>
        )}
      </div>
    </>
  )

  if (isEditMode) {
    return (
      <div className="flex flex-col justify-center bg-gray-100 p-6">
        <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8">
          <h1 className="text-2xl font-bold mb-6">Edit Availity Payer</h1>

          <form onSubmit={editPayerFormik.handleSubmit}>
            {errorMsg && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  isError ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}
              >
                <span>{errorMsg}</span>
              </div>
            )}

            {renderFormFields(editPayerFormik, 'edit')}

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
                title="Update Payer"
                class_name="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                btnLoading={updateLoading || fetchAvailityPayerLoading}
                callback_event=""
              />
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Add Payer Form
  return (
    <div className="flex flex-col justify-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-6">Add Availity Payer</h1>

        <form onSubmit={addPayerFormik.handleSubmit}>
          {errorMsg && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                isError ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}
            >
              <span>{errorMsg}</span>
            </div>
          )}

          {renderFormFields(addPayerFormik, 'add')}

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
              title="Add Payer"
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
