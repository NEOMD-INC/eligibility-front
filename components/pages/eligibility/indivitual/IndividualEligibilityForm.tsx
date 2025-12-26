'use client'

import { useFormik } from 'formik'
import { RotateCw } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'

import { PageTransition } from '@/components/providers/page-transition-provider/PageTransitionProvider'
import SubmitButton from '@/components/ui/buttons/submit-button/SubmitButton'
import ComponentLoader from '@/components/ui/loader/component-loader/ComponentLoader'
import SearchableSelect, {
  SearchableSelectOption,
} from '@/components/ui/select/searchable-select/SearchableSelect'
import SearchableSelectPayer from '@/components/ui/select/searchable-select-payer/SearchableSelectPayer'
import {
  clearEligibilityIndivitualError,
  fetchEligibilityIndivitualNpiPractice,
  saveEligibilityIndivitualNpiPractice,
  submitEligibilityCheck,
} from '@/redux/slices/eligibility/indivitual/actions'
import { fetchLogById } from '@/redux/slices/logs/eligibility-logs/actions'
import { fetchAllAvailityPayers } from '@/redux/slices/settings/availity-payers/actions'
import { AppDispatch, RootState } from '@/redux/store'
import { EligibilityIndivitualService } from '@/services/eligibility/indivitual/indivitual.service'
import { getGenderOptions } from '@/utils/constants/gender-options'
import { PLACE_OF_SERVICE_CODES } from '@/utils/constants/place-of-service'
import { RELATIONSHIP_CODES } from '@/utils/constants/relationship-codes'
import { SERVICE_TYPES } from '@/utils/constants/service-types'
import { toastManager } from '@/utils/toast'

import { getDOBMaxDate, getServiceDateMinMax, splitName } from './helper/helper'
import { IndividualEligibilityValues } from './types/type'

export default function IndividualEligibilityForm() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const logId = searchParams?.get('logId')

  const { npiPractice, loading, updateLoading, submitLoading, error } = useSelector(
    (state: RootState) => state.eligibilityIndivitual
  )
  const { availityPayers, loading: payersLoading } = useSelector(
    (state: RootState) => state.availityPayers
  )
  const { currentLog, fetchLogLoading } = useSelector((state: RootState) => state.eligibilityLogs)

  const genderOptions: SearchableSelectOption[] = getGenderOptions

  const relationshipCodeOptions: SearchableSelectOption[] = RELATIONSHIP_CODES.map(rc => ({
    value: rc.value,
    label: `${rc.value} - ${rc.label}`,
  }))

  const serviceTypeOptions: SearchableSelectOption[] = SERVICE_TYPES.map(st => ({
    value: st.value,
    label: `${st.value} - ${st.label}`,
  }))

  const placeOfServiceOptions: SearchableSelectOption[] = PLACE_OF_SERVICE_CODES.map(pos => ({
    value: pos.value,
    label: `${pos.value} - ${pos.label}`,
  }))

  const [btnLoading, setBtnLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [reuseError, setReuseError] = useState(false)
  const [reuseErrorMsg, setReuseErrorMsg] = useState('')
  const [verifyingNpi, setVerifyingNpi] = useState(false)
  const hasMappedLogData = useRef(false)

  const serviceDateRestrictions = getServiceDateMinMax()

  const validationSchema = Yup.object({
    payerId: Yup.string().required('Payer ID is required'),
    npi: Yup.string().required('NPI is required'),
    practiceLastName: Yup.string().required('Practice last name is required'),
    subscriberId: Yup.string().required('Subscriber ID is required'),
    lastName: Yup.string().required('Last name is required'),
    firstName: Yup.string().required('First name is required'),
    dob: Yup.date()
      .required('Date of birth is required')
      .max(new Date(), 'Date of birth cannot be today or in the future'),
    gender: Yup.string(),
    relationshipCode: Yup.string(),
    serviceDate: Yup.date()
      .required('Service date is required')
      .min(new Date(serviceDateRestrictions.min), 'Service date must be within the allowed range')
      .max(new Date(serviceDateRestrictions.max), 'Service date must be within the allowed range'),
    serviceType: Yup.string(),
    placeOfService: Yup.string().required('Place of service is required'),
  })

  const formik = useFormik<IndividualEligibilityValues>({
    initialValues: {
      payerId: '',
      npi: '',
      practiceLastName: '',
      practiceFirstName: '',
      subscriberId: '',
      lastName: '',
      firstName: '',
      dob: '',
      gender: '',
      relationshipCode: '18', // Default to "Self"
      serviceDate: '',
      serviceType: '30', // Default to 30
      placeOfService: '11', // Default to "Office"
    },
    validationSchema,
    onSubmit: async values => {
      setBtnLoading(true)
      setIsError(false)
      setErrorMsg('')
      dispatch(clearEligibilityIndivitualError())
      try {
        await dispatch(submitEligibilityCheck(values)).unwrap()
        setBtnLoading(false)
        router.push('/eligibility/history')
      } catch (err: any) {
        setBtnLoading(false)
        setIsError(true)
        setErrorMsg(err || 'An error occurred while submitting the eligibility check.')
      }
    },
  })

  useEffect(() => {
    dispatch(clearEligibilityIndivitualError())
    dispatch(fetchEligibilityIndivitualNpiPractice())
    dispatch(fetchAllAvailityPayers())
  }, [dispatch])

  useEffect(() => {
    if (logId) {
      hasMappedLogData.current = false
      dispatch(fetchLogById(logId))
    }
  }, [dispatch, logId])

  useEffect(() => {
    if (npiPractice && !logId) {
      const practiceData = npiPractice as any
      formik.setFieldValue('npi', practiceData.npi || practiceData.NPI || '')
      formik.setFieldValue(
        'practiceLastName',
        practiceData.practiceLastName ||
          practiceData.practice_last_name ||
          practiceData.lastName ||
          practiceData.last_name ||
          ''
      )
      formik.setFieldValue(
        'practiceFirstName',
        practiceData.practiceFirstName ||
          practiceData.practice_first_name ||
          practiceData.firstName ||
          practiceData.first_name ||
          ''
      )
    }
  }, [npiPractice, logId])

  useEffect(() => {
    if (
      currentLog &&
      logId &&
      !payersLoading &&
      availityPayers &&
      availityPayers.length > 0 &&
      !hasMappedLogData.current
    ) {
      hasMappedLogData.current = true
      const log = currentLog as any

      if (log.payer) {
        const payerId = log.payer.payer_id || log.payer.id
        const payerName = log.payer.name
        if (payerId || payerName) {
          const payer = availityPayers.find((p: any) => {
            if (payerId) {
              return (
                p.payer_id === payerId ||
                p.id === payerId ||
                String(p.payer_id) === String(payerId) ||
                String(p.id) === String(payerId)
              )
            }
            if (payerName) {
              return p.name === payerName || p.payer_name === payerName
            }
            return false
          })
          if (payer) {
            formik.setFieldValue(
              'payerId',
              payer.id || payer.payer_id || String(payer.id) || String(payer.payer_id)
            )
          }
        }
      }

      if (log.provider) {
        const providerNpi = log.provider.npi || log.provider.id
        if (providerNpi) {
          formik.setFieldValue('npi', providerNpi)
        }

        if (log.provider.name) {
          const providerName = splitName(log.provider.name)
          formik.setFieldValue('practiceLastName', providerName.lastName)
          formik.setFieldValue('practiceFirstName', providerName.firstName)
        }
      }

      const patient = log.patient || log.subscriber
      if (patient) {
        const subId = patient.member_id || patient.id || patient.subscriber_id
        if (subId) {
          formik.setFieldValue('subscriberId', String(subId))
        }

        const patientName = patient.name
        if (patientName) {
          const nameParts = splitName(patientName)
          formik.setFieldValue('lastName', nameParts.lastName)
          formik.setFieldValue('firstName', nameParts.firstName)
        }

        if (patient.dob) {
          formik.setFieldValue('dob', patient.dob)
        }

        if (patient.gender) {
          const gender = String(patient.gender).toUpperCase()
          if (gender.startsWith('M')) {
            formik.setFieldValue('gender', 'M')
          } else if (gender.startsWith('F')) {
            formik.setFieldValue('gender', 'F')
          } else {
            formik.setFieldValue('gender', 'O')
          }
        }

        const relationshipCode = log.coverage?.relationship_code || patient.relationship_code
        if (relationshipCode) {
          formik.setFieldValue('relationshipCode', String(relationshipCode))
        }
      }

      if (log.service_date || log.serviceDate) {
        formik.setFieldValue('serviceDate', log.service_date || log.serviceDate)
      }

      if (log.service_type_code || log.serviceTypeCode || log.service_type || log.serviceType) {
        formik.setFieldValue(
          'serviceType',
          String(
            log.service_type_code || log.serviceTypeCode || log.service_type || log.serviceType
          )
        )
      }

      if (log.place_of_service || log.placeOfService || log.pos) {
        formik.setFieldValue(
          'placeOfService',
          String(log.place_of_service || log.placeOfService || log.pos)
        )
      }
    }
  }, [currentLog, logId, availityPayers, payersLoading])

  useEffect(() => {
    if (error) {
      setReuseError(true)
      setReuseErrorMsg(error)
    }
  }, [error])

  const handleReuse = async () => {
    setReuseError(false)
    setReuseErrorMsg('')
    dispatch(clearEligibilityIndivitualError())

    if (!formik.values.npi || !formik.values.practiceLastName || !formik.values.practiceFirstName) {
      setReuseError(true)
      setReuseErrorMsg(
        'Please fill in all practice fields (NPI, Practice Last Name, Practice First Name) before saving.'
      )
      return
    }

    try {
      await dispatch(
        saveEligibilityIndivitualNpiPractice({
          npi: formik.values.npi,
          practiceLastName: formik.values.practiceLastName,
          practiceFirstName: formik.values.practiceFirstName,
        })
      ).unwrap()
      setReuseError(false)
      setReuseErrorMsg('')
    } catch (err: any) {
      setReuseError(true)
      setReuseErrorMsg(err || 'An error occurred while saving the practice data.')
    }
  }

  const handleResetPractice = () => {
    formik.setFieldValue('npi', '')
    formik.setFieldValue('practiceLastName', '')
    formik.setFieldValue('practiceFirstName', '')
    formik.setFieldTouched('npi', false)
    formik.setFieldTouched('practiceLastName', false)
    formik.setFieldTouched('practiceFirstName', false)
    setReuseError(false)
    setReuseErrorMsg('')
  }

  const handleVerifyNpi = async () => {
    const npi = formik.values.npi?.trim()

    if (!npi) {
      toastManager.error('Please enter an NPI number')
      return
    }

    if (!/^\d+$/.test(npi)) {
      toastManager.error('NPI must contain only numbers')
      return
    }

    setVerifyingNpi(true)
    try {
      const response = await EligibilityIndivitualService.verifyNpiNumber(npi)
      const data = response.data?.data || response.data

      if (data) {
        let practiceFirstName = ''
        let practiceLastName = ''

        if (data.first_name || data.last_name) {
          practiceFirstName = data.first_name || ''
          practiceLastName = data.last_name || ''
        } else if (data.practice_first_name || data.practice_last_name) {
          practiceFirstName = data.practice_first_name || ''
          practiceLastName = data.practice_last_name || ''
        } else if (data.name || data.practice_name || data.full_name || data.organization_name) {
          const practiceName =
            data.name || data.practice_name || data.full_name || data.organization_name || ''
          if (practiceName) {
            const nameParts = splitName(practiceName)
            practiceFirstName = nameParts.firstName
            practiceLastName = nameParts.lastName
          }
        }

        if (practiceFirstName || practiceLastName) {
          formik.setFieldValue('practiceFirstName', practiceFirstName)
          formik.setFieldValue('practiceLastName', practiceLastName)
          toastManager.success('NPI verified successfully')
        } else {
          toastManager.error('No practice name found for this NPI')
        }
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to verify NPI. Please try again.'
      toastManager.error(errorMessage)
    } finally {
      setVerifyingNpi(false)
    }
  }

  if (logId && fetchLogLoading) {
    return <ComponentLoader component="eligibility log data" />
  }

  return (
    <PageTransition>
      <div className="flex flex-col justify-center bg-gray-100 p-6">
        <div className="w-full bg-white shadow-lg rounded-xl p-8">
          <h1 className="text-2xl font-bold mb-6">
            {logId ? 'Edit Eligibility Check' : 'Individual Eligibility Check'}
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

            <div className="mb-8 pb-6 border-b">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Payer</h2>
              <div className="mb-6 max-w-md">
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Payer ID <span className="text-red-500">*</span>
                </label>
                <SearchableSelectPayer
                  name="payerId"
                  value={formik.values.payerId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Select Payer"
                  error={!!(formik.touched.payerId && formik.errors.payerId)}
                  searchResults={availityPayers}
                  loading={payersLoading}
                />
                {formik.touched.payerId && formik.errors.payerId && (
                  <p className="text-red-600 text-sm mt-1">{formik.errors.payerId}</p>
                )}
              </div>
            </div>

            <div className="mb-8 pb-6 border-b">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Practice</h2>
              {reuseErrorMsg && (
                <div
                  className={`mb-4 p-4 rounded-lg ${
                    reuseError ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  <span>{reuseErrorMsg}</span>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    NPI <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="npi"
                      placeholder="NPI"
                      autoComplete="off"
                      onChange={e => {
                        const value = e.target.value.replace(/\D/g, '')
                        formik.setFieldValue('npi', value)
                      }}
                      onBlur={formik.handleBlur}
                      value={formik.values.npi}
                      className={`w-full px-4 py-2 pr-24 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                        formik.touched.npi && formik.errors.npi
                          ? 'border-red-500 focus:ring-red-400'
                          : 'border-gray-300 focus:ring-blue-400'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleVerifyNpi}
                      disabled={verifyingNpi || !formik.values.npi}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Verify NPI"
                    >
                      {verifyingNpi ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        'Verify'
                      )}
                    </button>
                  </div>
                  {formik.touched.npi && formik.errors.npi && (
                    <p className="text-red-600 text-sm mt-1">{formik.errors.npi}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Practice Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="practiceLastName"
                    placeholder="Practice Last Name"
                    autoComplete="off"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.practiceLastName}
                    className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                      formik.touched.practiceLastName && formik.errors.practiceLastName
                        ? 'border-red-500 focus:ring-red-400'
                        : 'border-gray-300 focus:ring-blue-400'
                    }`}
                  />
                  {formik.touched.practiceLastName && formik.errors.practiceLastName && (
                    <p className="text-red-600 text-sm mt-1">{formik.errors.practiceLastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Practice First Name
                  </label>
                  <input
                    type="text"
                    name="practiceFirstName"
                    placeholder="Practice First Name"
                    autoComplete="off"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.practiceFirstName}
                    className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                      formik.touched.practiceFirstName && formik.errors.practiceFirstName
                        ? 'border-red-500 focus:ring-red-400'
                        : 'border-gray-300 focus:ring-blue-400'
                    }`}
                  />
                  {formik.touched.practiceFirstName && formik.errors.practiceFirstName && (
                    <p className="text-red-600 text-sm mt-1">{formik.errors.practiceFirstName}</p>
                  )}
                </div>

                <div className="flex items-end gap-2">
                  <button
                    type="button"
                    onClick={handleResetPractice}
                    className="flex items-center justify-center px-3 py-[12px] bg-red-600 text-white rounded-md hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-500"
                    title="Reset Practice Fields"
                  >
                    <RotateCw size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={handleReuse}
                    disabled={updateLoading}
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updateLoading ? (
                      <>
                        <span
                          className="spinner-grow spinner-grow-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        <span className="ml-2">Loading...</span>
                      </>
                    ) : (
                      'Reuse'
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Subscriber</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Subscriber ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subscriberId"
                    placeholder="Subscriber ID"
                    autoComplete="off"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.subscriberId}
                    className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                      formik.touched.subscriberId && formik.errors.subscriberId
                        ? 'border-red-500 focus:ring-red-400'
                        : 'border-gray-300 focus:ring-blue-400'
                    }`}
                  />
                  {formik.touched.subscriberId && formik.errors.subscriberId && (
                    <p className="text-red-600 text-sm mt-1">{formik.errors.subscriberId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    autoComplete="off"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.lastName}
                    className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                      formik.touched.lastName && formik.errors.lastName
                        ? 'border-red-500 focus:ring-red-400'
                        : 'border-gray-300 focus:ring-blue-400'
                    }`}
                  />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <p className="text-red-600 text-sm mt-1">{formik.errors.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    autoComplete="off"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.firstName}
                    className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                      formik.touched.firstName && formik.errors.firstName
                        ? 'border-red-500 focus:ring-red-400'
                        : 'border-gray-300 focus:ring-blue-400'
                    }`}
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <p className="text-red-600 text-sm mt-1">{formik.errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Date of Birth (DOB) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dob"
                    max={getDOBMaxDate()}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.dob}
                    className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                      formik.touched.dob && formik.errors.dob
                        ? 'border-red-500 focus:ring-red-400'
                        : 'border-gray-300 focus:ring-blue-400'
                    }`}
                  />
                  {formik.touched.dob && formik.errors.dob && (
                    <p className="text-red-600 text-sm mt-1">{formik.errors.dob}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Gender
                  </label>
                  <SearchableSelect
                    name="gender"
                    value={formik.values.gender}
                    options={genderOptions}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Select Gender"
                    error={!!(formik.touched.gender && formik.errors.gender)}
                    maxVisibleItems={10}
                  />
                  {formik.touched.gender && formik.errors.gender && (
                    <p className="text-red-600 text-sm mt-1">{formik.errors.gender}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Relationship Code
                  </label>
                  <SearchableSelect
                    name="relationshipCode"
                    value={formik.values.relationshipCode}
                    options={relationshipCodeOptions}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Select Relationship"
                    error={!!(formik.touched.relationshipCode && formik.errors.relationshipCode)}
                    maxVisibleItems={15}
                  />
                  {formik.touched.relationshipCode && formik.errors.relationshipCode && (
                    <p className="text-red-600 text-sm mt-1">{formik.errors.relationshipCode}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Service Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="serviceDate"
                    min={serviceDateRestrictions.min}
                    max={serviceDateRestrictions.max}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.serviceDate}
                    className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                      formik.touched.serviceDate && formik.errors.serviceDate
                        ? 'border-red-500 focus:ring-red-400'
                        : 'border-gray-300 focus:ring-blue-400'
                    }`}
                  />
                  {formik.touched.serviceDate && formik.errors.serviceDate && (
                    <p className="text-red-600 text-sm mt-1">{formik.errors.serviceDate}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Selectable range: 1 year and 10 days ago to 2 months in future
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Service Type
                  </label>
                  <SearchableSelect
                    name="serviceType"
                    value={formik.values.serviceType}
                    options={serviceTypeOptions}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Select Service Type"
                    error={!!(formik.touched.serviceType && formik.errors.serviceType)}
                    maxVisibleItems={15}
                  />
                  {formik.touched.serviceType && formik.errors.serviceType && (
                    <p className="text-red-600 text-sm mt-1">{formik.errors.serviceType}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Place of Service <span className="text-red-500">*</span>
                  </label>
                  <SearchableSelect
                    name="placeOfService"
                    value={formik.values.placeOfService}
                    options={placeOfServiceOptions}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Select Place of Service"
                    error={!!(formik.touched.placeOfService && formik.errors.placeOfService)}
                    maxVisibleItems={15}
                  />
                  {formik.touched.placeOfService && formik.errors.placeOfService && (
                    <p className="text-red-600 text-sm mt-1">{formik.errors.placeOfService}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                type="button"
                onClick={() => formik.resetForm()}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
              >
                Reset
              </button>
              <SubmitButton
                type="submit"
                title="Submit Eligibility Check"
                class_name="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                btnLoading={btnLoading || submitLoading}
                callback_event=""
              />
            </div>
          </form>
        </div>
      </div>
    </PageTransition>
  )
}
