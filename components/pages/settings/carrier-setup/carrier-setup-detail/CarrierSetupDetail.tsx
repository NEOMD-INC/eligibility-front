'use client'
import React, { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import ComponentLoader from '@/components/ui/loader/component-loader/ComponentLoader'
import {
  fetchCarrierSetupById,
  deleteCarrierSetup,
  clearCurrentCarrierSetup,
  clearCarrierSetupsError,
} from '@/redux/slices/settings/carrier-setups/actions'
import { AppDispatch, RootState } from '@/redux/store'

export default function CarrierSetupDetail() {
  const router = useRouter()
  const params = useParams()
  const carrierSetupId = params?.id as string

  const dispatch = useDispatch<AppDispatch>()
  const { currentCarrierSetup, fetchCarrierSetupLoading, deleteLoading, error } = useSelector(
    (state: RootState) => state.carrierSetups
  )

  // Fetch carrier setup data on mount
  useEffect(() => {
    if (carrierSetupId) {
      dispatch(clearCarrierSetupsError())
      dispatch(fetchCarrierSetupById(carrierSetupId))
    }
    return () => {
      dispatch(clearCurrentCarrierSetup())
    }
  }, [dispatch, carrierSetupId])

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    } catch {
      return dateString
    }
  }

  const handleDelete = async () => {
    if (!carrierSetupId) return

    if (confirm('Are you sure you want to delete this carrier setup?')) {
      dispatch(clearCarrierSetupsError())
      try {
        await dispatch(deleteCarrierSetup(carrierSetupId)).unwrap()
        router.push('/settings/carrier-setup')
      } catch (err: any) {
        alert(err || 'Failed to delete carrier setup')
      }
    }
  }

  const handleEdit = () => {
    if (carrierSetupId) {
      router.push(`/settings/carrier-setup/edit/${carrierSetupId}`)
    }
  }

  // Prepare detail data from API response
  const getCarrierSetupDetails = () => {
    if (!currentCarrierSetup) return []

    return [
      {
        title: 'Carrier Group Code',
        value:
          currentCarrierSetup.carrier_group_code || currentCarrierSetup.carrierGroupCode || 'N/A',
      },
      {
        title: 'Group Description',
        value: currentCarrierSetup.carrier_group_description || 'N/A',
      },
      {
        title: 'Carrier Code',
        value: currentCarrierSetup.carrier_code || 'N/A',
      },
      {
        title: 'Carrier Description',
        value: currentCarrierSetup.carrier_description || 'N/A',
      },
      {
        title: 'State',
        value: currentCarrierSetup.state || 'N/A',
      },
      {
        title: 'Batch Payer ID',
        value: currentCarrierSetup.batch_payer_id || 'N/A',
      },
      {
        title: 'Is CLIA',
        value: currentCarrierSetup.is_clia === 0 ? 'false' : 'true' || 'N/A',
      },
      {
        title: 'COB',
        value: currentCarrierSetup.cob || 'N/A',
      },
      {
        title: 'Corrected Claim',
        value: currentCarrierSetup.corrected_claim || 'N/A',
      },
      {
        title: 'Enrollment Required',
        value: currentCarrierSetup.enrollment_required || 'N/A',
      },
      {
        title: 'Created At',
        value: formatDate(currentCarrierSetup.created_at),
      },
      {
        title: 'Updated At',
        value: formatDate(currentCarrierSetup.updated_at),
      },
    ]
  }

  const CARRIER_SETUP_DETAILS = getCarrierSetupDetails()

  if (fetchCarrierSetupLoading) {
    return <ComponentLoader component="carrier setup details" variant="card" />
  }

  if (error && !currentCarrierSetup) {
    return (
      <div className="flex flex-col justify-center bg-gray-100 p-6 space-y-6">
        <div className="w-full bg-white shadow-lg rounded-xl p-8">
          <div className="flex flex-col justify-center items-center py-12">
            <div className="text-red-600 mb-4">{error}</div>
            <button
              onClick={() => router.back()}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-center bg-gray-100 p-6 space-y-6">
      {/* Main Detail Card */}
      <div className="w-full bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-4 pb-3">Carrier Setup Details</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6 mb-3">
          {CARRIER_SETUP_DETAILS.map((detail, index) => (
            <div key={index}>
              <p className="text-gray-500 font-semibold mb-1">{detail.title}</p>
              <p className="text-gray-800">{detail.value}</p>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-3 pt-6">
          <button
            onClick={() => router.back()}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow transition"
            disabled={deleteLoading}
          >
            Go Back
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteLoading}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </button>
          <button
            onClick={handleEdit}
            disabled={deleteLoading}
            className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  )
}
