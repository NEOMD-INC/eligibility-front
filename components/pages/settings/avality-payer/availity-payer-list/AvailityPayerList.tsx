'use client'

import React, { useState } from 'react'
import DataTable from '@/components/ui/data-table/DataTable'
import AvailityPayerListColumns from './components/columns'
import { themeColors } from '@/theme'
import Link from 'next/link'
import { Plus } from 'lucide-react'

const mockAvailityPayers = [
  {
    id: '1',
    uuid: 'uuid-1',
    payerId: 'PAY001',
    payerName: 'Blue Cross Blue Shield',
    payerCode: 'BCBS001',
    city: 'New York',
    state: 'NY',
    status: 'Active',
  },
  {
    id: '2',
    uuid: 'uuid-2',
    payerId: 'PAY002',
    payerName: 'UnitedHealthcare',
    payerCode: 'UHC001',
    city: 'Los Angeles',
    state: 'CA',
    status: 'Active',
  },
  {
    id: '3',
    uuid: 'uuid-3',
    payerId: 'PAY003',
    payerName: 'Aetna Insurance',
    payerCode: 'AET001',
    city: 'Chicago',
    state: 'IL',
    status: 'Inactive',
  },
]

export default function AvailityPayerList() {
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleDeleteClick = (id: string, payerName: string) => {
    if (confirm(`Are you sure you want to delete payer "${payerName}"?`)) {
      console.log('Delete payer:', id, payerName)
    }
  }

  const columns = AvailityPayerListColumns({ onDeleteClick: handleDeleteClick })
  const totalItems = mockAvailityPayers.length
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = mockAvailityPayers.slice(startIndex, endIndex)

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
            Availity Payers
          </h1>
          <p className="mt-1 text-sm text-gray-500" style={{ color: themeColors.text.muted }}>
            Manage availity payers and their details
          </p>
        </div>
        <div>
          <div className="flex flex-wrap">
            <Link
              href="/settings/availity-payer/add"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
            >
              <Plus size={16} />
              Add New Payer
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
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
              <p className="text-gray-500">No payers found</p>
            </div>
          }
          className="shadow-none rounded-none"
        />
      </div>
    </div>
  )
}

