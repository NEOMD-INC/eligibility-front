'use client'
import { Check, Copy } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { PageTransition } from '@/components/providers/page-transition-provider/PageTransitionProvider'
import ComponentLoader from '@/components/ui/loader/component-loader/ComponentLoader'
import {
  clearCurrentLog,
  clearEligibilityLogsError,
  fetchLogById,
} from '@/redux/slices/logs/eligibility-logs/actions'
import { AppDispatch, RootState } from '@/redux/store'
import { themeColors } from '@/theme'
import { getPlaceOfServiceLabel } from '@/utils/constants/place-of-service'
import { getRelationshipCodeLabel } from '@/utils/constants/relationship-codes'
import { getServiceTypeLabel } from '@/utils/constants/service-types'
import { toastManager } from '@/utils/toast'

export default function EligibilityLogDetail() {
  const router = useRouter()
  const params = useParams()
  const logId = params?.id as string
  const dispatch = useDispatch<AppDispatch>()
  const { currentLog, fetchLogLoading, error } = useSelector(
    (state: RootState) => state.eligibilityLogs
  )
  const [copiedRequest, setCopiedRequest] = useState(false)
  const [copiedResponse, setCopiedResponse] = useState(false)

  useEffect(() => {
    if (logId && logId !== 'undefined') {
      dispatch(clearEligibilityLogsError())
      dispatch(fetchLogById(logId))
    }
    return () => {
      dispatch(clearCurrentLog())
    }
  }, [dispatch, logId])

  if (!logId || logId === 'undefined') {
    return (
      <PageTransition>
        <div className="flex items-center justify-center p-6">
          <div className="text-center">
            <p className="mb-4" style={{ color: themeColors.text.error }}>
              Invalid log ID. Please select a log from the list.
            </p>
            <button
              onClick={() => router.push('/logs')}
              className="px-4 py-2 text-white rounded-md"
              style={{ backgroundColor: themeColors.blue[600] }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = themeColors.blue[700])}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = themeColors.blue[600])}
            >
              Go Back to Logs
            </button>
          </div>
        </div>
      </PageTransition>
    )
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateString
    }
  }

  const getStatusBadge = (status?: string) => {
    if (!status) return null
    let bgColor: string
    let textColor: string

    if (status === 'success' || status === 'completed' || status === 'eligible') {
      bgColor = themeColors.green[100]
      textColor = themeColors.green[600]
    } else if (status === 'failed' || status === 'error' || status === 'not_eligible') {
      bgColor = themeColors.red[100]
      textColor = themeColors.red[700]
    } else if (status === 'pending') {
      bgColor = themeColors.yellow[500] ? '#fef3c7' : '#fef3c7' // yellow-100 equivalent
      textColor = themeColors.yellow[500] || '#92400e' // yellow-800 equivalent
    } else {
      bgColor = themeColors.gray[100]
      textColor = themeColors.gray[800]
    }

    return (
      <span
        className="px-3 py-1 text-sm font-semibold rounded-full"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        {status}
      </span>
    )
  }

  const getValue = (obj: any, ...keys: string[]) => {
    for (const key of keys) {
      if (obj?.[key] !== undefined && obj?.[key] !== null) {
        return obj[key]
      }
    }
    return null
  }

  if (fetchLogLoading) {
    return <ComponentLoader component="eligibility log details" />
  }

  if (error) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center p-6">
          <div className="text-center">
            <p className="mb-4" style={{ color: themeColors.text.error }}>
              {error}
            </p>
            <button
              onClick={() => router.push('/logs')}
              className="px-4 py-2 text-white rounded-md"
              style={{ backgroundColor: themeColors.blue[600] }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = themeColors.blue[700])}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = themeColors.blue[600])}
            >
              Go Back
            </button>
          </div>
        </div>
      </PageTransition>
    )
  }

  if (!currentLog) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center p-6">
          <div className="text-center">
            <p className="mb-4" style={{ color: themeColors.gray[600] }}>
              Log not found
            </p>
            <button
              onClick={() => router.push('/logs')}
              className="px-4 py-2 text-white rounded-md"
              style={{ backgroundColor: themeColors.blue[600] }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = themeColors.blue[700])}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = themeColors.blue[600])}
            >
              Go Back
            </button>
          </div>
        </div>
      </PageTransition>
    )
  }

  const log = currentLog
  const queueStatus = getValue(log, 'queueStatus', 'queue_status', 'status') || 'N/A'
  const eligibilityStatus =
    getValue(log, 'status', 'eligibilityStatus', 'eligibility_status') || 'N/A'
  const neoReferenceId =
    getValue(log, 'neoReferenceId', 'neo_reference_id', 'neoRef', 'neo_ref') || 'N/A'
  const createdAt = getValue(log, 'createdAt', 'created_at', 'created') || null

  const subscriber = log.subscriber
  const subscriberId =
    typeof subscriber === 'object' && subscriber !== null
      ? getValue(subscriber, 'member_id', 'id', 'subscriber_id')
      : getValue(log, 'subscriberId', 'subscriber_id', 'subscriber')
  const subscriberName =
    typeof subscriber === 'object' && subscriber !== null
      ? getValue(subscriber, 'name', 'member_name')
      : null
  const subscriberDob =
    typeof subscriber === 'object' && subscriber !== null
      ? getValue(subscriber, 'dob', 'date_of_birth', 'birth_date')
      : null
  const subscriberGender =
    typeof subscriber === 'object' && subscriber !== null
      ? getValue(subscriber, 'gender', 'sex')
      : null

  const patient = log.patient
  const patientName =
    typeof patient === 'object' && patient !== null ? getValue(patient, 'name') : subscriberName
  const patientDob =
    typeof patient === 'object' && patient !== null
      ? getValue(patient, 'dob', 'date_of_birth', 'birth_date')
      : subscriberDob
  const patientGender =
    typeof patient === 'object' && patient !== null
      ? getValue(patient, 'gender', 'sex')
      : subscriberGender
  const patientAddress =
    typeof patient === 'object' && patient !== null ? getValue(patient, 'address') : null
  const patientCity =
    typeof patient === 'object' && patient !== null ? getValue(patient, 'city') : null
  const patientState =
    typeof patient === 'object' && patient !== null ? getValue(patient, 'state') : null
  const patientZip =
    typeof patient === 'object' && patient !== null ? getValue(patient, 'zip') : null

  const provider = log.provider
  const providerName =
    typeof provider === 'object' && provider !== null
      ? getValue(provider, 'name', 'provider_name')
      : getValue(log, 'providerName', 'provider_name', 'provider', 'response_message')
  const providerNpi =
    typeof provider === 'object' && provider !== null
      ? getValue(provider, 'npi', 'national_provider_id')
      : getValue(log, 'npi', 'national_provider_id')

  // const payer = log.payer
  // const payerName =
  //   typeof payer === 'object' && payer !== null ? getValue(payer, 'name', 'payer_name') : null
  // const payerId =
  //   typeof payer === 'object' && payer !== null ? getValue(payer, 'payer_id', 'id') : null

  const coverage = log.coverage
  const relationshipCode =
    typeof coverage === 'object' && coverage !== null
      ? getValue(coverage, 'relationship_code')
      : typeof patient === 'object' && patient !== null
        ? getValue(patient, 'relationship_code')
        : typeof subscriber === 'object' && subscriber !== null
          ? getValue(subscriber, 'relationship_code', 'relationshipCode')
          : getValue(log, 'relationshipCode', 'relationship_code')
  const relationshipName =
    typeof coverage === 'object' && coverage !== null
      ? getValue(coverage, 'relationship_name')
      : typeof patient === 'object' && patient !== null
        ? getValue(patient, 'relationship_name')
        : null

  const serviceDate = getValue(log, 'serviceDate', 'service_date') || null
  const serviceTypeCode = getValue(
    log,
    'serviceTypeCode',
    'service_type_code',
    'serviceType',
    'service_type'
  )

  const placeOfServiceCode = getValue(log, 'placeOfService', 'place_of_service', 'pos')

  const request270 = log['270_edi_request']
  const response271 = log['271_edi_response']

  const handleCopyRequest = async () => {
    if (!request270) return

    const textToCopy =
      typeof request270 === 'object' ? JSON.stringify(request270, null, 2) : String(request270)

    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopiedRequest(true)
      toastManager.success('Request 270 copied to clipboard')
      setTimeout(() => setCopiedRequest(false), 2000)
    } catch (err) {
      console.log(err)
      toastManager.error('Failed to copy request')
    }
  }

  const handleCopyResponse = async () => {
    if (!response271) return

    const textToCopy =
      typeof response271 === 'object' ? JSON.stringify(response271, null, 2) : String(response271)

    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopiedResponse(true)
      toastManager.success('Response 271 copied to clipboard')
      setTimeout(() => setCopiedResponse(false), 2000)
    } catch (err) {
      console.log(err)
      toastManager.error('Failed to copy response')
    }
  }

  let responseMessage: string | null = null

  const directMessage = getValue(log, 'responseMessage', 'response_message')
  if (directMessage) {
    if (typeof directMessage === 'string') {
      responseMessage = directMessage
    } else if (Array.isArray(directMessage)) {
      responseMessage = directMessage
        .filter((msg: any) => msg && typeof msg === 'string')
        .join('\n')
    } else if (typeof directMessage === 'object') {
      responseMessage = JSON.stringify(directMessage, null, 2)
    } else {
      responseMessage = String(directMessage)
    }
  }

  if (!responseMessage && Array.isArray(log.global_messages) && log.global_messages.length > 0) {
    responseMessage = log.global_messages
      .filter((msg: any) => msg && typeof msg === 'string')
      .join('\n')
  }

  if (!responseMessage && Array.isArray(log.messages) && log.messages.length > 0) {
    responseMessage = log.messages.filter((msg: any) => msg && typeof msg === 'string').join('\n')
  }

  if (!responseMessage && log.benefits) {
    const benefitsMessages: string[] = []

    if (Array.isArray(log.benefits.in_network)) {
      log.benefits.in_network.forEach((benefit: any) => {
        if (Array.isArray(benefit.messages)) {
          benefitsMessages.push(...benefit.messages.filter((m: any) => typeof m === 'string'))
        }
      })
    }

    if (Array.isArray(log.benefits.both_networks)) {
      log.benefits.both_networks.forEach((benefit: any) => {
        if (Array.isArray(benefit.messages)) {
          benefitsMessages.push(...benefit.messages.filter((m: any) => typeof m === 'string'))
        }
      })
    }

    if (benefitsMessages.length > 0) {
      responseMessage = [...new Set(benefitsMessages)].join('\n')
    }
  }

  return (
    <PageTransition>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: themeColors.text.primary }}>
              Eligibility Log Details
            </h1>
            <p className="mt-1 text-sm" style={{ color: themeColors.text.muted }}>
              View detailed information about the eligibility check
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border rounded-md transition"
            style={{
              borderColor: themeColors.border.default,
              color: themeColors.gray[700],
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = themeColors.gray[50])}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Back
          </button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div
            className="px-6 py-4 border-b"
            style={{
              backgroundColor: themeColors.gray[50],
              borderColor: themeColors.border.default,
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-semibold mb-1"
                  style={{ color: themeColors.gray[700] }}
                >
                  Queue Status
                </label>
                {getStatusBadge(queueStatus)}
              </div>
              <div>
                <label
                  className="block text-sm font-semibold mb-1"
                  style={{ color: themeColors.gray[700] }}
                >
                  Eligibility Status
                </label>
                {getStatusBadge(eligibilityStatus)}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-b" style={{ borderColor: themeColors.border.default }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: themeColors.text.primary }}>
              Request Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-semibold mb-1"
                  style={{ color: themeColors.gray[700] }}
                >
                  Neo Reference ID
                </label>
                <p style={{ color: themeColors.text.primary }}>{neoReferenceId}</p>
              </div>
              <div>
                <label
                  className="block text-sm font-semibold mb-1"
                  style={{ color: themeColors.gray[700] }}
                >
                  Created At
                </label>
                <p style={{ color: themeColors.text.primary }}>{formatDate(createdAt)}</p>
              </div>
            </div>
          </div>

          <div
            className="px-6 py-4 border-b"
            style={{
              backgroundColor: themeColors.gray[50],
              borderColor: themeColors.border.default,
            }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: themeColors.text.primary }}>
              Service Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-semibold mb-1"
                  style={{ color: themeColors.gray[700] }}
                >
                  Service Date
                </label>
                <p style={{ color: themeColors.text.primary }}>{formatDate(serviceDate)}</p>
              </div>
              <div>
                <label
                  className="block text-sm font-semibold mb-1"
                  style={{ color: themeColors.gray[700] }}
                >
                  Service Type
                </label>
                <p style={{ color: themeColors.text.primary }}>
                  {serviceTypeCode ? getServiceTypeLabel(String(serviceTypeCode)) : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-b" style={{ borderColor: themeColors.border.default }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: themeColors.text.primary }}>
              Subscriber Info
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label
                  className="block text-sm font-semibold mb-1"
                  style={{ color: themeColors.gray[700] }}
                >
                  Subscriber ID
                </label>
                <p style={{ color: themeColors.text.primary }}>{subscriberId || 'N/A'}</p>
              </div>
              <div>
                <label
                  className="block text-sm font-semibold mb-1"
                  style={{ color: themeColors.gray[700] }}
                >
                  Name
                </label>
                <p style={{ color: themeColors.text.primary }}>
                  {patientName || subscriberName || 'N/A'}
                </p>
              </div>
              <div>
                <label
                  className="block text-sm font-semibold mb-1"
                  style={{ color: themeColors.gray[700] }}
                >
                  DOB
                </label>
                <p style={{ color: themeColors.text.primary }}>
                  {formatDate(patientDob || subscriberDob)}
                </p>
              </div>
              <div>
                <label
                  className="block text-sm font-semibold mb-1"
                  style={{ color: themeColors.gray[700] }}
                >
                  Gender
                </label>
                <p style={{ color: themeColors.text.primary }}>
                  {patientGender || subscriberGender || 'N/A'}
                </p>
              </div>
              <div>
                <label
                  className="block text-sm font-semibold mb-1"
                  style={{ color: themeColors.gray[700] }}
                >
                  Relationship
                </label>
                <p style={{ color: themeColors.text.primary }}>
                  {relationshipName ||
                    (relationshipCode ? getRelationshipCodeLabel(String(relationshipCode)) : 'N/A')}
                </p>
              </div>
              {(patientAddress || patientCity || patientState || patientZip) && (
                <div className="md:col-span-2 lg:col-span-3">
                  <label
                    className="block text-sm font-semibold mb-1"
                    style={{ color: themeColors.gray[700] }}
                  >
                    Address
                  </label>
                  <p style={{ color: themeColors.text.primary }}>
                    {[patientAddress, patientCity, patientState, patientZip]
                      .filter(Boolean)
                      .join(', ') || 'N/A'}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div
            className="px-6 py-4 border-b"
            style={{
              backgroundColor: themeColors.gray[50],
              borderColor: themeColors.border.default,
            }}
          >
            <h2 className="text-lg font-semibold mb-4" style={{ color: themeColors.text.primary }}>
              Provider Info
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  className="block text-sm font-semibold mb-1"
                  style={{ color: themeColors.gray[700] }}
                >
                  Provider Name
                </label>
                <p style={{ color: themeColors.text.primary }}>{providerName || 'N/A'}</p>
              </div>
              <div>
                <label
                  className="block text-sm font-semibold mb-1"
                  style={{ color: themeColors.gray[700] }}
                >
                  NPI
                </label>
                <p style={{ color: themeColors.text.primary }}>{providerNpi || 'N/A'}</p>
              </div>
              <div>
                <label
                  className="block text-sm font-semibold mb-1"
                  style={{ color: themeColors.gray[700] }}
                >
                  Place of Service
                </label>
                <p style={{ color: themeColors.text.primary }}>
                  {placeOfServiceCode ? getPlaceOfServiceLabel(String(placeOfServiceCode)) : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-b" style={{ borderColor: themeColors.border.default }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: themeColors.text.primary }}>
              Response and Information
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label
                  className="block text-sm font-semibold mb-1"
                  style={{ color: themeColors.gray[700] }}
                >
                  Response Message
                </label>
                <div
                  className="border rounded-lg p-4"
                  style={{
                    backgroundColor: themeColors.gray[50],
                    borderColor: themeColors.border.default,
                  }}
                >
                  {responseMessage ? (
                    <p
                      className="whitespace-pre-wrap break-words"
                      style={{ color: themeColors.text.primary }}
                    >
                      {typeof responseMessage === 'object'
                        ? JSON.stringify(responseMessage, null, 2)
                        : String(responseMessage)}
                    </p>
                  ) : (
                    <p style={{ color: themeColors.text.muted }}>No response message available</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold" style={{ color: themeColors.text.primary }}>
                    Request 270
                  </h2>
                  {request270 && (
                    <button
                      onClick={handleCopyRequest}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-white rounded-md focus:outline-none focus:ring-2 transition"
                      style={{ backgroundColor: themeColors.blue[600] }}
                      onMouseEnter={e =>
                        (e.currentTarget.style.backgroundColor = themeColors.blue[700])
                      }
                      onMouseLeave={e =>
                        (e.currentTarget.style.backgroundColor = themeColors.blue[600])
                      }
                      onFocus={e =>
                        (e.currentTarget.style.boxShadow = `0 0 0 2px ${themeColors.blue[400]}`)
                      }
                      title="Copy Request 270"
                    >
                      {copiedRequest ? (
                        <>
                          <Check size={16} />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
                <div
                  className="border rounded-lg p-4 min-h-[200px]"
                  style={{
                    backgroundColor: themeColors.gray[50],
                    borderColor: themeColors.border.default,
                  }}
                >
                  {request270 ? (
                    <div className="space-y-2">
                      {typeof request270 === 'string' &&
                      (request270.startsWith('http://') || request270.startsWith('https://')) ? (
                        <a
                          href={request270}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline break-all"
                          style={{ color: themeColors.text.link }}
                          onMouseEnter={e => (e.currentTarget.style.color = themeColors.blue[700])}
                          onMouseLeave={e => (e.currentTarget.style.color = themeColors.text.link)}
                        >
                          {request270}
                        </a>
                      ) : (
                        <pre
                          className="text-sm whitespace-pre-wrap break-words"
                          style={{ color: themeColors.gray[700] }}
                        >
                          {typeof request270 === 'object'
                            ? JSON.stringify(request270, null, 2)
                            : String(request270)}
                        </pre>
                      )}
                    </div>
                  ) : (
                    <p style={{ color: themeColors.text.muted }}>No request data available</p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold" style={{ color: themeColors.text.primary }}>
                    Response 271
                  </h2>
                  {response271 && (
                    <button
                      onClick={handleCopyResponse}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-white rounded-md focus:outline-none focus:ring-2 transition"
                      style={{ backgroundColor: themeColors.blue[600] }}
                      onMouseEnter={e =>
                        (e.currentTarget.style.backgroundColor = themeColors.blue[700])
                      }
                      onMouseLeave={e =>
                        (e.currentTarget.style.backgroundColor = themeColors.blue[600])
                      }
                      onFocus={e =>
                        (e.currentTarget.style.boxShadow = `0 0 0 2px ${themeColors.blue[400]}`)
                      }
                      title="Copy Response 271"
                    >
                      {copiedResponse ? (
                        <>
                          <Check size={16} />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
                <div
                  className="border rounded-lg p-4 min-h-[200px]"
                  style={{
                    backgroundColor: themeColors.gray[50],
                    borderColor: themeColors.border.default,
                  }}
                >
                  {response271 ? (
                    <div className="space-y-2">
                      {typeof response271 === 'string' &&
                      (response271.startsWith('http://') || response271.startsWith('https://')) ? (
                        <a
                          href={response271}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline break-all"
                          style={{ color: themeColors.text.link }}
                          onMouseEnter={e => (e.currentTarget.style.color = themeColors.blue[700])}
                          onMouseLeave={e => (e.currentTarget.style.color = themeColors.text.link)}
                        >
                          {response271}
                        </a>
                      ) : (
                        <pre
                          className="text-sm whitespace-pre-wrap break-words"
                          style={{ color: themeColors.gray[700] }}
                        >
                          {typeof response271 === 'object'
                            ? JSON.stringify(response271, null, 2)
                            : String(response271)}
                        </pre>
                      )}
                    </div>
                  ) : (
                    <p style={{ color: themeColors.text.muted }}>No response data available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
