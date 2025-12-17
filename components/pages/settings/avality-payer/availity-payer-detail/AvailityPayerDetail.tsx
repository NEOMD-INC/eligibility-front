'use client'
import React, { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import ComponentLoader from '@/components/ui/loader/component-loader/ComponentLoader'
import {
  fetchAvailityPayerById,
  deleteAvailityPayer,
  clearCurrentAvailityPayer,
  clearAvailityPayersError,
} from '@/redux/slices/settings/availity-payers/actions'
import { AppDispatch, RootState } from '@/redux/store'
import { getPayerDetails } from './helper/helper'

export default function AvailityPayerDetail() {
  const router = useRouter()
  const params = useParams()
  const payerId = params?.id as string

  const dispatch = useDispatch<AppDispatch>()
  const { currentAvailityPayer, fetchAvailityPayerLoading, deleteLoading, error } = useSelector(
    (state: RootState) => state.availityPayers
  )

  // Fetch payer data on mount
  useEffect(() => {
    if (payerId) {
      dispatch(clearAvailityPayersError())
      dispatch(fetchAvailityPayerById(payerId))
    }
    return () => {
      dispatch(clearCurrentAvailityPayer())
    }
  }, [dispatch, payerId])

  const handleDelete = async () => {
    if (!payerId) return

    if (confirm('Are you sure you want to delete this payer?')) {
      dispatch(clearAvailityPayersError())
      try {
        await dispatch(deleteAvailityPayer(payerId)).unwrap()
        router.push('/settings/availity-payer')
      } catch (err: any) {
        alert(err || 'Failed to delete payer')
      }
    }
  }

  const handleEdit = () => {
    if (payerId) {
      router.push(`/settings/availity-payer/edit/${payerId}`)
    }
  }

  const PAYER_DETAILS = getPayerDetails(currentAvailityPayer)

  if (fetchAvailityPayerLoading) {
    return <ComponentLoader component="payer details" variant="card" />
  }

  if (error && !currentAvailityPayer) {
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
        <h1 className="text-2xl font-bold mb-4 pb-3">Availity Payer Details</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6 mb-3">
          {PAYER_DETAILS.map((detail, index) => (
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
