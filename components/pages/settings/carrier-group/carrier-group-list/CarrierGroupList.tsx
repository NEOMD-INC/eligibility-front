'use client'

import React, { useState } from 'react'
import DataTable from '@/components/ui/data-table/DataTable'
import CarrierGroupListColumns from './components/columns'
import { themeColors } from '@/theme'
import Link from 'next/link'
import { Plus, Search } from 'lucide-react'

const mockCarrierGroups = [
  {
    id: '1',
    uuid: 'uuid-1',
    description: 'Insurance Group A',
    code: 'IGA001',
    fillingIndicator: 'Full Coverage',
    status: 'Active',
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    uuid: 'uuid-2',
    description: 'Insurance Group B',
    code: 'IGB002',
    fillingIndicator: 'Partial Coverage',
    status: 'Active',
    isActive: true,
    createdAt: '2024-02-20T14:20:00Z',
  },
  {
    id: '3',
    uuid: 'uuid-3',
    description: 'Insurance Group C',
    code: 'IGC003',
    fillingIndicator: 'Limited Coverage',
    status: 'Inactive',
    isActive: false,
    createdAt: '2024-03-10T09:15:00Z',
  },
]

export default function CarrierGroupList() {
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchDescription, setSearchDescription] = useState('')
  const [searchCode, setSearchCode] = useState('')
  const [searchFillingIndicator, setSearchFillingIndicator] = useState('')
  const [searchStatus, setSearchStatus] = useState('all')
  const itemsPerPage = 10

  const handleDeleteClick = (id: string, carrierGroupName: string) => {
    if (confirm(`Are you sure you want to delete carrier group "${carrierGroupName}"?`)) {
      console.log('Delete carrier group:', id, carrierGroupName)
    }
  }

  // Filter handlers
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchDescription(e.target.value)
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCode(e.target.value)
  }

  const handleFillingIndicatorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFillingIndicator(e.target.value)
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchStatus(e.target.value)
  }

  const handleSubmit = () => {
    // TODO: Implement search/filter logic
    console.log('Search:', {
      description: searchDescription,
      code: searchCode,
      fillingIndicator: searchFillingIndicator,
      status: searchStatus,
    })
  }

  const resetFilters = () => {
    setSearchDescription('')
    setSearchCode('')
    setSearchFillingIndicator('')
    setSearchStatus('all')
  }

  const columns = CarrierGroupListColumns({ onDeleteClick: handleDeleteClick })
  const totalItems = mockCarrierGroups.length
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = mockCarrierGroups.slice(startIndex, endIndex)

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
            Carrier Groups
          </h1>
          <p className="mt-1 text-sm text-gray-500" style={{ color: themeColors.text.muted }}>
            Manage carrier groups and their configurations
          </p>
        </div>
        <div>
          <div className="flex flex-wrap">
            <Link
              href="/settings/carrier-group/add"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
            >
              <Plus size={16} />
              Add New Carrier Group
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search by Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search by Description:
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                placeholder="Enter description..."
                onChange={handleDescriptionChange}
                value={searchDescription}
              />
            </div>

            {/* Search by Code */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search by Code:
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                placeholder="Enter code..."
                onChange={handleCodeChange}
                value={searchCode}
              />
            </div>

            {/* Search by Filling Indicator */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search by Filling Indicator:
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                placeholder="Enter filling indicator..."
                onChange={handleFillingIndicatorChange}
                value={searchFillingIndicator}
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status:</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold bg-white"
                onChange={handleStatusChange}
                value={searchStatus}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={resetFilters}
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
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
            >
              <Search size={14} />
              Search
            </button>
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
              <p className="text-gray-500">No carrier groups found</p>
            </div>
          }
          className="shadow-none rounded-none"
        />
      </div>
    </div>
  )
}

