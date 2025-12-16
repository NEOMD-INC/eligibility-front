'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DataTable from '@/components/ui/data-table/DataTable'
import PermissionsListColumns from './components/columns'
import { themeColors } from '@/theme'
import Link from 'next/link'
import { Plus, Search, FunnelPlus } from 'lucide-react'
import {
  fetchAllPermissions,
  deletePermission,
  setCurrentPage,
  clearPermissionsError,
} from '@/redux/slices/user-management/permissions/actions'
import { AppDispatch, RootState } from '@/redux/store'

export default function PermissionsList() {
  const dispatch = useDispatch<AppDispatch>()
  const { permissions, loading, totalItems, currentPage, deleteLoading, error } = useSelector(
    (state: RootState) => state.permissions
  )
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [roleFilter, setRoleFilter] = useState('allrole')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [appliedRole, setAppliedRole] = useState('allrole')
  const filterRef = useRef<HTMLDivElement>(null)
  const itemsPerPage = 10

  // Fetch permissions on component mount and when applied filters/page change
  useEffect(() => {
    const filters: { search?: string; role?: string } = {}
    if (appliedSearch.trim()) {
      filters.search = appliedSearch.trim()
    }
    if (appliedRole && appliedRole !== 'allrole') {
      filters.role = appliedRole
    }
    dispatch(fetchAllPermissions({ page: currentPage, filters }))
  }, [dispatch, currentPage, appliedSearch, appliedRole])

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false)
      }
    }

    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isFilterOpen])

  const handleDeleteClick = async (id: string, permissionName: string) => {
    if (confirm(`Are you sure you want to delete permission "${permissionName}"?`)) {
      dispatch(clearPermissionsError())
      const result = await dispatch(deletePermission(id))
      if (deletePermission.fulfilled.match(result)) {
        const filters: { search?: string; role?: string } = {}
        if (appliedSearch.trim()) {
          filters.search = appliedSearch.trim()
        }
        if (appliedRole && appliedRole !== 'allrole') {
          filters.role = appliedRole
        }
        dispatch(fetchAllPermissions({ page: currentPage, filters }))
      }
    }
  }

  // Filter handlers
  const handleQuickSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }

  const handleSearchFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(e.target.value)
  }

  const handleSubmit = () => {
    setAppliedSearch(searchText)
    setAppliedRole(roleFilter)
    dispatch(setCurrentPage(1))
    setIsFilterOpen(false)
  }

  const resetSearchField = () => {
    setSearchText('')
    setRoleFilter('allrole')
    setAppliedSearch('')
    setAppliedRole('allrole')
    dispatch(setCurrentPage(1))
  }

  const columns = PermissionsListColumns({ onDeleteClick: handleDeleteClick })

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
            Permissions
          </h1>
          <p className="mt-1 text-sm text-gray-500" style={{ color: themeColors.text.muted }}>
            Manage system permissions and access controls
          </p>
        </div>
        <div>
          <div className="flex flex-wrap">
            <Link
              href="/user-management/permissions/add"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
            >
              <Plus size={16} />
              Add New Permission
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex justify-end items-center gap-4">
            {/* Quick Search */}
            <div className="flex items-center relative">
              <div className="absolute left-3 text-gray-400">
                <Search size={16} />
              </div>
              <input
                type="text"
                className="w-80 pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                placeholder="Quick permission search..."
                onChange={handleQuickSearchChange}
                value={searchText}
              />
              <button
                type="button"
                onClick={e => {
                  e.preventDefault()
                  handleSubmit()
                }}
                className="ml-3 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-1 whitespace-nowrap"
              >
                <Search size={14} />
                Search
              </button>
            </div>
          </div>
        </div>

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
              <p className="text-gray-500">No permissions found</p>
            </div>
          }
          className="shadow-none rounded-none"
        />
        {error && (
          <div className="px-6 py-4 bg-red-50 border-t border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
