'use client'
import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import SubmitButton from '@/components/ui/buttons/submit-button/SubmitButton'

interface IndividualEligibilityValues {
  // Payer Section
  payerId: string
  // Practice Section
  npi: string
  practiceLastName: string
  practiceFirstName: string
  // Subscriber Section
  subscriberId: string
  lastName: string
  firstName: string
  dob: string
  gender: string
  relationshipCode: string
  serviceDate: string
  serviceType: string
  placeOfService: string
}

// Dummy payer data
const dummyPayers = [
  { id: '1', name: 'Blue Cross Blue Shield', code: 'BCBS001' },
  { id: '2', name: 'UnitedHealthcare', code: 'UHC001' },
  { id: '3', name: 'Aetna Insurance', code: 'AET001' },
  { id: '4', name: 'Cigna Health', code: 'CIG001' },
  { id: '5', name: 'Humana', code: 'HUM001' },
]

export default function IndividualEligibilityForm() {
  const [btnLoading, setBtnLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Helper function to get date restrictions for DOB
  const getDOBMaxDate = () => {
    const today = new Date()
    today.setDate(today.getDate() - 1) // Yesterday (current date and future dates unselectable)
    return today.toISOString().split('T')[0]
  }

  // Helper function to get date restrictions for Service Date
  const getServiceDateMinMax = () => {
    const today = new Date()
    const oneYearAndTenDaysAgo = new Date(today)
    oneYearAndTenDaysAgo.setFullYear(today.getFullYear() - 1)
    oneYearAndTenDaysAgo.setDate(oneYearAndTenDaysAgo.getDate() - 10) // 1 year and 10 days ago

    const twoMonthsFuture = new Date(today)
    twoMonthsFuture.setMonth(today.getMonth() + 2) // 2 months in future

    return {
      min: oneYearAndTenDaysAgo.toISOString().split('T')[0],
      max: twoMonthsFuture.toISOString().split('T')[0],
    }
  }

  const serviceDateRestrictions = getServiceDateMinMax()

  // Validation Schema
  const validationSchema = Yup.object({
    payerId: Yup.string().required('Payer ID is required'),
    npi: Yup.string().required('NPI is required'),
    practiceLastName: Yup.string().required('Practice last name is required'),
    practiceFirstName: Yup.string().required('Practice first name is required'),
    subscriberId: Yup.string().required('Subscriber ID is required'),
    lastName: Yup.string().required('Last name is required'),
    firstName: Yup.string().required('First name is required'),
    dob: Yup.date()
      .required('Date of birth is required')
      .max(new Date(), 'Date of birth cannot be today or in the future'),
    gender: Yup.string().required('Gender is required'),
    relationshipCode: Yup.string().required('Relationship code is required'),
    serviceDate: Yup.date()
      .required('Service date is required')
      .min(
        new Date(serviceDateRestrictions.min),
        'Service date must be within the allowed range'
      )
      .max(
        new Date(serviceDateRestrictions.max),
        'Service date must be within the allowed range'
      ),
    serviceType: Yup.string().required('Service type is required'),
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
      relationshipCode: '',
      serviceDate: '',
      serviceType: '',
      placeOfService: '',
    },
    validationSchema,
    onSubmit: async values => {
      setBtnLoading(true)
      setIsError(false)
      try {
        console.log('Individual Eligibility Values:', values)
        // TODO: Add API call to submit eligibility check
        // await submitEligibilityCheck(values)
        setTimeout(() => {
          setBtnLoading(false)
          // Handle success
        }, 1000)
      } catch (err: any) {
        setBtnLoading(false)
        setIsError(true)
        setErrorMsg(err.message || 'An error occurred while submitting the eligibility check.')
      }
    },
  })

  const handleReuse = () => {
    // TODO: Implement reuse logic - fetch previous practice data
    console.log('Reuse practice data')
  }

  return (
    <div className="flex flex-col justify-center bg-gray-100 p-6">
      <div className="w-full bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-6">Individual Eligibility Check</h1>

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

          {/* Payer Section */}
          <div className="mb-8 pb-6 border-b">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Payer</h2>
            <div className="mb-6 max-w-md">
              <label className="block text-sm font-semibold text-gray-800 mb-1">Payer ID</label>
              <select
                name="payerId"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.payerId}
                className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                  formik.touched.payerId && formik.errors.payerId
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-blue-400'
                }`}
              >
                <option value="">Select Payer</option>
                {dummyPayers.map(payer => (
                  <option key={payer.id} value={payer.id}>
                    {payer.name} ({payer.code})
                  </option>
                ))}
              </select>
              {formik.touched.payerId && formik.errors.payerId && (
                <p className="text-red-600 text-sm mt-1">{formik.errors.payerId}</p>
              )}
            </div>
          </div>

          {/* Practice Section */}
          <div className="mb-8 pb-6 border-b">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Practice</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">NPI</label>
                <input
                  type="text"
                  name="npi"
                  placeholder="NPI"
                  autoComplete="off"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.npi}
                  className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                    formik.touched.npi && formik.errors.npi
                      ? 'border-red-500 focus:ring-red-400'
                      : 'border-gray-300 focus:ring-blue-400'
                  }`}
                />
                {formik.touched.npi && formik.errors.npi && (
                  <p className="text-red-600 text-sm mt-1">{formik.errors.npi}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Practice Last Name
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

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleReuse}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Reuse
                </button>
              </div>
            </div>
          </div>

          {/* Subscriber Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Subscriber</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Subscriber ID
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
                <label className="block text-sm font-semibold text-gray-800 mb-1">Last Name</label>
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
                <label className="block text-sm font-semibold text-gray-800 mb-1">First Name</label>
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
                  Date of Birth (DOB)
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
                <label className="block text-sm font-semibold text-gray-800 mb-1">Gender</label>
                <select
                  name="gender"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.gender}
                  className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                    formik.touched.gender && formik.errors.gender
                      ? 'border-red-500 focus:ring-red-400'
                      : 'border-gray-300 focus:ring-blue-400'
                  }`}
                >
                  <option value="">Select Gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
                {formik.touched.gender && formik.errors.gender && (
                  <p className="text-red-600 text-sm mt-1">{formik.errors.gender}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Relationship Code
                </label>
                <select
                  name="relationshipCode"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.relationshipCode}
                  className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                    formik.touched.relationshipCode && formik.errors.relationshipCode
                      ? 'border-red-500 focus:ring-red-400'
                      : 'border-gray-300 focus:ring-blue-400'
                  }`}
                >
                  <option value="">Select Relationship</option>
                  <option value="18">Self</option>
                  <option value="01">Spouse</option>
                  <option value="19">Child</option>
                  <option value="20">Employee</option>
                  <option value="21">Unknown</option>
                </select>
                {formik.touched.relationshipCode && formik.errors.relationshipCode && (
                  <p className="text-red-600 text-sm mt-1">{formik.errors.relationshipCode}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Service Date
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
                <select
                  name="serviceType"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.serviceType}
                  className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                    formik.touched.serviceType && formik.errors.serviceType
                      ? 'border-red-500 focus:ring-red-400'
                      : 'border-gray-300 focus:ring-blue-400'
                  }`}
                >
                  <option value="">Select Service Type</option>
                  <option value="30">Health Benefit Plan Coverage</option>
                  <option value="33">Dental Care</option>
                  <option value="35">Vision Care</option>
                  <option value="47">Hospital</option>
                  <option value="48">Hospital - Inpatient</option>
                  <option value="49">Hospital - Outpatient</option>
                </select>
                {formik.touched.serviceType && formik.errors.serviceType && (
                  <p className="text-red-600 text-sm mt-1">{formik.errors.serviceType}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Place of Service
                </label>
                <select
                  name="placeOfService"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.placeOfService}
                  className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                    formik.touched.placeOfService && formik.errors.placeOfService
                      ? 'border-red-500 focus:ring-red-400'
                      : 'border-gray-300 focus:ring-blue-400'
                  }`}
                >
                  <option value="">Select Place of Service</option>
                  <option value="11">Office</option>
                  <option value="21">Inpatient Hospital</option>
                  <option value="22">Outpatient Hospital</option>
                  <option value="23">Emergency Room - Hospital</option>
                  <option value="24">Ambulatory Surgical Center</option>
                  <option value="31">Skilled Nursing Facility</option>
                  <option value="32">Nursing Facility</option>
                </select>
                {formik.touched.placeOfService && formik.errors.placeOfService && (
                  <p className="text-red-600 text-sm mt-1">{formik.errors.placeOfService}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
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
              btnLoading={btnLoading}
              callback_event=""
            />
          </div>
        </form>
      </div>
    </div>
  )
}

