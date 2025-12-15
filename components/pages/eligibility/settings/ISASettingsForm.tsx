'use client'
import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import SubmitButton from '@/components/ui/buttons/submit-button/SubmitButton'

interface ISASettingsValues {
  authorizationInformationQualifier: string
  authorizationInformation: string
  securityInformationQualifier: string
  securityInformation: string
  senderQualifier: string
  senderId: string
  receiverQualifier: string
  receiverId: string
  repetitionSeparator: string
  controlVersion: string
  acknowledgmentRequested: string
  usageIndicator: string
  componentElementSeparator: string
}

export default function ISASettingsForm() {
  const [btnLoading, setBtnLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Validation Schema
  const validationSchema = Yup.object({
    authorizationInformationQualifier: Yup.string().required(
      'Authorization information qualifier is required'
    ),
    authorizationInformation: Yup.string()
      .required('Authorization information is required')
      .max(15, 'Authorization information must be exactly 15 characters')
      .min(15, 'Authorization information must be exactly 15 characters'),
    securityInformationQualifier: Yup.string().required(
      'Security information qualifier is required'
    ),
    securityInformation: Yup.string()
      .required('Security information is required')
      .max(15, 'Security information must be exactly 15 characters')
      .min(15, 'Security information must be exactly 15 characters'),
    senderQualifier: Yup.string().required('Sender qualifier is required'),
    senderId: Yup.string()
      .required('Sender ID is required')
      .max(15, 'Sender ID must be maximum 15 characters'),
    receiverQualifier: Yup.string().required('Receiver qualifier is required'),
    receiverId: Yup.string()
      .required('Receiver ID is required')
      .max(15, 'Receiver ID must be maximum 15 characters'),
    repetitionSeparator: Yup.string().required('Repetition separator is required'),
    controlVersion: Yup.string().required('Control version is required'),
    acknowledgmentRequested: Yup.string().required('Acknowledgment requested is required'),
    usageIndicator: Yup.string().required('Usage indicator is required'),
    componentElementSeparator: Yup.string().required('Component element separator is required'),
  })

  const formik = useFormik<ISASettingsValues>({
    initialValues: {
      authorizationInformationQualifier: '',
      authorizationInformation: '',
      securityInformationQualifier: '',
      securityInformation: '',
      senderQualifier: '',
      senderId: '',
      receiverQualifier: '',
      receiverId: '',
      repetitionSeparator: '',
      controlVersion: '',
      acknowledgmentRequested: '',
      usageIndicator: '',
      componentElementSeparator: '',
    },
    validationSchema,
    onSubmit: async values => {
      setBtnLoading(true)
      setIsError(false)
      try {
        // Pad authorization information to 15 spaces if needed
        const paddedAuthInfo = values.authorizationInformation.padEnd(15, ' ')
        // Pad security information to 15 spaces if needed
        const paddedSecurityInfo = values.securityInformation.padEnd(15, ' ')
        // Pad sender ID to 15 chars if needed
        const paddedSenderId = values.senderId.padEnd(15, ' ')
        // Pad receiver ID to 15 chars if needed
        const paddedReceiverId = values.receiverId.padEnd(15, ' ')

        const formattedValues = {
          ...values,
          authorizationInformation: paddedAuthInfo,
          securityInformation: paddedSecurityInfo,
          senderId: paddedSenderId,
          receiverId: paddedReceiverId,
        }

        console.log('ISA Settings Values:', formattedValues)
        // TODO: Add API call to save ISA settings
        // await saveISASettings(formattedValues)
        setTimeout(() => {
          setBtnLoading(false)
          // Handle success
        }, 1000)
      } catch (err: any) {
        setBtnLoading(false)
        setIsError(true)
        setErrorMsg(err.message || 'An error occurred while saving ISA settings.')
      }
    },
  })

  // Handle authorization information input - ensure it's exactly 15 characters
  const handleAuthInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, 15) // Limit to 15 chars
    formik.setFieldValue('authorizationInformation', value.padEnd(15, ' '))
  }

  // Handle security information input - ensure it's exactly 15 characters
  const handleSecurityInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, 15) // Limit to 15 chars
    formik.setFieldValue('securityInformation', value.padEnd(15, ' '))
  }

  // Handle sender ID input - max 15 chars
  const handleSenderIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, 15) // Limit to 15 chars
    formik.setFieldValue('senderId', value)
  }

  // Handle receiver ID input - max 15 chars
  const handleReceiverIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, 15) // Limit to 15 chars
    formik.setFieldValue('receiverId', value)
  }

  return (
    <div className="flex flex-col justify-center bg-gray-100 p-6">
      <div className="w-full bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-6">ISA Settings (Interchange Control Header)</h1>

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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Authorization Information Qualifier */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Authorization Information Qualifier
              </label>
              <input
                type="text"
                name="authorizationInformationQualifier"
                placeholder="Authorization Information Qualifier"
                autoComplete="off"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.authorizationInformationQualifier}
                className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                  formik.touched.authorizationInformationQualifier &&
                  formik.errors.authorizationInformationQualifier
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-blue-400'
                }`}
              />
              {formik.touched.authorizationInformationQualifier &&
                formik.errors.authorizationInformationQualifier && (
                  <p className="text-red-600 text-sm mt-1">
                    {formik.errors.authorizationInformationQualifier}
                  </p>
                )}
            </div>

            {/* Authorization Information */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Authorization Information (15 spaces)
              </label>
              <input
                type="text"
                name="authorizationInformation"
                placeholder="Authorization Information"
                autoComplete="off"
                onChange={handleAuthInfoChange}
                onBlur={formik.handleBlur}
                value={formik.values.authorizationInformation.trim()}
                maxLength={15}
                className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                  formik.touched.authorizationInformation && formik.errors.authorizationInformation
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-blue-400'
                }`}
              />
              {formik.touched.authorizationInformation && formik.errors.authorizationInformation && (
                <p className="text-red-600 text-sm mt-1">
                  {formik.errors.authorizationInformation}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {formik.values.authorizationInformation.length}/15 characters (will be padded)
              </p>
            </div>

            {/* Security Information Qualifier */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Security Information Qualifier
              </label>
              <input
                type="text"
                name="securityInformationQualifier"
                placeholder="Security Information Qualifier"
                autoComplete="off"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.securityInformationQualifier}
                className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                  formik.touched.securityInformationQualifier &&
                  formik.errors.securityInformationQualifier
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-blue-400'
                }`}
              />
              {formik.touched.securityInformationQualifier &&
                formik.errors.securityInformationQualifier && (
                  <p className="text-red-600 text-sm mt-1">
                    {formik.errors.securityInformationQualifier}
                  </p>
                )}
            </div>

            {/* Security Information */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Security Information (15 spaces)
              </label>
              <input
                type="text"
                name="securityInformation"
                placeholder="Security Information"
                autoComplete="off"
                onChange={handleSecurityInfoChange}
                onBlur={formik.handleBlur}
                value={formik.values.securityInformation.trim()}
                maxLength={15}
                className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                  formik.touched.securityInformation && formik.errors.securityInformation
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-blue-400'
                }`}
              />
              {formik.touched.securityInformation && formik.errors.securityInformation && (
                <p className="text-red-600 text-sm mt-1">{formik.errors.securityInformation}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {formik.values.securityInformation.length}/15 characters (will be padded)
              </p>
            </div>

            {/* Sender Qualifier */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Sender Qualifier
              </label>
              <input
                type="text"
                name="senderQualifier"
                placeholder="Sender Qualifier"
                autoComplete="off"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.senderQualifier}
                className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                  formik.touched.senderQualifier && formik.errors.senderQualifier
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-blue-400'
                }`}
              />
              {formik.touched.senderQualifier && formik.errors.senderQualifier && (
                <p className="text-red-600 text-sm mt-1">{formik.errors.senderQualifier}</p>
              )}
            </div>

            {/* Sender ID */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Sender ID (max 15 chars)
              </label>
              <input
                type="text"
                name="senderId"
                placeholder="Sender ID"
                autoComplete="off"
                onChange={handleSenderIdChange}
                onBlur={formik.handleBlur}
                value={formik.values.senderId}
                maxLength={15}
                className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                  formik.touched.senderId && formik.errors.senderId
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-blue-400'
                }`}
              />
              {formik.touched.senderId && formik.errors.senderId && (
                <p className="text-red-600 text-sm mt-1">{formik.errors.senderId}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {formik.values.senderId.length}/15 characters (will be padded)
              </p>
            </div>

            {/* Receiver Qualifier */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Receiver Qualifier
              </label>
              <input
                type="text"
                name="receiverQualifier"
                placeholder="Receiver Qualifier"
                autoComplete="off"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.receiverQualifier}
                className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                  formik.touched.receiverQualifier && formik.errors.receiverQualifier
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-blue-400'
                }`}
              />
              {formik.touched.receiverQualifier && formik.errors.receiverQualifier && (
                <p className="text-red-600 text-sm mt-1">{formik.errors.receiverQualifier}</p>
              )}
            </div>

            {/* Receiver ID */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Receiver ID (max 15 chars)
              </label>
              <input
                type="text"
                name="receiverId"
                placeholder="Receiver ID"
                autoComplete="off"
                onChange={handleReceiverIdChange}
                onBlur={formik.handleBlur}
                value={formik.values.receiverId}
                maxLength={15}
                className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                  formik.touched.receiverId && formik.errors.receiverId
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-blue-400'
                }`}
              />
              {formik.touched.receiverId && formik.errors.receiverId && (
                <p className="text-red-600 text-sm mt-1">{formik.errors.receiverId}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {formik.values.receiverId.length}/15 characters (will be padded)
              </p>
            </div>

            {/* Repetition Separator */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Repetition Separator
              </label>
              <input
                type="text"
                name="repetitionSeparator"
                placeholder="Repetition Separator"
                autoComplete="off"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.repetitionSeparator}
                maxLength={1}
                className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                  formik.touched.repetitionSeparator && formik.errors.repetitionSeparator
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-blue-400'
                }`}
              />
              {formik.touched.repetitionSeparator && formik.errors.repetitionSeparator && (
                <p className="text-red-600 text-sm mt-1">{formik.errors.repetitionSeparator}</p>
              )}
            </div>

            {/* Control Version */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Control Version
              </label>
              <input
                type="text"
                name="controlVersion"
                placeholder="Control Version"
                autoComplete="off"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.controlVersion}
                className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                  formik.touched.controlVersion && formik.errors.controlVersion
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-blue-400'
                }`}
              />
              {formik.touched.controlVersion && formik.errors.controlVersion && (
                <p className="text-red-600 text-sm mt-1">{formik.errors.controlVersion}</p>
              )}
            </div>

            {/* Acknowledgment Requested */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Acknowledgment Requested
              </label>
              <select
                name="acknowledgmentRequested"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.acknowledgmentRequested}
                className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                  formik.touched.acknowledgmentRequested &&
                  formik.errors.acknowledgmentRequested
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-blue-400'
                }`}
              >
                <option value="">Select Option</option>
                <option value="0">No Acknowledgment Requested</option>
                <option value="1">Acknowledgment Requested</option>
              </select>
              {formik.touched.acknowledgmentRequested && formik.errors.acknowledgmentRequested && (
                <p className="text-red-600 text-sm mt-1">
                  {formik.errors.acknowledgmentRequested}
                </p>
              )}
            </div>

            {/* Usage Indicator */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Usage Indicator
              </label>
              <select
                name="usageIndicator"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.usageIndicator}
                className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                  formik.touched.usageIndicator && formik.errors.usageIndicator
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-blue-400'
                }`}
              >
                <option value="">Select Usage Indicator</option>
                <option value="P">Production Data</option>
                <option value="T">Test Data</option>
              </select>
              {formik.touched.usageIndicator && formik.errors.usageIndicator && (
                <p className="text-red-600 text-sm mt-1">{formik.errors.usageIndicator}</p>
              )}
            </div>

            {/* Component Element Separator */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Component Element Separator
              </label>
              <input
                type="text"
                name="componentElementSeparator"
                placeholder="Component Element Separator"
                autoComplete="off"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.componentElementSeparator}
                maxLength={1}
                className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 ${
                  formik.touched.componentElementSeparator &&
                  formik.errors.componentElementSeparator
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-blue-400'
                }`}
              />
              {formik.touched.componentElementSeparator &&
                formik.errors.componentElementSeparator && (
                  <p className="text-red-600 text-sm mt-1">
                    {formik.errors.componentElementSeparator}
                  </p>
                )}
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
              title="Save ISA Settings"
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

