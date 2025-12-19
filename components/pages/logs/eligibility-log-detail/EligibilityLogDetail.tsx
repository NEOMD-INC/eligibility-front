'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { themeColors } from '@/theme'
import { PageTransition } from '@/components/providers/page-transition-provider/PageTransitionProvider'

export default function EligibilityLogDetail() {
  const router = useRouter()

  // Mock data - replace with actual data later
  const log = {
    id: '1',
    queueStatus: 'completed',
    eligibilityStatus: 'eligible',
    eligibilityId: 'ELIG-001',
    neoReferenceId: 'NEO-001',
    createdAt: '2024-01-15T10:30:00',
    serviceDate: '2024-01-15',
    serviceTypeCode: '30',
    subscriberId: 'SUB-12345',
    subscriberName: 'John Doe',
    dob: '1980-05-15',
    gender: 'M',
    relationshipCode: '18',
    providerName: 'Provider ABC',
    npi: '1234567890',
    placeOfService: '11',
    request270: 'https://example.com/request/270',
    response271: 'https://example.com/response/271',
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
          {/* Status Section */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Queue Status
                </label>
                {getStatusBadge(log.queueStatus)}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Eligibility Status
                </label>
                {getStatusBadge(log.eligibilityStatus)}
              </div>
            </div>
          </div>

          {/* Request Information Section */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Request Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Eligibility ID
                </label>
                <p className="text-gray-900">{log.eligibilityId || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Neo Reference ID
                </label>
                <p className="text-gray-900">{log.neoReferenceId || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Created At</label>
                <p className="text-gray-900">{formatDate(log.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Service Information Section */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Service Date
                </label>
                <p className="text-gray-900">{formatDate(log.serviceDate)}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Service Type Code
                </label>
                <p className="text-gray-900">{log.serviceTypeCode || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Subscriber Info Section */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscriber Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Subscriber ID
                </label>
                <p className="text-gray-900">{log.subscriberId || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                <p className="text-gray-900">{log.subscriberName || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">DOB</label>
                <p className="text-gray-900">{formatDate(log.dob)}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
                <p className="text-gray-900">{log.gender || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Relationship Code
                </label>
                <p className="text-gray-900">{log.relationshipCode || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Provider Info Section */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Provider Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Provider Name
                </label>
                <p className="text-gray-900">{log.providerName || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">NPI</label>
                <p className="text-gray-900">{log.npi || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Place of Service
                </label>
                <p className="text-gray-900">{log.placeOfService || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Request 270 and Response 271 Section */}
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Request 270 Box */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Request 270</h2>
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 min-h-[200px]">
                  {log.request270 ? (
                    <div className="space-y-2">
                      <a
                        href={log.request270}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline break-all"
                      >
                        {log.request270}
                      </a>
                    </div>
                  ) : (
                    <p className="text-gray-500">No request URL available</p>
                  )}
                </div>
              </div>

              {/* Response 271 Box */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Response 271</h2>
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 min-h-[200px]">
                  {log.response271 ? (
                    <div className="space-y-2">
                      <a
                        href={log.response271}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline break-all"
                      >
                        {log.response271}
                      </a>
                    </div>
                  ) : (
                    <p className="text-gray-500">No response URL available</p>
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
