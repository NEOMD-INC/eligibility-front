'use client'

import React, { useState, useRef, useEffect } from 'react'
import DataTable from '@/components/ui/data-table/DataTable'
import PermissionsListColumns from './components/columns'
import { themeColors } from '@/theme'
import Link from 'next/link'
import { Plus, Search, FunnelPlus } from 'lucide-react'

const mockPermissions = [
  {
    id: '1',
    uuid: 'uuid-1',
    name: 'View Users',
    slug: 'view-users',
    description: 'Permission to view users list',
    created_at: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    uuid: 'uuid-2',
    name: 'Edit Users',
    slug: 'edit-users',
    description: 'Permission to edit user information',
    created_at: '2024-02-20T14:20:00Z',
  },
  {
    id: '3',
    uuid: 'uuid-3',
    name: 'Delete Users',
    slug: 'delete-users',
    description: 'Permission to delete users',
    created_at: '2024-03-10T09:15:00Z',
  },
  {
    id: '4',
    uuid: 'uuid-4',
    name: 'Manage Roles',
    slug: 'manage-roles',
    description: 'Permission to manage roles',
    created_at: '2024-03-15T11:00:00Z',
  },
  {
    id: '5',
    uuid: 'uuid-5',
    name: 'Manage Permissions',
    slug: 'manage-permissions',
    description: 'Permission to manage permissions',
    created_at: '2024-03-20T13:30:00Z',
  },
]

export default function PermissionsList() {
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [searchField, setSearchField] = useState('name')
  const filterRef = useRef<HTMLDivElement>(null)
  const itemsPerPage = 10

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

  const handleDeleteClick = (id: string, permissionName: string) => {
    if (confirm(`Are you sure you want to delete permission "${permissionName}"?`)) {
      console.log('Delete permission:', id, permissionName)
    }
  }

  // Filter handlers
  const handleQuickSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }

  const handleSearchFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchField(e.target.value)
  }

  const handleSubmit = () => {
    // TODO: Implement search/filter logic
    console.log('Search:', searchText, 'Field:', searchField)
    setIsFilterOpen(false)
  }

  const resetSearchField = () => {
    setSearchText('')
    setSearchField('name')
  }

  const columns = PermissionsListColumns({ onDeleteClick: handleDeleteClick })
  const totalItems = mockPermissions.length
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = mockPermissions.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
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
          data={paginatedData}
          loading={loading}
          totalItems={totalItems}
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
      </div>
    </div>
  )
}
