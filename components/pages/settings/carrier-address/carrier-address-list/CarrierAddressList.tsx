'use client'

import React, { useState } from 'react'
import DataTable from '@/components/ui/data-table/DataTable'
import CarrierAddressListColumns from './components/columns'
import { themeColors } from '@/theme'
import Link from 'next/link'
import { Plus } from 'lucide-react'

const mockCarrierAddresses = [
  {
    id: '1',
    uuid: 'uuid-1',
    carrierCode: 'CAR001',
    actualName: 'ABC Insurance Company',
    addressId: 'ADD001',
    addressLine1: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    phoneType: 'Office',
    phoneNumber: '555-1234',
    insuranceDepartment: 'Health Insurance',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    uuid: 'uuid-2',
    carrierCode: 'CAR002',
    actualName: 'XYZ Insurance Corp',
    addressId: 'ADD002',
    addressLine1: '456 Oak Avenue',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90001',
    phoneType: 'Mobile',
    phoneNumber: '555-5678',
    insuranceDepartment: 'Life Insurance',
    createdAt: '2024-02-20T14:20:00Z',
  },
  {
    id: '3',
    uuid: 'uuid-3',
    carrierCode: 'CAR003',
    actualName: 'DEF Insurance Services',
    addressId: 'ADD003',
    addressLine1: '789 Pine Road',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    phoneType: 'Office',
    phoneNumber: '555-9012',
    insuranceDepartment: 'Auto Insurance',
    createdAt: '2024-03-10T09:15:00Z',
  },
]

export default function CarrierAddressList() {
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleDeleteClick = (id: string, carrierAddressName: string) => {
    if (confirm(`Are you sure you want to delete carrier address "${carrierAddressName}"?`)) {
      console.log('Delete carrier address:', id, carrierAddressName)
    }
  }

  const columns = CarrierAddressListColumns({ onDeleteClick: handleDeleteClick })
  const totalItems = mockCarrierAddresses.length
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = mockCarrierAddresses.slice(startIndex, endIndex)

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
            Carrier Addresses
          </h1>
          <p className="mt-1 text-sm text-gray-500" style={{ color: themeColors.text.muted }}>
            Manage carrier addresses and their details
          </p>
        </div>
        <div>
          <div className="flex flex-wrap">
            <Link
              href="/settings/carrier-address/add"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
            >
              <Plus size={16} />
              Add New Carrier Address
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
              <p className="text-gray-500">No carrier addresses found</p>
            </div>
          }
          className="shadow-none rounded-none"
        />
      </div>
    </div>
  )
}

