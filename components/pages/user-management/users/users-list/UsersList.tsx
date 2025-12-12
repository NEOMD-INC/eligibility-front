'use client'

import React, { useState, useRef, useEffect } from 'react'
import DataTable from '@/components/ui/data-table/DataTable'
import UsersListColumns from './components/columns'
import { themeColors } from '@/theme'
import Link from 'next/link'
import { Plus, Search, FunnelPlus } from 'lucide-react'

const mockUsers = [
  {
    id: '1',
    uuid: 'uuid-1',
    first_name: 'John',
    last_name: 'Doe',
    full_name: 'John Doe',
    email: 'john.doe@example.com',
    username: 'johndoe',
    role: 'Admin',
    roles: ['Admin'],
    gender: 'male',
    profile_image_path: null,
    created_at: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    uuid: 'uuid-2',
    first_name: 'Jane',
    last_name: 'Smith',
    full_name: 'Jane Smith',
    email: 'jane.smith@example.com',
    username: 'janesmith',
    role: 'User',
    roles: ['User'],
    gender: 'female',
    profile_image_path: null,
    created_at: '2024-02-20T14:20:00Z',
  },
  {
    id: '3',
    uuid: 'uuid-3',
    first_name: 'Bob',
    last_name: 'Johnson',
    full_name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    username: 'bobjohnson',
    role: 'Manager',
    roles: ['Manager'],
    gender: 'male',
    profile_image_path: null,
    created_at: '2024-03-10T09:15:00Z',
  },
]

export default function UsersList() {
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [searchField, setSearchField] = useState('first_name')
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

  const handleDeleteClick = (id: string, userName: string) => {
    if (confirm(`Are you sure you want to delete user "${userName}"?`)) {
      console.log('Delete user:', id, userName)
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
    setSearchField('first_name')
  }

  const columns = UsersListColumns({ onDeleteClick: handleDeleteClick })
  const totalItems = mockUsers.length
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = mockUsers.slice(startIndex, endIndex)

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
            Users
          </h1>
          <p className="mt-1 text-sm text-gray-500" style={{ color: themeColors.text.muted }}>
            Manage system users and their permissions
          </p>
        </div>
        <div>
          <div className="flex flex-wrap">
            <Link
              href="/user-management/users/add-new-user"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
            >
              <Plus size={16} />
              Add New User
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
                placeholder="Quick user search..."
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
                            value={searchField}
                          >
                            <option value="allrole">All Role</option>
                            <option value="allrole">User</option>
                            <option value="allrole">Employee</option>
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

        {/* DataTable */}
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
              <p className="text-gray-500">No users found</p>
            </div>
          }
          className="shadow-none rounded-none"
        />
      </div>
    </div>
  )
}
