'use client'
import React, { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import ComponentLoader from '@/components/ui/loader/component-loader/ComponentLoader'
import {
  fetchCarrierGroupById,
  deleteCarrierGroup,
  clearCurrentCarrierGroup,
  clearCarrierGroupsError,
} from '@/redux/slices/settings/carrier-groups/actions'
import { AppDispatch, RootState } from '@/redux/store'

export default function CarrierGroupDetail() {
  const router = useRouter()
  const params = useParams()
  const carrierGroupId = params?.id as string

  const dispatch = useDispatch<AppDispatch>()
  const {
    currentCarrierGroup,
    fetchCarrierGroupLoading,
    deleteLoading,
    error,
  } = useSelector((state: RootState) => state.carrierGroups)

  // Fetch carrier group data on mount
  useEffect(() => {
    if (carrierGroupId) {
      dispatch(clearCarrierGroupsError())
      dispatch(fetchCarrierGroupById(carrierGroupId))
    }
    return () => {
      dispatch(clearCurrentCarrierGroup())
    }
  }, [dispatch, carrierGroupId])

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
    if (!carrierGroupId) return

    if (confirm('Are you sure you want to delete this carrier group?')) {
      dispatch(clearCarrierGroupsError())
      try {
        await dispatch(deleteCarrierGroup(carrierGroupId)).unwrap()
        router.push('/settings/carrier-group')
      } catch (err: any) {
        alert(err || 'Failed to delete carrier group')
      }
    }
  }

  const handleEdit = () => {
    if (carrierGroupId) {
      router.push(`/settings/carrier-group/edit/${carrierGroupId}`)
    }
  }

  // Prepare detail data from API response
  const getCarrierGroupDetails = () => {
    if (!currentCarrierGroup) return []

    const statusValue =
      typeof currentCarrierGroup.status === 'boolean'
        ? currentCarrierGroup.status
        : currentCarrierGroup.status === 'active' ||
            currentCarrierGroup.status === 'Active' ||
            currentCarrierGroup.isActive ||
            currentCarrierGroup.is_active

    return [
      {
        title: 'Carrier Group Description',
        value:
          currentCarrierGroup.carrier_group_description ||
          currentCarrierGroup.description ||
          'N/A',
      },
      {
        title: 'Carrier Group Code',
        value:
          currentCarrierGroup.carrier_group_code ||
          currentCarrierGroup.code ||
          'N/A',
      },
      {
        title: 'Filling Indicator',
        value:
          currentCarrierGroup.filling_indicator ||
          currentCarrierGroup.fillingIndicator ||
          'N/A',
      },
      {
        title: 'Status',
        value: statusValue ? 'Active' : 'Inactive',
      },
      {
        title: 'Created At',
        value: formatDate(
          currentCarrierGroup.created_at || currentCarrierGroup.createdAt
        ),
      },
      {
        title: 'Updated At',
        value: formatDate(currentCarrierGroup.updated_at),
      },
    ]
  }

  const CARRIER_GROUP_DETAILS = getCarrierGroupDetails()

  if (fetchCarrierGroupLoading) {
    return <ComponentLoader component="carrier group details" variant="card" />
  }

  if (error && !currentCarrierGroup) {
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
        <h1 className="text-2xl font-bold mb-4 pb-3">Carrier Group Details</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6 mb-3">
          {CARRIER_GROUP_DETAILS.map((detail, index) => (
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
