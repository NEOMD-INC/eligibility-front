'use client'
import React, { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import ComponentLoader from '@/components/ui/loader/component-loader/ComponentLoader'
import {
  fetchCarrierAddressById,
  deleteCarrierAddress,
  clearCurrentCarrierAddress,
  clearCarrierAddressesError,
} from '@/redux/slices/settings/carrier-addresses/actions'
import { AppDispatch, RootState } from '@/redux/store'

export default function CarrierAddressDetail() {
  const router = useRouter()
  const params = useParams()
  const carrierAddressId = params?.id as string

  const dispatch = useDispatch<AppDispatch>()
  const {
    currentCarrierAddress,
    fetchCarrierAddressLoading,
    deleteLoading,
    error,
  } = useSelector((state: RootState) => state.carrierAddresses)

  // Fetch carrier address data on mount
  useEffect(() => {
    if (carrierAddressId) {
      dispatch(clearCarrierAddressesError())
      dispatch(fetchCarrierAddressById(carrierAddressId))
    }
    return () => {
      dispatch(clearCurrentCarrierAddress())
    }
  }, [dispatch, carrierAddressId])

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
    if (!carrierAddressId) return

    if (confirm('Are you sure you want to delete this carrier address?')) {
      dispatch(clearCarrierAddressesError())
      try {
        await dispatch(deleteCarrierAddress(carrierAddressId)).unwrap()
        router.push('/settings/carrier-address')
      } catch (err: any) {
        alert(err || 'Failed to delete carrier address')
      }
    }
  }

  const handleEdit = () => {
    if (carrierAddressId) {
      router.push(`/settings/carrier-address/edit/${carrierAddressId}`)
    }
  }

  // Prepare detail data from API response
  const getCarrierAddressDetails = () => {
    if (!currentCarrierAddress) return []

    return [
      {
        title: 'Carrier Code',
        value:
          currentCarrierAddress.carrier_code ||
          currentCarrierAddress.carrierCode ||
          'N/A',
      },
      {
        title: 'Actual Name',
        value:
          currentCarrierAddress.actual_name ||
          currentCarrierAddress.actualName ||
          'N/A',
      },
      {
        title: 'Address ID',
        value:
          currentCarrierAddress.address_id ||
          currentCarrierAddress.addressId ||
          'N/A',
      },
      {
        title: 'Address Line 1',
        value:
          currentCarrierAddress.address_line1 ||
          currentCarrierAddress.address_line_1 ||
          currentCarrierAddress.addressLine1 ||
          'N/A',
      },
      {
        title: 'City',
        value: currentCarrierAddress.city || 'N/A',
      },
      {
        title: 'State',
        value: currentCarrierAddress.state || 'N/A',
      },
      {
        title: 'Zip Code',
        value:
          currentCarrierAddress.zip_code || currentCarrierAddress.zipCode || 'N/A',
      },
      {
        title: 'Phone Type',
        value:
          currentCarrierAddress.phone_type || currentCarrierAddress.phoneType || 'N/A',
      },
      {
        title: 'Phone Number',
        value:
          currentCarrierAddress.phone_number ||
          currentCarrierAddress.phoneNumber ||
          'N/A',
      },
      {
        title: 'Insurance Department',
        value:
          currentCarrierAddress.insurance_department ||
          currentCarrierAddress.insuranceDepartment ||
          'N/A',
      },
      {
        title: 'Created At',
        value: formatDate(
          currentCarrierAddress.created_at || currentCarrierAddress.createdAt
        ),
      },
      {
        title: 'Updated At',
        value: formatDate(currentCarrierAddress.updated_at),
      },
    ]
  }

  const CARRIER_ADDRESS_DETAILS = getCarrierAddressDetails()

  if (fetchCarrierAddressLoading) {
    return <ComponentLoader component="carrier address details" variant="card" />
  }

  if (error && !currentCarrierAddress) {
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
        <h1 className="text-2xl font-bold mb-4 pb-3">Carrier Address Details</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6 mb-3">
          {CARRIER_ADDRESS_DETAILS.map((detail, index) => (
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
