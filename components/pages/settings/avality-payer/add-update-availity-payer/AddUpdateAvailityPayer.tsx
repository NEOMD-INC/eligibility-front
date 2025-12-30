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
  clearAvailityPayersError,
  clearCurrentAvailityPayer,
  createAvailityPayer,
  fetchAvailityPayerById,
  updateAvailityPayer,
} from '@/redux/slices/settings/availity-payers/actions'
import { AppDispatch, RootState } from '@/redux/store'
import { themeColors } from '@/theme'
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

  const validationSchema = Yup.object({
    payerId: Yup.string().required('Payer ID is required'),
    payerName: Yup.string().required('Payer name is required'),
    payerCode: Yup.string().nullable(),
    contactName: Yup.string().nullable(),
    addressLine1: Yup.string().nullable(),
    addressLine2: Yup.string().nullable(),
    city: Yup.string().nullable(),
    state: Yup.string().nullable(),
    zipCode: Yup.string().nullable(),
    phone: Yup.string().nullable(),
    email: Yup.string().email('Invalid email address').nullable(),
    isActive: Yup.boolean(),
    notes: Yup.string().nullable(),
  })

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
        setErrorMsg(
          err || `An error occurred while ${isEditMode ? 'updating' : 'creating'} the payer.`
        )
      }
    },
  })

  useEffect(() => {
    if (isEditMode && payerId) {
      dispatch(clearAvailityPayersError())
      dispatch(fetchAvailityPayerById(payerId))
    }
    return () => {
      dispatch(clearCurrentAvailityPayer())
    }
  }, [dispatch, isEditMode, payerId])

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
        zipCode: currentAvailityPayer.zip || currentAvailityPayer.zip_code || '',
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
  }, [currentAvailityPayer, isEditMode])

  useEffect(() => {
    if (error) {
      setIsError(true)
      setErrorMsg(error)
    }
  }, [error])

  const renderField = (
    name: keyof AvailityPayerFormValues,
    label: string,
    type: 'text' | 'email' | 'textarea' | 'checkbox' = 'text'
  ) => {
    const fieldValue = formik.values[name]
    const fieldError = formik.touched[name] && formik.errors[name]

    if (type === 'textarea') {
      return (
        <div key={name} className="mb-4">
          <label
            htmlFor={name}
            className="block text-sm font-medium mb-1"
            style={{ color: themeColors.gray[700] }}
          >
            {label}
          </label>
          <textarea
            id={name}
            name={name}
            value={fieldValue as string}
            onChange={formik.handleChange}
            rows={4}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
            style={{
              borderColor: fieldError ? themeColors.border.error : themeColors.border.default,
            }}
            onFocus={e => {
              e.currentTarget.style.boxShadow = `0 0 0 2px ${fieldError ? themeColors.border.focusRing.red : themeColors.border.focusRing.blue}`
            }}
            onBlur={e => {
              e.currentTarget.style.boxShadow = ''
              formik.handleBlur(e)
            }}
          />
          {fieldError && (
            <p className="mt-1 text-sm" style={{ color: themeColors.text.error }}>
              {formik.errors[name] as string}
            </p>
          )}
        </div>
      )
    }

    if (type === 'checkbox') {
      return (
        <div key={name} className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              id={name}
              name={name}
              checked={fieldValue as boolean}
              onChange={formik.handleChange}
              className="mr-2 h-4 w-4 border rounded"
              style={{
                color: themeColors.blue[600],
                borderColor: themeColors.border.default,
              }}
              onFocus={e => {
                e.currentTarget.style.boxShadow = `0 0 0 2px ${themeColors.blue[400]}`
              }}
              onBlur={e => {
                e.currentTarget.style.boxShadow = ''
              }}
            />
            <span className="text-sm font-medium" style={{ color: themeColors.gray[700] }}>
              {label}
            </span>
          </label>
          {fieldError && (
            <p className="mt-1 text-sm" style={{ color: themeColors.text.error }}>
              {formik.errors[name] as string}
            </p>
          )}
        </div>
      )
    }

    return (
      <div key={name} className="mb-4">
        <label
          htmlFor={name}
          className="block text-sm font-medium mb-1"
          style={{ color: themeColors.gray[700] }}
        >
          {label}
        </label>
        <input
          type={type}
          id={name}
          name={name}
          value={fieldValue as string}
          onChange={formik.handleChange}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
          style={{
            borderColor: fieldError ? themeColors.border.error : themeColors.border.default,
          }}
          onFocus={e => {
            e.currentTarget.style.boxShadow = `0 0 0 2px ${fieldError ? themeColors.border.focusRing.red : themeColors.border.focusRing.blue}`
          }}
          onBlur={e => {
            e.currentTarget.style.boxShadow = ''
            formik.handleBlur(e)
          }}
        />
        {fieldError && (
          <p className="mt-1 text-sm" style={{ color: themeColors.text.error }}>
            {formik.errors[name] as string}
          </p>
        )}
      </div>
    )
  }

  if (isEditMode && fetchAvailityPayerLoading) {
    return <ComponentLoader component="Availity Payer" message="Loading Availity Payer data..." />
  }

  return (
    <PageTransition>
      <div
        className="flex flex-col justify-center p-6"
        style={{ backgroundColor: themeColors.gray[100] }}
      >
        <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8">
          <h1 className="text-2xl font-bold mb-6">
            {isEditMode ? 'Edit Availity Payer' : 'Add Availity Payer'}
          </h1>

          <form onSubmit={formik.handleSubmit}>
            {errorMsg && (
              <div
                className="mb-6 p-4 rounded-lg"
                style={{
                  backgroundColor: isError ? themeColors.red[100] : themeColors.blue[100],
                  color: isError ? themeColors.red[700] : themeColors.blue[700],
                }}
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
            {renderField('isActive', 'Is Active', 'checkbox')}
            {renderField('notes', 'Notes', 'textarea')}

            <div className="flex justify-end gap-3 mt-8">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border rounded-md transition"
                style={{
                  borderColor: themeColors.border.default,
                  color: themeColors.gray[700],
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = themeColors.gray[50])}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                Cancel
              </button>
              <SubmitButton
                type="submit"
                title={isEditMode ? 'Update Payer' : 'Add Payer'}
                class_name="px-6 py-2 text-white rounded-md transition"
                style={{ backgroundColor: themeColors.blue[600] }}
                onMouseEnter={e => {
                  const btn = e.currentTarget as HTMLButtonElement
                  if (!btn.disabled) btn.style.backgroundColor = themeColors.blue[700]
                }}
                onMouseLeave={e => {
                  const btn = e.currentTarget as HTMLButtonElement
                  if (!btn.disabled) btn.style.backgroundColor = themeColors.blue[600]
                }}
                btnLoading={isEditMode ? updateLoading || fetchAvailityPayerLoading : createLoading}
                callback_event=""
              />
            </div>
          </form>
        </div>
      </div>
    </PageTransition>
  )
}
