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

export default function RolesList() {
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [searchField, setSearchField] = useState('first_name')
  const filterRef = useRef<HTMLDivElement>(null)
  const itemsPerPage = 10

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

  const handleQuickSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }

  const handleSearchFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchField(e.target.value)
  }

  const handleSubmit = () => {
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
              <p className="text-gray-500">No Roles found</p>
            </div>
          }
          className="shadow-none rounded-none"
        />
      </div>
    </div>
  )
}
