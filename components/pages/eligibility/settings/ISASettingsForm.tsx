'use client'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'

import { PageTransition } from '@/components/providers/page-transition-provider/PageTransitionProvider'
import SubmitButton from '@/components/ui/buttons/submit-button/SubmitButton'
import ComponentLoader from '@/components/ui/loader/component-loader/ComponentLoader'
import {
  clearEligibilitySettingsError,
  fetchEligibilitySettings,
  updateEligibilitySettings,
} from '@/redux/slices/eligibility/settings/actions'
import { AppDispatch, RootState } from '@/redux/store'
import { themeColors } from '@/theme'
import type { ISASettingsFormValues } from '@/types'

export default function ISASettingsForm() {
  const dispatch = useDispatch<AppDispatch>()
  const { settings, loading, updateLoading, error } = useSelector(
    (state: RootState) => state.eligibilitySettings
  )

  const [isError, setIsError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const validationSchema = Yup.object({
    idQualifier: Yup.string().required('ID Qualifier is required'),
    authorizationInformationQualifier: Yup.string().required(
      'Authorization information qualifier is required'
    ),
    authorizationInformation: Yup.string()
      .required('Authorization information is required')
      .test(
        'exact-length',
        'Authorization information must be exactly 15 characters',
        (value: any) => value && value.length <= 15
      ),
    securityInformationQualifier: Yup.string().required(
      'Security information qualifier is required'
    ),
    securityInformation: Yup.string()
      .required('Security information is required')
      .test(
        'exact-length',
        'Security information must be exactly 15 characters',
        (value: any) => value && value.length <= 15
      ),
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

  const formik = useFormik<ISASettingsFormValues>({
    initialValues: {
      idQualifier: '',
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
      setIsError(false)
      setErrorMsg('')
      dispatch(clearEligibilitySettingsError())
      try {
        const authInfo = values.authorizationInformation.slice(0, 15)
        const paddedAuthInfo = authInfo.padEnd(15, ' ')

        const securityInfo = values.securityInformation.slice(0, 15)
        const paddedSecurityInfo = securityInfo.padEnd(15, ' ')

        const senderId = values.senderId.slice(0, 15)
        const paddedSenderId = senderId.padEnd(15, ' ')

        const receiverId = values.receiverId.slice(0, 15)
        const paddedReceiverId = receiverId.padEnd(15, ' ')

        const formattedValues = {
          ...values,
          authorizationInformation: paddedAuthInfo,
          securityInformation: paddedSecurityInfo,
          senderId: paddedSenderId,
          receiverId: paddedReceiverId,
        }

        await dispatch(updateEligibilitySettings(formattedValues)).unwrap()
        setIsError(false)
        setErrorMsg('Settings saved successfully!')
      } catch (err: any) {
        setIsError(true)
        setErrorMsg(err || 'An error occurred while saving ISA settings.')
      }
    },
  })

  const handleAuthInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, 15)
    formik.setFieldValue('authorizationInformation', value)
  }

  const handleSecurityInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, 15)
    formik.setFieldValue('securityInformation', value)
  }

  const handleSenderIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, 15)
    formik.setFieldValue('senderId', value)
  }

  const handleReceiverIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, 15)
    formik.setFieldValue('receiverId', value)
  }

  useEffect(() => {
    dispatch(clearEligibilitySettingsError())
    dispatch(fetchEligibilitySettings())
  }, [dispatch])

  useEffect(() => {
    if (settings) {
      const settingsData = (settings as any).data || settings
      const isaData = settingsData.isa || settingsData
      const subscriberData = settingsData.subscriber || {}

      formik.setValues({
        idQualifier: subscriberData.id_qualifier || subscriberData.idQualifier || '',
        authorizationInformationQualifier:
          isaData.authorization_information_qualifier ||
          isaData.authorizationInformationQualifier ||
          '',
        authorizationInformation: (
          isaData.authorization_information ||
          isaData.authorizationInformation ||
          ''
        ).slice(0, 15),
        securityInformationQualifier:
          isaData.security_information_qualifier || isaData.securityInformationQualifier || '',
        securityInformation: (
          isaData.security_information ||
          isaData.securityInformation ||
          ''
        ).slice(0, 15),
        senderQualifier: isaData.sender_qualifier || isaData.senderQualifier || '',
        senderId: (isaData.sender_id || isaData.senderId || '').slice(0, 15),
        receiverQualifier: isaData.receiver_qualifier || isaData.receiverQualifier || '',
        receiverId: (isaData.receiver_id || isaData.receiverId || '').slice(0, 15),
        repetitionSeparator: isaData.repetition_separator || isaData.repetitionSeparator || '',
        controlVersion: isaData.control_version || isaData.controlVersion || '',
        acknowledgmentRequested:
          isaData.acknowledgment_requested || isaData.acknowledgmentRequested || '',
        usageIndicator: isaData.usage_indicator || isaData.usageIndicator || '',
        componentElementSeparator:
          isaData.component_element_separator || isaData.componentElementSeparator || '',
      })
    }
  }, [settings])

  useEffect(() => {
    if (error) {
      setIsError(true)
      setErrorMsg(error)
    }
  }, [error])

  if (loading) {
    return <ComponentLoader component="ISA Settings" message="Loading ISA Settings..." />
  }

  return (
    <PageTransition>
      <div
        className="flex flex-col justify-center p-6"
        style={{ backgroundColor: themeColors.gray[100] }}
      >
        <div className="w-full bg-white shadow-lg rounded-xl p-8">
          <h1 className="text-2xl font-bold mb-6">Eligibility Settings</h1>

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

            <div className="mb-8">
              <h2
                className="text-xl font-semibold mb-4"
                style={{ color: themeColors.text.secondary }}
              >
                Subscriber Settings
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label
                    className="block text-sm font-semibold mb-1"
                    style={{ color: themeColors.text.secondary }}
                  >
                    ID Qualifier
                  </label>
                  <input
                    type="text"
                    name="idQualifier"
                    placeholder="ID Qualifier"
                    autoComplete="off"
                    onChange={formik.handleChange}
                    value={formik.values.idQualifier}
                    className="w-full px-4 py-2 rounded-md border bg-white focus:outline-none focus:ring-2"
                    style={{
                      color: themeColors.text.primary,
                      borderColor:
                        formik.touched.idQualifier && formik.errors.idQualifier
                          ? themeColors.border.error
                          : themeColors.border.default,
                    }}
                    onFocus={e => {
                      e.currentTarget.style.boxShadow = `0 0 0 2px ${formik.touched.idQualifier && formik.errors.idQualifier ? themeColors.border.focusRing.red : themeColors.border.focusRing.blue}`
                    }}
                    onBlur={e => {
                      e.currentTarget.style.boxShadow = ''
                      formik.handleBlur(e)
                    }}
                  />
                  {formik.touched.idQualifier && formik.errors.idQualifier && (
                    <p className="text-sm mt-1" style={{ color: themeColors.text.error }}>
                      {formik.errors.idQualifier}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2
                className="text-xl font-semibold mb-4"
                style={{ color: themeColors.text.secondary }}
              >
                ISA Settings (Interchange Control Header)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label
                    className="block text-sm font-semibold mb-1"
                    style={{ color: themeColors.text.secondary }}
                  >
                    Authorization Information Qualifier
                  </label>
                  <input
                    type="text"
                    name="authorizationInformationQualifier"
                    placeholder="Authorization Information Qualifier"
                    autoComplete="off"
                    onChange={formik.handleChange}
                    value={formik.values.authorizationInformationQualifier}
                    className="w-full px-4 py-2 rounded-md border bg-white focus:outline-none focus:ring-2"
                    style={{
                      color: themeColors.text.primary,
                      borderColor:
                        formik.touched.authorizationInformationQualifier &&
                        formik.errors.authorizationInformationQualifier
                          ? themeColors.border.error
                          : themeColors.border.default,
                    }}
                    onFocus={e => {
                      e.currentTarget.style.boxShadow = `0 0 0 2px ${formik.touched.authorizationInformationQualifier && formik.errors.authorizationInformationQualifier ? themeColors.border.focusRing.red : themeColors.border.focusRing.blue}`
                    }}
                    onBlur={e => {
                      e.currentTarget.style.boxShadow = ''
                      formik.handleBlur(e)
                    }}
                  />
                  {formik.touched.authorizationInformationQualifier &&
                    formik.errors.authorizationInformationQualifier && (
                      <p className="text-sm mt-1" style={{ color: themeColors.text.error }}>
                        {formik.errors.authorizationInformationQualifier}
                      </p>
                    )}
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-1"
                    style={{ color: themeColors.text.secondary }}
                  >
                    Authorization Information (15 spaces)
                  </label>
                  <input
                    type="text"
                    name="authorizationInformation"
                    placeholder="Authorization Information"
                    autoComplete="off"
                    onChange={handleAuthInfoChange}
                    value={formik.values.authorizationInformation.trim()}
                    maxLength={15}
                    className="w-full px-4 py-2 rounded-md border bg-white focus:outline-none focus:ring-2"
                    style={{
                      color: themeColors.text.primary,
                      borderColor:
                        formik.touched.authorizationInformation &&
                        formik.errors.authorizationInformation
                          ? themeColors.border.error
                          : themeColors.border.default,
                    }}
                    onFocus={e => {
                      e.currentTarget.style.boxShadow = `0 0 0 2px ${formik.touched.authorizationInformation && formik.errors.authorizationInformation ? themeColors.border.focusRing.red : themeColors.border.focusRing.blue}`
                    }}
                    onBlur={e => {
                      e.currentTarget.style.boxShadow = ''
                      formik.handleBlur(e)
                    }}
                  />
                  {formik.touched.authorizationInformation &&
                    formik.errors.authorizationInformation && (
                      <p className="text-sm mt-1" style={{ color: themeColors.text.error }}>
                        {formik.errors.authorizationInformation}
                      </p>
                    )}
                  <p className="text-xs mt-1" style={{ color: themeColors.text.muted }}>
                    {formik.values.authorizationInformation.length}/15 characters (will be padded to
                    15 spaces)
                  </p>
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-1"
                    style={{ color: themeColors.text.secondary }}
                  >
                    Security Information Qualifier
                  </label>
                  <input
                    type="text"
                    name="securityInformationQualifier"
                    placeholder="Security Information Qualifier"
                    autoComplete="off"
                    onChange={formik.handleChange}
                    value={formik.values.securityInformationQualifier}
                    className="w-full px-4 py-2 rounded-md border bg-white focus:outline-none focus:ring-2"
                    style={{
                      color: themeColors.text.primary,
                      borderColor:
                        formik.touched.securityInformationQualifier &&
                        formik.errors.securityInformationQualifier
                          ? themeColors.border.error
                          : themeColors.border.default,
                    }}
                    onFocus={e => {
                      e.currentTarget.style.boxShadow = `0 0 0 2px ${formik.touched.securityInformationQualifier && formik.errors.securityInformationQualifier ? themeColors.border.focusRing.red : themeColors.border.focusRing.blue}`
                    }}
                    onBlur={e => {
                      e.currentTarget.style.boxShadow = ''
                      formik.handleBlur(e)
                    }}
                  />
                  {formik.touched.securityInformationQualifier &&
                    formik.errors.securityInformationQualifier && (
                      <p className="text-sm mt-1" style={{ color: themeColors.text.error }}>
                        {formik.errors.securityInformationQualifier}
                      </p>
                    )}
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-1"
                    style={{ color: themeColors.text.secondary }}
                  >
                    Security Information (15 spaces)
                  </label>
                  <input
                    type="text"
                    name="securityInformation"
                    placeholder="Security Information"
                    autoComplete="off"
                    onChange={handleSecurityInfoChange}
                    value={formik.values.securityInformation}
                    maxLength={15}
                    className="w-full px-4 py-2 rounded-md border bg-white focus:outline-none focus:ring-2"
                    style={{
                      color: themeColors.text.primary,
                      borderColor:
                        formik.touched.securityInformation && formik.errors.securityInformation
                          ? themeColors.border.error
                          : themeColors.border.default,
                    }}
                    onFocus={e => {
                      e.currentTarget.style.boxShadow = `0 0 0 2px ${formik.touched.securityInformation && formik.errors.securityInformation ? themeColors.border.focusRing.red : themeColors.border.focusRing.blue}`
                    }}
                    onBlur={e => {
                      e.currentTarget.style.boxShadow = ''
                      formik.handleBlur(e)
                    }}
                  />
                  {formik.touched.securityInformation && formik.errors.securityInformation && (
                    <p className="text-sm mt-1" style={{ color: themeColors.text.error }}>
                      {formik.errors.securityInformation}
                    </p>
                  )}
                  <p className="text-xs mt-1" style={{ color: themeColors.text.muted }}>
                    {formik.values.securityInformation.length}/15 characters (will be padded to 15
                    spaces)
                  </p>
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-1"
                    style={{ color: themeColors.text.secondary }}
                  >
                    Sender Qualifier
                  </label>
                  <input
                    type="text"
                    name="senderQualifier"
                    placeholder="Sender Qualifier"
                    autoComplete="off"
                    onChange={formik.handleChange}
                    value={formik.values.senderQualifier}
                    className="w-full px-4 py-2 rounded-md border bg-white focus:outline-none focus:ring-2"
                    style={{
                      color: themeColors.text.primary,
                      borderColor:
                        formik.touched.senderQualifier && formik.errors.senderQualifier
                          ? themeColors.border.error
                          : themeColors.border.default,
                    }}
                    onFocus={e => {
                      e.currentTarget.style.boxShadow = `0 0 0 2px ${formik.touched.senderQualifier && formik.errors.senderQualifier ? themeColors.border.focusRing.red : themeColors.border.focusRing.blue}`
                    }}
                    onBlur={e => {
                      e.currentTarget.style.boxShadow = ''
                      formik.handleBlur(e)
                    }}
                  />
                  {formik.touched.senderQualifier && formik.errors.senderQualifier && (
                    <p className="text-sm mt-1" style={{ color: themeColors.text.error }}>
                      {formik.errors.senderQualifier}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-1"
                    style={{ color: themeColors.text.secondary }}
                  >
                    Sender ID (max 15 chars)
                  </label>
                  <input
                    type="text"
                    name="senderId"
                    placeholder="Sender ID"
                    autoComplete="off"
                    onChange={handleSenderIdChange}
                    value={formik.values.senderId}
                    maxLength={15}
                    className="w-full px-4 py-2 rounded-md border bg-white focus:outline-none focus:ring-2"
                    style={{
                      color: themeColors.text.primary,
                      borderColor:
                        formik.touched.senderId && formik.errors.senderId
                          ? themeColors.border.error
                          : themeColors.border.default,
                    }}
                    onFocus={e => {
                      e.currentTarget.style.boxShadow = `0 0 0 2px ${formik.touched.senderId && formik.errors.senderId ? themeColors.border.focusRing.red : themeColors.border.focusRing.blue}`
                    }}
                    onBlur={e => {
                      e.currentTarget.style.boxShadow = ''
                      formik.handleBlur(e)
                    }}
                  />
                  {formik.touched.senderId && formik.errors.senderId && (
                    <p className="text-sm mt-1" style={{ color: themeColors.text.error }}>
                      {formik.errors.senderId}
                    </p>
                  )}
                  <p className="text-xs mt-1" style={{ color: themeColors.text.muted }}>
                    {formik.values.senderId.length}/15 characters (will be padded to 15 spaces)
                  </p>
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-1"
                    style={{ color: themeColors.text.secondary }}
                  >
                    Receiver Qualifier
                  </label>
                  <input
                    type="text"
                    name="receiverQualifier"
                    placeholder="Receiver Qualifier"
                    autoComplete="off"
                    onChange={formik.handleChange}
                    value={formik.values.receiverQualifier}
                    className="w-full px-4 py-2 rounded-md border bg-white focus:outline-none focus:ring-2"
                    style={{
                      color: themeColors.text.primary,
                      borderColor:
                        formik.touched.receiverQualifier && formik.errors.receiverQualifier
                          ? themeColors.border.error
                          : themeColors.border.default,
                    }}
                    onFocus={e => {
                      e.currentTarget.style.boxShadow = `0 0 0 2px ${formik.touched.receiverQualifier && formik.errors.receiverQualifier ? themeColors.border.focusRing.red : themeColors.border.focusRing.blue}`
                    }}
                    onBlur={e => {
                      e.currentTarget.style.boxShadow = ''
                      formik.handleBlur(e)
                    }}
                  />
                  {formik.touched.receiverQualifier && formik.errors.receiverQualifier && (
                    <p className="text-sm mt-1" style={{ color: themeColors.text.error }}>
                      {formik.errors.receiverQualifier}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-1"
                    style={{ color: themeColors.text.secondary }}
                  >
                    Receiver ID (max 15 chars)
                  </label>
                  <input
                    type="text"
                    name="receiverId"
                    placeholder="Receiver ID"
                    autoComplete="off"
                    onChange={handleReceiverIdChange}
                    value={formik.values.receiverId}
                    maxLength={15}
                    className="w-full px-4 py-2 rounded-md border bg-white focus:outline-none focus:ring-2"
                    style={{
                      color: themeColors.text.primary,
                      borderColor:
                        formik.touched.receiverId && formik.errors.receiverId
                          ? themeColors.border.error
                          : themeColors.border.default,
                    }}
                    onFocus={e => {
                      e.currentTarget.style.boxShadow = `0 0 0 2px ${formik.touched.receiverId && formik.errors.receiverId ? themeColors.border.focusRing.red : themeColors.border.focusRing.blue}`
                    }}
                    onBlur={e => {
                      e.currentTarget.style.boxShadow = ''
                      formik.handleBlur(e)
                    }}
                  />
                  {formik.touched.receiverId && formik.errors.receiverId && (
                    <p className="text-sm mt-1" style={{ color: themeColors.text.error }}>
                      {formik.errors.receiverId}
                    </p>
                  )}
                  <p className="text-xs mt-1" style={{ color: themeColors.text.muted }}>
                    {formik.values.receiverId.length}/15 characters (will be padded to 15 spaces)
                  </p>
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-1"
                    style={{ color: themeColors.text.secondary }}
                  >
                    Repetition Separator
                  </label>
                  <input
                    type="text"
                    name="repetitionSeparator"
                    placeholder="Repetition Separator"
                    autoComplete="off"
                    onChange={formik.handleChange}
                    value={formik.values.repetitionSeparator}
                    maxLength={1}
                    className="w-full px-4 py-2 rounded-md border bg-white focus:outline-none focus:ring-2"
                    style={{
                      color: themeColors.text.primary,
                      borderColor:
                        formik.touched.repetitionSeparator && formik.errors.repetitionSeparator
                          ? themeColors.border.error
                          : themeColors.border.default,
                    }}
                    onFocus={e => {
                      e.currentTarget.style.boxShadow = `0 0 0 2px ${formik.touched.repetitionSeparator && formik.errors.repetitionSeparator ? themeColors.border.focusRing.red : themeColors.border.focusRing.blue}`
                    }}
                    onBlur={e => {
                      e.currentTarget.style.boxShadow = ''
                      formik.handleBlur(e)
                    }}
                  />
                  {formik.touched.repetitionSeparator && formik.errors.repetitionSeparator && (
                    <p className="text-sm mt-1" style={{ color: themeColors.text.error }}>
                      {formik.errors.repetitionSeparator}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-1"
                    style={{ color: themeColors.text.secondary }}
                  >
                    Control Version
                  </label>
                  <input
                    type="text"
                    name="controlVersion"
                    placeholder="Control Version"
                    autoComplete="off"
                    onChange={formik.handleChange}
                    value={formik.values.controlVersion}
                    className="w-full px-4 py-2 rounded-md border bg-white focus:outline-none focus:ring-2"
                    style={{
                      color: themeColors.text.primary,
                      borderColor:
                        formik.touched.controlVersion && formik.errors.controlVersion
                          ? themeColors.border.error
                          : themeColors.border.default,
                    }}
                    onFocus={e => {
                      e.currentTarget.style.boxShadow = `0 0 0 2px ${formik.touched.controlVersion && formik.errors.controlVersion ? themeColors.border.focusRing.red : themeColors.border.focusRing.blue}`
                    }}
                    onBlur={e => {
                      e.currentTarget.style.boxShadow = ''
                      formik.handleBlur(e)
                    }}
                  />
                  {formik.touched.controlVersion && formik.errors.controlVersion && (
                    <p className="text-sm mt-1" style={{ color: themeColors.text.error }}>
                      {formik.errors.controlVersion}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-1"
                    style={{ color: themeColors.text.secondary }}
                  >
                    Acknowledgment Requested
                  </label>
                  <select
                    name="acknowledgmentRequested"
                    onChange={formik.handleChange}
                    value={formik.values.acknowledgmentRequested}
                    className="w-full px-4 py-2 rounded-md border bg-white focus:outline-none focus:ring-2"
                    style={{
                      color: themeColors.text.primary,
                      borderColor:
                        formik.touched.acknowledgmentRequested &&
                        formik.errors.acknowledgmentRequested
                          ? themeColors.border.error
                          : themeColors.border.default,
                    }}
                    onFocus={e => {
                      e.currentTarget.style.boxShadow = `0 0 0 2px ${formik.touched.acknowledgmentRequested && formik.errors.acknowledgmentRequested ? themeColors.border.focusRing.red : themeColors.border.focusRing.blue}`
                    }}
                    onBlur={e => {
                      e.currentTarget.style.boxShadow = ''
                      formik.handleBlur(e)
                    }}
                  >
                    <option value="">Select Option</option>
                    <option value="0">No Acknowledgment Requested</option>
                    <option value="1">Acknowledgment Requested</option>
                  </select>
                  {formik.touched.acknowledgmentRequested &&
                    formik.errors.acknowledgmentRequested && (
                      <p className="text-sm mt-1" style={{ color: themeColors.text.error }}>
                        {formik.errors.acknowledgmentRequested}
                      </p>
                    )}
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-1"
                    style={{ color: themeColors.text.secondary }}
                  >
                    Usage Indicator
                  </label>
                  <select
                    name="usageIndicator"
                    onChange={formik.handleChange}
                    value={formik.values.usageIndicator}
                    className="w-full px-4 py-2 rounded-md border bg-white focus:outline-none focus:ring-2"
                    style={{
                      color: themeColors.text.primary,
                      borderColor:
                        formik.touched.usageIndicator && formik.errors.usageIndicator
                          ? themeColors.border.error
                          : themeColors.border.default,
                    }}
                    onFocus={e => {
                      e.currentTarget.style.boxShadow = `0 0 0 2px ${formik.touched.usageIndicator && formik.errors.usageIndicator ? themeColors.border.focusRing.red : themeColors.border.focusRing.blue}`
                    }}
                    onBlur={e => {
                      e.currentTarget.style.boxShadow = ''
                      formik.handleBlur(e)
                    }}
                  >
                    <option value="">Select Usage Indicator</option>
                    <option value="P">Production Data</option>
                    <option value="T">Test Data</option>
                  </select>
                  {formik.touched.usageIndicator && formik.errors.usageIndicator && (
                    <p className="text-sm mt-1" style={{ color: themeColors.text.error }}>
                      {formik.errors.usageIndicator}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-1"
                    style={{ color: themeColors.text.secondary }}
                  >
                    Component Element Separator
                  </label>
                  <input
                    type="text"
                    name="componentElementSeparator"
                    placeholder="Component Element Separator"
                    autoComplete="off"
                    onChange={formik.handleChange}
                    value={formik.values.componentElementSeparator}
                    maxLength={1}
                    className="w-full px-4 py-2 rounded-md border bg-white focus:outline-none focus:ring-2"
                    style={{
                      color: themeColors.text.primary,
                      borderColor:
                        formik.touched.componentElementSeparator &&
                        formik.errors.componentElementSeparator
                          ? themeColors.border.error
                          : themeColors.border.default,
                    }}
                    onFocus={e => {
                      e.currentTarget.style.boxShadow = `0 0 0 2px ${formik.touched.componentElementSeparator && formik.errors.componentElementSeparator ? themeColors.border.focusRing.red : themeColors.border.focusRing.blue}`
                    }}
                    onBlur={e => {
                      e.currentTarget.style.boxShadow = ''
                      formik.handleBlur(e)
                    }}
                  />
                  {formik.touched.componentElementSeparator &&
                    formik.errors.componentElementSeparator && (
                      <p className="text-sm mt-1" style={{ color: themeColors.text.error }}>
                        {formik.errors.componentElementSeparator}
                      </p>
                    )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                type="button"
                onClick={() => formik.resetForm()}
                className="px-6 py-2 border rounded-md transition"
                style={{
                  borderColor: themeColors.border.default,
                  color: themeColors.gray[700],
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = themeColors.gray[50])}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                Reset
              </button>
              <SubmitButton
                type="submit"
                title="Save Settings"
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
                btnLoading={updateLoading || loading}
                callback_event=""
              />
            </div>
          </form>
        </div>
      </div>
    </PageTransition>
  )
}
