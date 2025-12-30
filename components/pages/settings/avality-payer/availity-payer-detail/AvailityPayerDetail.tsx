'use client'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { PageTransition } from '@/components/providers/page-transition-provider/PageTransitionProvider'
import ComponentLoader from '@/components/ui/loader/component-loader/ComponentLoader'
import ConfirmationModal from '@/components/ui/modal/ConfirmationModal'
import {
  clearAvailityPayersError,
  clearCurrentAvailityPayer,
  deleteAvailityPayer,
  fetchAvailityPayerById,
} from '@/redux/slices/settings/availity-payers/actions'
import { AppDispatch, RootState } from '@/redux/store'
import { themeColors } from '@/theme'

import { getPayerDetails } from './helper/helper'

export default function AvailityPayerDetail() {
  const router = useRouter()
  const params = useParams()
  const payerId = params?.id as string

  const dispatch = useDispatch<AppDispatch>()
  const { currentAvailityPayer, fetchAvailityPayerLoading, deleteLoading, error } = useSelector(
    (state: RootState) => state.availityPayers
  )
  const [deleteModal, setDeleteModal] = useState(false)

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

  const handleDelete = () => {
    if (!payerId) return
    setDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!payerId) return

    dispatch(clearAvailityPayersError())
    try {
      await dispatch(deleteAvailityPayer(payerId)).unwrap()
      router.push('/settings/availity-payer')
    } catch (err: any) {
      setDeleteModal(false)
      alert(err || 'Failed to delete payer')
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
      <div
        className="flex flex-col justify-center p-6 space-y-6"
        style={{ backgroundColor: themeColors.gray[100] }}
      >
        <div className="w-full bg-white shadow-lg rounded-xl p-8">
          <div className="flex flex-col justify-center items-center py-12">
            <div className="mb-4" style={{ color: themeColors.text.error }}>
              {error}
            </div>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 rounded-lg shadow transition"
              style={{
                backgroundColor: themeColors.gray[300],
                color: themeColors.text.secondary,
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = themeColors.gray[400])}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = themeColors.gray[300])}
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
          <h1 className="text-2xl font-bold mb-4 pb-3">Availity Payer Details</h1>

          {error && (
            <div
              className="mb-4 p-4 rounded-lg"
              style={{ backgroundColor: themeColors.red[100], color: themeColors.red[700] }}
            >
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6 mb-3">
            {PAYER_DETAILS.map((detail, index) => (
              <div key={index}>
                <p className="font-semibold mb-1" style={{ color: themeColors.text.muted }}>
                  {detail.title}
                </p>
                <p style={{ color: themeColors.text.secondary }}>{detail.value}</p>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-3 pt-6">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 rounded-lg shadow transition"
              style={{
                backgroundColor: themeColors.gray[300],
                color: themeColors.text.secondary,
              }}
              onMouseEnter={e => {
                if (!e.currentTarget.disabled)
                  e.currentTarget.style.backgroundColor = themeColors.gray[400]
              }}
              onMouseLeave={e => {
                if (!e.currentTarget.disabled)
                  e.currentTarget.style.backgroundColor = themeColors.gray[300]
              }}
              disabled={deleteLoading}
            >
              Go Back
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="text-white px-4 py-2 rounded-lg shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: themeColors.red[600] }}
              onMouseEnter={e => {
                if (!e.currentTarget.disabled)
                  e.currentTarget.style.backgroundColor = themeColors.red[700]
              }}
              onMouseLeave={e => {
                if (!e.currentTarget.disabled)
                  e.currentTarget.style.backgroundColor = themeColors.red[600]
              }}
            >
              {deleteLoading ? 'Deleting...' : 'Delete'}
            </button>
            <button
              onClick={handleEdit}
              disabled={deleteLoading}
              className="text-white px-4 py-2 rounded-lg shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: themeColors.blue[700] }}
              onMouseEnter={e => {
                if (!e.currentTarget.disabled)
                  e.currentTarget.style.backgroundColor = themeColors.blue[700] || '#1e40af'
              }}
              onMouseLeave={e => {
                if (!e.currentTarget.disabled)
                  e.currentTarget.style.backgroundColor = themeColors.blue[700]
              }}
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
          title="Delete Payer"
          message="Are you sure you want to delete this payer?"
          confirmText="Delete"
          cancelText="Cancel"
          confirmButtonClass=""
          isLoading={deleteLoading}
        />
      </div>
    </PageTransition>
  )
}
