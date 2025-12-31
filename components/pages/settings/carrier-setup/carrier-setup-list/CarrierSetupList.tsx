'use client'

import { Plus } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { PageTransition } from '@/components/providers/page-transition-provider/PageTransitionProvider'
import DataTable from '@/components/ui/data-table/DataTable'
import ConfirmationModal from '@/components/ui/modal/ConfirmationModal'
import {
  clearCarrierSetupsError,
  deleteCarrierSetup,
  fetchAllCarrierSetups,
  setCurrentPage,
} from '@/redux/slices/settings/carrier-setups/actions'
import { AppDispatch, RootState } from '@/redux/store'
import { themeColors } from '@/theme'

import CarrierSetupListColumns from './components/columns'

export default function CarrierSetupList() {
  const dispatch = useDispatch<AppDispatch>()
  const { carrierSetups, loading, error, totalItems, currentPage, itemsPerPage, deleteLoading } =
    useSelector((state: RootState) => state.carrierSetups)
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    id: string | null
    carrierSetupName: string | null
  }>({
    isOpen: false,
    id: null,
    carrierSetupName: null,
  })

  useEffect(() => {
    dispatch(clearCarrierSetupsError())
    dispatch(fetchAllCarrierSetups(currentPage))
  }, [dispatch, currentPage])

  const handleDeleteClick = (id: string, carrierSetupName: string) => {
    setDeleteModal({
      isOpen: true,
      id,
      carrierSetupName,
    })
  }

  const handleDeleteConfirm = () => {
    if (!deleteModal.id) return

    dispatch(deleteCarrierSetup(deleteModal.id)).then(() => {
      dispatch(fetchAllCarrierSetups(currentPage))
      setDeleteModal({ isOpen: false, id: null, carrierSetupName: null })
    })
  }

  const columns = CarrierSetupListColumns({ onDeleteClick: handleDeleteClick })

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page))
  }

  return (
    <PageTransition>
      <div className="p-6 relative">
        <div className="flex justify-between max-w-auto rounded bg-white p-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: themeColors.text.primary }}>
              Carrier Setup
            </h1>
            <p className="mt-1 text-sm" style={{ color: themeColors.text.muted }}>
              Manage carrier setup configurations
            </p>
          </div>
          <div>
            <div className="flex flex-wrap">
              <Link
                href="/settings/carrier-setup/add"
                className="px-4 py-2 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 flex items-center gap-2"
                style={{ backgroundColor: themeColors.blue[600] }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = themeColors.blue[700])}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = themeColors.blue[600])}
                onFocus={e =>
                  (e.currentTarget.style.boxShadow = `0 0 0 2px ${themeColors.blue[400]}`)
                }
              >
                <Plus size={16} />
                Add New Carrier Setup
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
            data={Array.isArray(carrierSetups) ? carrierSetups : []}
            loading={loading || deleteLoading}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            clientSidePagination={false}
            noDataMessage={
              <div className="text-center py-8">
                <p style={{ color: themeColors.text.muted }}>No carrier setups found</p>
              </div>
            }
            className="shadow-none rounded-none"
          />
        </div>

        <ConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, id: null, carrierSetupName: null })}
          onConfirm={handleDeleteConfirm}
          title="Delete Carrier Setup"
          message={`Are you sure you want to delete carrier setup "${deleteModal.carrierSetupName}"?`}
          confirmText="Delete"
          cancelText="Cancel"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
          isLoading={deleteLoading}
        />
      </div>
    </PageTransition>
  )
}
