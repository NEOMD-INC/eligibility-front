'use client'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { PageTransition } from '@/components/providers/page-transition-provider/PageTransitionProvider'
import ComponentLoader from '@/components/ui/loader/component-loader/ComponentLoader'
import ConfirmationModal from '@/components/ui/modal/ConfirmationModal'
import {
  clearCarrierAddressesError,
  clearCurrentCarrierAddress,
  deleteCarrierAddress,
  fetchCarrierAddressById,
} from '@/redux/slices/settings/carrier-addresses/actions'
import { AppDispatch, RootState } from '@/redux/store'

import { getCarrierAddressDetails } from './helper/helper'

export default function CarrierAddressDetail() {
  const router = useRouter()
  const params = useParams()
  const carrierAddressId = params?.id as string

  const dispatch = useDispatch<AppDispatch>()
  const { currentCarrierAddress, fetchCarrierAddressLoading, deleteLoading, error } = useSelector(
    (state: RootState) => state.carrierAddresses
  )
  const [deleteModal, setDeleteModal] = useState(false)

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

  const handleDelete = () => {
    if (!carrierAddressId) return
    setDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!carrierAddressId) return

    dispatch(clearCarrierAddressesError())
    try {
      await dispatch(deleteCarrierAddress(carrierAddressId)).unwrap()
      router.push('/settings/carrier-address')
    } catch (err: any) {
      setDeleteModal(false)
      alert(err || 'Failed to delete carrier address')
    }
  }

  const handleEdit = () => {
    if (carrierAddressId) {
      router.push(`/settings/carrier-address/edit/${carrierAddressId}`)
    }
  }

  const CARRIER_ADDRESS_DETAILS = getCarrierAddressDetails(currentCarrierAddress)

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
    <PageTransition>
      <div className="flex flex-col justify-center bg-gray-100 p-6 space-y-6 relative">
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

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={deleteModal}
          onClose={() => setDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Carrier Address"
          message="Are you sure you want to delete this carrier address?"
          confirmText="Delete"
          cancelText="Cancel"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
          isLoading={deleteLoading}
        />
      </div>
    </PageTransition>
  )
}
