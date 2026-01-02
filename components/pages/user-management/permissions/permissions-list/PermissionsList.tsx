'use client'

import { Plus } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { PageTransition } from '@/components/providers/page-transition-provider/PageTransitionProvider'
import DataTable from '@/components/ui/data-table/DataTable'
import Filters from '@/components/ui/filters/Filters'
import ConfirmationModal from '@/components/ui/modal/ConfirmationModal'
import {
  clearPermissionsError,
  deletePermission,
  fetchAllPermissions,
  setCurrentPage,
} from '@/redux/slices/user-management/permissions/actions'
import { AppDispatch, RootState } from '@/redux/store'
import { themeColors } from '@/theme'
import type { FilterField } from '@/types/ui'

import PermissionsListColumns from './components/columns'

export default function PermissionsList() {
  const dispatch = useDispatch<AppDispatch>()
  const { permissions, loading, totalItems, currentPage, deleteLoading, error } = useSelector(
    (state: RootState) => state.permissions
  )
  const [searchText, setSearchText] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    id: string | null
    permissionName: string | null
  }>({
    isOpen: false,
    id: null,
    permissionName: null,
  })
  const itemsPerPage = 8

  useEffect(() => {
    const filters: { search?: string } = {}
    if (appliedSearch.trim()) {
      filters.search = appliedSearch.trim()
    }
    dispatch(fetchAllPermissions({ page: currentPage, filters }))
  }, [dispatch, currentPage, appliedSearch])

  const handleDeleteClick = (id: string, permissionName: string) => {
    setDeleteModal({
      isOpen: true,
      id,
      permissionName,
    })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteModal.id) return

    dispatch(clearPermissionsError())
    const result = await dispatch(deletePermission(deleteModal.id))
    if (deletePermission.fulfilled.match(result)) {
      const filters: { search?: string } = {}
      if (appliedSearch.trim()) {
        filters.search = appliedSearch.trim()
      }
      dispatch(fetchAllPermissions({ page: currentPage, filters }))
      setDeleteModal({ isOpen: false, id: null, permissionName: null })
    } else {
      setDeleteModal({ isOpen: false, id: null, permissionName: null })
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSearchText(e.target.value)
  }

  const handleSubmit = () => {
    setAppliedSearch(searchText)
    dispatch(setCurrentPage(1))
  }

  const handleReset = () => {
    setSearchText('')
    setAppliedSearch('')
    dispatch(setCurrentPage(1))
  }

  const filterFields: FilterField[] = [
    {
      name: 'search',
      label: 'Search',
      type: 'text',
      placeholder: 'Quick permission search...',
      value: searchText,
      onChange: handleSearchChange,
    },
  ]

  const columns = PermissionsListColumns({ onDeleteClick: handleDeleteClick })

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page))
  }

  return (
    <PageTransition>
      <div className="p-6 relative">
        <div className="flex justify-between max-w-auto rounded bg-white p-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: themeColors.text.primary }}>
              Permissions
            </h1>
            <p className="mt-1 text-sm" style={{ color: themeColors.text.muted }}>
              Manage system permissions and access controls
            </p>
          </div>
          <div>
            <div className="flex flex-wrap">
              <Link
                href="/user-management/permissions/add"
                className="px-4 py-2 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 flex items-center gap-2"
                style={{ backgroundColor: themeColors.blue[600] }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = themeColors.blue[700])}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = themeColors.blue[600])}
                onFocus={e =>
                  (e.currentTarget.style.boxShadow = `0 0 0 2px ${themeColors.blue[400]}`)
                }
              >
                <Plus size={16} />
                Add New Permission
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <Filters
            fields={filterFields}
            onReset={handleReset}
            onSubmit={handleSubmit}
            columns={1}
          />

          <DataTable
            columns={columns}
            data={Array.isArray(permissions) ? permissions : []}
            loading={loading || deleteLoading}
            totalItems={totalItems || 0}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            clientSidePagination={false}
            noDataMessage={
              <div className="text-center py-8">
                <p style={{ color: themeColors.text.muted }}>No permissions found</p>
              </div>
            }
            className="shadow-none rounded-none"
          />
          {error && (
            <div
              className="px-6 py-4 border-t"
              style={{ backgroundColor: themeColors.red[100], borderColor: themeColors.red[400] }}
            >
              <p className="text-sm" style={{ color: themeColors.text.error }}>
                {error}
              </p>
            </div>
          )}
        </div>

        <ConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, id: null, permissionName: null })}
          onConfirm={handleDeleteConfirm}
          title="Delete Permission"
          message={`Are you sure you want to delete permission "${deleteModal.permissionName}"?`}
          confirmText="Delete"
          cancelText="Cancel"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
          isLoading={deleteLoading}
        />
      </div>
    </PageTransition>
  )
}
