'use client'

import { Plus } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { PageTransition } from '@/components/providers/page-transition-provider/PageTransitionProvider'
import DataTable from '@/components/ui/data-table/DataTable'
import ConfirmationModal from '@/components/ui/modal/ConfirmationModal'
import {
  clearAvailityPayersError,
  deleteAvailityPayer,
  fetchAllAvailityPayers,
  setCurrentPage,
} from '@/redux/slices/settings/availity-payers/actions'
import { AppDispatch, RootState } from '@/redux/store'
import { themeColors } from '@/theme'

import AvailityPayerListColumns from './components/columns'

export default function AvailityPayerList() {
  const dispatch = useDispatch<AppDispatch>()
  const { availityPayers, loading, error, totalItems, currentPage, itemsPerPage, deleteLoading } =
    useSelector((state: RootState) => state.availityPayers)
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    id: string | null
    payerName: string | null
  }>({
    isOpen: false,
    id: null,
    payerName: null,
  })

  useEffect(() => {
    dispatch(clearAvailityPayersError())
    dispatch(fetchAllAvailityPayers(currentPage))
  }, [dispatch, currentPage])

  const handleDeleteClick = (id: string, payerName: string) => {
    setDeleteModal({
      isOpen: true,
      id,
      payerName,
    })
  }

  const handleDeleteConfirm = () => {
    if (!deleteModal.id) return

    dispatch(deleteAvailityPayer(deleteModal.id)).then(() => {
      dispatch(fetchAllAvailityPayers(currentPage))
      setDeleteModal({ isOpen: false, id: null, payerName: null })
    })
  }

  const columns = AvailityPayerListColumns({ onDeleteClick: handleDeleteClick })

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page))
  }

  return (
    <PageTransition>
      <div className="p-6 relative">
        <div className="flex justify-between max-w-auto rounded bg-white p-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: themeColors.text.primary }}>
              Availity Payers
            </h1>
            <p className="mt-1 text-sm" style={{ color: themeColors.text.muted }}>
              Manage availity payers and their details
            </p>
          </div>
          <div>
            <div className="flex flex-wrap">
              <Link
                href="/settings/availity-payer/add"
                className="px-4 py-2 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 flex items-center gap-2"
                style={{ backgroundColor: themeColors.blue[600] }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = themeColors.blue[700])}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = themeColors.blue[600])}
                onFocus={e =>
                  (e.currentTarget.style.boxShadow = `0 0 0 2px ${themeColors.blue[400]}`)
                }
              >
                <Plus size={16} />
                Add New Payer
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
            data={Array.isArray(availityPayers) ? availityPayers : []}
            loading={loading || deleteLoading}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            clientSidePagination={false}
            noDataMessage={
              <div className="text-center py-8">
                <p style={{ color: themeColors.text.muted }}>No payers found</p>
              </div>
            }
            className="shadow-none rounded-none"
          />
        </div>

        <ConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, id: null, payerName: null })}
          onConfirm={handleDeleteConfirm}
          title="Delete Payer"
          message={`Are you sure you want to delete payer "${deleteModal.payerName}"?`}
          confirmText="Delete"
          cancelText="Cancel"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
          isLoading={deleteLoading}
        />
      </div>
    </PageTransition>
  )
}
