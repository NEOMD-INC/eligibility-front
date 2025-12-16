'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DataTable from '@/components/ui/data-table/DataTable'
import UsersListColumns from './components/columns'
import { themeColors } from '@/theme'
import Link from 'next/link'
import { Plus, Search, FunnelPlus } from 'lucide-react'
import {
  fetchAllRoles,
  deleteRole,
  setCurrentPage,
  clearRolesError,
} from '@/redux/slices/user-management/roles/actions'
import { AppDispatch, RootState } from '@/redux/store'

export default function RolesList() {
  const dispatch = useDispatch<AppDispatch>()
  const { roles, loading, totalItems, currentPage, deleteLoading, error } = useSelector(
    (state: RootState) => state.roles
  )
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [roleFilter, setRoleFilter] = useState('allrole')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [appliedRole, setAppliedRole] = useState('allrole')
  const filterRef = useRef<HTMLDivElement>(null)
  const itemsPerPage = 10

  useEffect(() => {
    const filters: { search?: string; name?: string } = {}
    if (appliedSearch.trim()) {
      filters.search = appliedSearch.trim()
    }
    if (appliedRole && appliedRole !== 'allrole') {
      filters.name = appliedRole
    }
    dispatch(fetchAllRoles({ page: currentPage, filters }))
  }, [dispatch, currentPage, appliedSearch, appliedRole])

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

  const handleDeleteClick = async (id: string, roleName: string) => {
    if (confirm(`Are you sure you want to delete role "${roleName}"?`)) {
      dispatch(clearRolesError())
      const result = await dispatch(deleteRole(id))
      if (deleteRole.fulfilled.match(result)) {
        const filters: { search?: string; role?: string } = {}
        if (appliedSearch.trim()) {
          filters.search = appliedSearch.trim()
        }
        if (appliedRole && appliedRole !== 'allrole') {
          filters.role = appliedRole
        }
        dispatch(fetchAllRoles({ page: currentPage, filters }))
      }
    }
  }

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

  const columns = UsersListColumns({ onDeleteClick: handleDeleteClick })

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
            Roles
          </h1>
          <p className="mt-1 text-sm text-gray-500" style={{ color: themeColors.text.muted }}>
            Manage Roles
          </p>
        </div>
        <div>
          <div className="flex flex-wrap">
            <Link
              href="/user-management/roles/add-new-role"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
            >
              <Plus size={16} />
              Add New Role
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
                placeholder="Quick Role search..."
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

            {/* Filter Dropdown */}
            <div className="flex items-center">
              <div className="relative" ref={filterRef}>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="px-4 py-2 bg-white text-gray-700 text-sm font-semibold rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 flex items-center gap-2 border border-gray-300"
                >
                  <FunnelPlus size={14} />
                  Filter
                </button>

                {isFilterOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                      <div className="text-lg font-bold text-gray-900">Filter Options</div>
                    </div>
                    <div className="px-6 py-4">
                      <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Search by Role:
                        </label>
                        <div className="flex flex-col gap-3">
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold bg-white"
                            onChange={handleSearchFieldChange}
                            value={roleFilter}
                          >
                            <option value="allrole">All Role</option>
                            <option value="super_admin">Super Admin</option>
                            <option value="employee">Employee</option>
                            <option value="manager">Manager</option>
                            <option value="team_lead">Team Lead</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                        <button
                          onClick={resetSearchField}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        >
                          Reset
                        </button>
                        <button
                          type="button"
                          onClick={e => {
                            e.preventDefault()
                            handleSubmit()
                          }}
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          Search
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={Array.isArray(roles) ? roles : []}
          loading={loading || deleteLoading}
          totalItems={totalItems || 0}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          clientSidePagination={false}
          noDataMessage={
            <div className="text-center py-8">
              <p className="text-gray-500">No Roles found</p>
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
