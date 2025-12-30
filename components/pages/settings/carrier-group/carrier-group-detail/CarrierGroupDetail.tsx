'use client'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { PageTransition } from '@/components/providers/page-transition-provider/PageTransitionProvider'
import ComponentLoader from '@/components/ui/loader/component-loader/ComponentLoader'
import ConfirmationModal from '@/components/ui/modal/ConfirmationModal'
import {
  clearCarrierGroupsError,
  clearCurrentCarrierGroup,
  deleteCarrierGroup,
  fetchCarrierGroupById,
} from '@/redux/slices/settings/carrier-groups/actions'
import { AppDispatch, RootState } from '@/redux/store'
import { themeColors } from '@/theme'

import { getCarrierGroupDetails } from './helper/helper'

export default function CarrierGroupDetail() {
  const router = useRouter()
  const params = useParams()
  const carrierGroupId = params?.id as string

  const dispatch = useDispatch<AppDispatch>()
  const { currentCarrierGroup, fetchCarrierGroupLoading, deleteLoading, error } = useSelector(
    (state: RootState) => state.carrierGroups
  )
  const [deleteModal, setDeleteModal] = useState(false)

  useEffect(() => {
    if (carrierGroupId) {
      dispatch(clearCarrierGroupsError())
      dispatch(fetchCarrierGroupById(carrierGroupId))
    }
    return () => {
      dispatch(clearCurrentCarrierGroup())
    }
  }, [dispatch, carrierGroupId])

  const handleDelete = () => {
    if (!carrierGroupId) return
    setDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!carrierGroupId) return

    dispatch(clearCarrierGroupsError())
    try {
      await dispatch(deleteCarrierGroup(carrierGroupId)).unwrap()
      router.push('/settings/carrier-group')
    } catch (err: any) {
      setDeleteModal(false)
      alert(err || 'Failed to delete carrier group')
    }
  }

  const handleEdit = () => {
    if (carrierGroupId) {
      router.push(`/settings/carrier-group/edit/${carrierGroupId}`)
    }
  }

  const CARRIER_GROUP_DETAILS = getCarrierGroupDetails(currentCarrierGroup)

  if (fetchCarrierGroupLoading) {
    return <ComponentLoader component="carrier group details" variant="card" />
  }

  if (error && !currentCarrierGroup) {
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
        <div className="w-full bg-white shadow-lg rounded-xl p-8">
          <h1 className="text-2xl font-bold mb-4 pb-3">Carrier Group Details</h1>

          {error && (
            <div
              className="mb-4 p-4 rounded-lg"
              style={{ backgroundColor: themeColors.red[100], color: themeColors.red[700] }}
            >
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6 mb-3">
            {CARRIER_GROUP_DETAILS.map((detail, index) => (
              <div key={index}>
                <p className="font-semibold mb-1" style={{ color: themeColors.text.muted }}>
                  {detail.title}
                </p>
                <p style={{ color: themeColors.text.secondary }}>{detail.value}</p>
              </div>
            ))}
          </div>

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

        <ConfirmationModal
          isOpen={deleteModal}
          onClose={() => setDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Carrier Group"
          message="Are you sure you want to delete this carrier group?"
          confirmText="Delete"
          cancelText="Cancel"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
          isLoading={deleteLoading}
        />
      </div>
    </PageTransition>
  )
}
