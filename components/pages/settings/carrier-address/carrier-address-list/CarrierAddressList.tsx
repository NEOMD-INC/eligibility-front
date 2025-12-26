'use client'

import { Plus } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { PageTransition } from '@/components/providers/page-transition-provider/PageTransitionProvider'
import DataTable from '@/components/ui/data-table/DataTable'
import ConfirmationModal from '@/components/ui/modal/ConfirmationModal'
import {
  clearCarrierAddressesError,
  deleteCarrierAddress,
  fetchAllCarrierAddresses,
  setCurrentPage,
} from '@/redux/slices/settings/carrier-addresses/actions'
import { AppDispatch, RootState } from '@/redux/store'
import { themeColors } from '@/theme'

import CarrierAddressListColumns from './components/columns'

export default function CarrierAddressList() {
  const dispatch = useDispatch<AppDispatch>()
  const { carrierAddresses, loading, error, totalItems, currentPage, itemsPerPage, deleteLoading } =
    useSelector((state: RootState) => state.carrierAddresses)
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    id: string | null
    carrierAddressName: string | null
  }>({
    isOpen: false,
    id: null,
    carrierAddressName: null,
  })

  // Fetch carrier addresses on mount and when page changes
  useEffect(() => {
    dispatch(clearCarrierAddressesError())
    dispatch(fetchAllCarrierAddresses(currentPage))
  }, [dispatch, currentPage])

  const handleDeleteClick = (id: string, carrierAddressName: string) => {
    setDeleteModal({
      isOpen: true,
      id,
      carrierAddressName,
    })
  }

  const handleDeleteConfirm = () => {
    if (!deleteModal.id) return

    dispatch(deleteCarrierAddress(deleteModal.id)).then(() => {
      // Refetch the list after deletion
      dispatch(fetchAllCarrierAddresses(currentPage))
      setDeleteModal({ isOpen: false, id: null, carrierAddressName: null })
    })
  }

  const columns = CarrierAddressListColumns({ onDeleteClick: handleDeleteClick })

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page))
  }

  return (
    <PageTransition>
      <div className="p-6 relative">
        <div className="flex justify-between max-w-auto rounded bg-white p-6">
          <div>
            <h1
              className="text-2xl font-bold text-gray-900"
              style={{ color: themeColors.text.primary }}
            >
              Carrier Addresses
            </h1>
            <p className="mt-1 text-sm text-gray-500" style={{ color: themeColors.text.muted }}>
              Manage carrier addresses and their details
            </p>
          </div>
          <div>
            <div className="flex flex-wrap">
              <Link
                href="/settings/carrier-address/add"
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
              >
                <Plus size={16} />
                Add New Carrier Address
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Error Message */}
          {error && (
            <div className="px-6 py-4 bg-red-100 text-red-700 border-b border-red-200">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* DataTable */}
          <DataTable
            columns={columns}
            data={carrierAddresses}
            loading={loading || deleteLoading}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            clientSidePagination={false}
            noDataMessage={
              <div className="text-center py-8">
                <p className="text-gray-500">No carrier addresses found</p>
              </div>
            }
            className="shadow-none rounded-none"
          />
        </div>

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, id: null, carrierAddressName: null })}
          onConfirm={handleDeleteConfirm}
          title="Delete Carrier Address"
          message={`Are you sure you want to delete carrier address "${deleteModal.carrierAddressName}"?`}
          confirmText="Delete"
          cancelText="Cancel"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
          isLoading={deleteLoading}
        />
      </div>
    </PageTransition>
  )
}
