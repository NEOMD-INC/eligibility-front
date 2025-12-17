'use client'

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DataTable from '@/components/ui/data-table/DataTable'
import CarrierSetupListColumns from './components/columns'
import { themeColors } from '@/theme'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import {
  fetchAllCarrierSetups,
  deleteCarrierSetup,
  setCurrentPage,
  clearCarrierSetupsError,
} from '@/redux/slices/settings/carrier-setups/actions'
import { AppDispatch, RootState } from '@/redux/store'

export default function CarrierSetupList() {
  const dispatch = useDispatch<AppDispatch>()
  const {
    carrierSetups,
    loading,
    error,
    totalItems,
    currentPage,
    itemsPerPage,
    deleteLoading,
  } = useSelector((state: RootState) => state.carrierSetups)

  // Fetch carrier setups on mount and when page changes
  useEffect(() => {
    dispatch(clearCarrierSetupsError())
    dispatch(fetchAllCarrierSetups(currentPage))
  }, [dispatch, currentPage])

  const handleDeleteClick = (id: string, carrierSetupName: string) => {
    if (confirm(`Are you sure you want to delete carrier setup "${carrierSetupName}"?`)) {
      dispatch(deleteCarrierSetup(id)).then(() => {
        dispatch(fetchAllCarrierSetups(currentPage))
      })
    }
  }

  const columns = CarrierSetupListColumns({ onDeleteClick: handleDeleteClick })

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page))
  }

  return (
    <div className="p-6">
      <div className="flex justify-between max-w-auto rounded bg-white p-6">
        <div>
          <h1
            className="text-2xl font-bold text-gray-900"
            style={{ color: themeColors.text.primary }}
          >
            Carrier Setup
          </h1>
          <p className="mt-1 text-sm text-gray-500" style={{ color: themeColors.text.muted }}>
            Manage carrier setup configurations
          </p>
        </div>
        <div>
          <div className="flex flex-wrap">
            <Link
              href="/settings/carrier-setup/add"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
            >
              <Plus size={16} />
              Add New Carrier Setup
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
          data={carrierSetups}
          loading={loading || deleteLoading}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          clientSidePagination={false}
          noDataMessage={
            <div className="text-center py-8">
              <p className="text-gray-500">No carrier setups found</p>
            </div>
          }
          className="shadow-none rounded-none"
        />
      </div>
    </div>
  )
}

