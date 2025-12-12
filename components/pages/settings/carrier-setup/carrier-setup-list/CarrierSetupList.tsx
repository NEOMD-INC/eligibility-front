'use client'

import React, { useState } from 'react'
import DataTable from '@/components/ui/data-table/DataTable'
import CarrierSetupListColumns from './components/columns'
import { themeColors } from '@/theme'
import Link from 'next/link'
import { Plus } from 'lucide-react'

const mockCarrierSetups = [
  {
    id: '1',
    uuid: 'uuid-1',
    groupCode: 'GRP001',
    groupDescription: 'Health Insurance Group A',
    carrierCode: 'CAR001',
    carrierDescription: 'ABC Insurance Company',
    state: 'NY',
    batchPlayerId: 'BP001',
    isClia: 'Yes',
    cob: 'Primary',
    correctedClaim: 'Yes',
    enrollmentRequired: 'Required',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    uuid: 'uuid-2',
    groupCode: 'GRP002',
    groupDescription: 'Health Insurance Group B',
    carrierCode: 'CAR002',
    carrierDescription: 'XYZ Insurance Corp',
    state: 'CA',
    batchPlayerId: 'BP002',
    isClia: 'No',
    cob: 'Secondary',
    correctedClaim: 'No',
    enrollmentRequired: 'Not Required',
    createdAt: '2024-02-20T14:20:00Z',
  },
  {
    id: '3',
    uuid: 'uuid-3',
    groupCode: 'GRP003',
    groupDescription: 'Dental Insurance Group',
    carrierCode: 'CAR003',
    carrierDescription: 'DEF Insurance Services',
    state: 'IL',
    batchPlayerId: 'BP003',
    isClia: 'Yes',
    cob: 'Primary',
    correctedClaim: 'Yes',
    enrollmentRequired: 'Required',
    createdAt: '2024-03-10T09:15:00Z',
  },
]

export default function CarrierSetupList() {
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleDeleteClick = (id: string, carrierSetupName: string) => {
    if (confirm(`Are you sure you want to delete carrier setup "${carrierSetupName}"?`)) {
      console.log('Delete carrier setup:', id, carrierSetupName)
    }
  }

  const columns = CarrierSetupListColumns({ onDeleteClick: handleDeleteClick })
  const totalItems = mockCarrierSetups.length
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = mockCarrierSetups.slice(startIndex, endIndex)

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
              <p className="text-gray-500">No carrier setups found</p>
            </div>
          }
          className="shadow-none rounded-none"
        />
      </div>
    </div>
  )
}

