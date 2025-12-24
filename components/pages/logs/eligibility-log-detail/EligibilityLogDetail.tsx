'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import ComponentLoader from '@/components/ui/loader/component-loader/ComponentLoader'
import { themeColors } from '@/theme'
import { PageTransition } from '@/components/providers/page-transition-provider/PageTransitionProvider'
import {
  fetchLogById,
  clearCurrentLog,
  clearEligibilityLogsError,
} from '@/redux/slices/logs/eligibility-logs/actions'
import { getServiceTypeLabel } from '@/utils/constants/service-types'
import { getRelationshipCodeLabel } from '@/utils/constants/relationship-codes'
import { getPlaceOfServiceLabel } from '@/utils/constants/place-of-service'
import { Copy, Check } from 'lucide-react'
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
            <p className="text-red-600 mb-4">Invalid log ID. Please select a log from the list.</p>
            <button
              onClick={() => router.push('/logs')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
    const statusColor =
      status === 'success' || status === 'completed' || status === 'eligible'
        ? 'bg-green-100 text-green-800'
        : status === 'failed' || status === 'error' || status === 'not_eligible'
          ? 'bg-red-100 text-red-800'
          : status === 'pending'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-gray-100 text-gray-800'
    return (
      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColor}`}>
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
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => router.push('/logs')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
            <p className="text-gray-600 mb-4">Log not found</p>
            <button
              onClick={() => router.push('/logs')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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

  const payer = log.payer
  const payerName =
    typeof payer === 'object' && payer !== null ? getValue(payer, 'name', 'payer_name') : null
  const payerId =
    typeof payer === 'object' && payer !== null ? getValue(payer, 'payer_id', 'id') : null

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
            <h1
              className="text-2xl font-bold text-gray-900"
              style={{ color: themeColors.text.primary }}
            >
              Eligibility Log Details
            </h1>
            <p className="mt-1 text-sm text-gray-500" style={{ color: themeColors.text.muted }}>
              View detailed information about the eligibility check
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
          >
            Back
          </button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Queue Status
                </label>
                {getStatusBadge(queueStatus)}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Eligibility Status
                </label>
                {getStatusBadge(eligibilityStatus)}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Request Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Neo Reference ID
                </label>
                <p className="text-gray-900">{neoReferenceId}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Created At</label>
                <p className="text-gray-900">{formatDate(createdAt)}</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Service Date
                </label>
                <p className="text-gray-900">{formatDate(serviceDate)}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Service Type
                </label>
                <p className="text-gray-900">
                  {serviceTypeCode ? getServiceTypeLabel(String(serviceTypeCode)) : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscriber Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Subscriber ID
                </label>
                <p className="text-gray-900">{subscriberId || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                <p className="text-gray-900">{patientName || subscriberName || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">DOB</label>
                <p className="text-gray-900">{formatDate(patientDob || subscriberDob)}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
                <p className="text-gray-900">{patientGender || subscriberGender || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Relationship
                </label>
                <p className="text-gray-900">
                  {relationshipName ||
                    (relationshipCode ? getRelationshipCodeLabel(String(relationshipCode)) : 'N/A')}
                </p>
              </div>
              {(patientAddress || patientCity || patientState || patientZip) && (
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                  <p className="text-gray-900">
                    {[patientAddress, patientCity, patientState, patientZip]
                      .filter(Boolean)
                      .join(', ') || 'N/A'}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Provider Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Provider Name
                </label>
                <p className="text-gray-900">{providerName || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">NPI</label>
                <p className="text-gray-900">{providerNpi || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Place of Service
                </label>
                <p className="text-gray-900">
                  {placeOfServiceCode ? getPlaceOfServiceLabel(String(placeOfServiceCode)) : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Response and Information</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Response Message
                </label>
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                  {responseMessage ? (
                    <p className="text-gray-900 whitespace-pre-wrap break-words">
                      {typeof responseMessage === 'object'
                        ? JSON.stringify(responseMessage, null, 2)
                        : String(responseMessage)}
                    </p>
                  ) : (
                    <p className="text-gray-500">No response message available</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Request 270</h2>
                  {request270 && (
                    <button
                      onClick={handleCopyRequest}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 min-h-[200px]">
                  {request270 ? (
                    <div className="space-y-2">
                      {typeof request270 === 'string' &&
                      (request270.startsWith('http://') || request270.startsWith('https://')) ? (
                        <a
                          href={request270}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline break-all"
                        >
                          {request270}
                        </a>
                      ) : (
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                          {typeof request270 === 'object'
                            ? JSON.stringify(request270, null, 2)
                            : String(request270)}
                        </pre>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500">No request data available</p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Response 271</h2>
                  {response271 && (
                    <button
                      onClick={handleCopyResponse}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 min-h-[200px]">
                  {response271 ? (
                    <div className="space-y-2">
                      {typeof response271 === 'string' &&
                      (response271.startsWith('http://') || response271.startsWith('https://')) ? (
                        <a
                          href={response271}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline break-all"
                        >
                          {response271}
                        </a>
                      ) : (
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                          {typeof response271 === 'object'
                            ? JSON.stringify(response271, null, 2)
                            : String(response271)}
                        </pre>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500">No response data available</p>
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
