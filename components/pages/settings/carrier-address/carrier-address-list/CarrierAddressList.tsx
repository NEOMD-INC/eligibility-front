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
            <h1 className="text-2xl font-bold" style={{ color: themeColors.text.primary }}>
              Carrier Addresses
            </h1>
            <p className="mt-1 text-sm" style={{ color: themeColors.text.muted }}>
              Manage carrier addresses and their details
            </p>
          </div>
          <div>
            <div className="flex flex-wrap">
              <Link
                href="/settings/carrier-address/add"
                className="px-4 py-2 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 flex items-center gap-2"
                style={{ backgroundColor: themeColors.blue[600] }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = themeColors.blue[700])}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = themeColors.blue[600])}
                onFocus={e =>
                  (e.currentTarget.style.boxShadow = `0 0 0 2px ${themeColors.blue[400]}`)
                }
              >
                <Plus size={16} />
                Add New Carrier Address
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {error && (
            <div
              className="px-6 py-4 border-b"
              style={{
                backgroundColor: themeColors.red[100],
                color: themeColors.red[700],
                borderColor: themeColors.red[400],
              }}
            >
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

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
                <p style={{ color: themeColors.text.muted }}>No carrier addresses found</p>
              </div>
            }
            className="shadow-none rounded-none"
          />
        </div>

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
