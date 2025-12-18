'use client'

import React, { useState } from 'react'
import DataTable from '@/components/ui/data-table/DataTable'
import Filters from '@/components/ui/filters/Filters'
import EligibilityLogListColumns from './components/columns'
import { themeColors } from '@/theme'
import { Filter, ChevronDown } from 'lucide-react'
import type { FilterField } from '@/components/ui/filters/Filters'

export default function EligibilityLogsList() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [localFilters, setLocalFilters] = useState({
    queueStatus: '',
    eligibilityStatus: '',
    serviceType: '',
    relationshipCode: '',
    subscriberId: '',
    dateFrom: '',
    dateTo: '',
  })

  // Mock data - replace with actual data later
  // Generating more mock data to test pagination
  const mockLogs = Array.from({ length: 25 }, (_, i) => ({
    id: String(i + 1),
    neoReferenceId: `NEO-${String(i + 1).padStart(3, '0')}`,
    subscriber: `SUB-${String(i + 1).padStart(5, '0')}`,
    provider: `Provider ${String.fromCharCode(65 + (i % 26))}`,
    serviceDate: `2024-01-${String((i % 28) + 1).padStart(2, '0')}`,
    status: ['completed', 'pending', 'failed'][i % 3],
    responseMessage: `Eligibility check ${i + 1} - ${['success', 'pending', 'failed'][i % 3]}`,
    created: `2024-01-${String((i % 28) + 1).padStart(2, '0')}T10:30:00`,
  }))

  const itemsPerPage = 10
  const totalItems = mockLogs.length

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setLocalFilters(prev => ({ ...prev, [name]: value }))
  }

  const handleFilterSubmit = () => {
    // Handle filter submit - will be connected to Redux later
    console.log('Filters submitted:', localFilters)
    setCurrentPage(1) // Reset to first page when filters are applied
  }

  const handleFilterReset = () => {
    setLocalFilters({
      queueStatus: '',
      eligibilityStatus: '',
      serviceType: '',
      relationshipCode: '',
      subscriberId: '',
      dateFrom: '',
      dateTo: '',
    })
    setCurrentPage(1) // Reset to first page when filters are reset
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of table when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleRetryClick = (id: string) => {
    if (confirm('Are you sure you want to retry this eligibility check?')) {
      // Handle retry - will be connected to Redux later
      console.log('Retrying log:', id)
    }
  }

  const columns = EligibilityLogListColumns({ onRetryClick: handleRetryClick })

  const filterFields: FilterField[] = [
    {
      name: 'queueStatus',
      label: 'Queue Status',
      type: 'select',
      value: localFilters.queueStatus,
      onChange: handleFilterChange,
      options: [
        { value: '', label: 'All Queue Status' },
        { value: 'pending', label: 'Pending' },
        { value: 'processing', label: 'Processing' },
        { value: 'completed', label: 'Completed' },
        { value: 'failed', label: 'Failed' },
      ],
    },
    {
      name: 'eligibilityStatus',
      label: 'Eligibility Status',
      type: 'select',
      value: localFilters.eligibilityStatus,
      onChange: handleFilterChange,
      options: [
        { value: '', label: 'All Eligibility Status' },
        { value: 'eligible', label: 'Eligible' },
        { value: 'not_eligible', label: 'Not Eligible' },
        { value: 'unknown', label: 'Unknown' },
      ],
    },
    {
      name: 'serviceType',
      label: 'Service Type',
      type: 'select',
      value: localFilters.serviceType,
      onChange: handleFilterChange,
      options: [
        { value: '', label: 'All Service Types' },
        { value: '30', label: 'Health Benefit Plan Coverage' },
        { value: '33', label: 'Dental Care' },
        { value: '35', label: 'Vision Care' },
        { value: '47', label: 'Hospital' },
        { value: '48', label: 'Hospital - Inpatient' },
        { value: '49', label: 'Hospital - Outpatient' },
      ],
    },
    {
      name: 'relationshipCode',
      label: 'Relationship Code',
      type: 'select',
      value: localFilters.relationshipCode,
      onChange: handleFilterChange,
      options: [
        { value: '', label: 'All Relationships' },
        { value: '18', label: 'Self' },
        { value: '01', label: 'Spouse' },
        { value: '19', label: 'Child' },
        { value: '20', label: 'Employee' },
        { value: '21', label: 'Unknown' },
      ],
    },
    {
      name: 'subscriberId',
      label: 'Subscriber ID',
      type: 'text',
      value: localFilters.subscriberId,
      onChange: handleFilterChange,
      placeholder: 'Enter Subscriber ID',
    },
    {
      name: 'dateFrom',
      label: 'Date From',
      type: 'date',
      value: localFilters.dateFrom,
      onChange: handleFilterChange,
    },
    {
      name: 'dateTo',
      label: 'Date To',
      type: 'date',
      value: localFilters.dateTo,
      onChange: handleFilterChange,
    },
  ]

  return (
    <div className="p-6">
      <div className="flex justify-between max-w-auto rounded bg-white p-6">
        <div>
          <h1
            className="text-2xl font-bold text-gray-900"
            style={{ color: themeColors.text.primary }}
          >
            Eligibility Logs
          </h1>
          <p className="mt-1 text-sm text-gray-500" style={{ color: themeColors.text.muted }}>
            View and manage eligibility check logs
          </p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden mt-6">
        {/* Filter Dropdown Button - Right Side */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-end">
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
          >
            <Filter size={18} />
            <span>Filters</span>
            <ChevronDown
              size={16}
              className={`transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Filters Dropdown Content */}
        {isFiltersOpen && (
          <div className="border-b border-gray-200 bg-gray-50">
            <Filters
              fields={filterFields}
              onReset={handleFilterReset}
              onSubmit={handleFilterSubmit}
              columns={filterFields.length}
            />
          </div>
        )}

        {/* DataTable */}
        <DataTable
          columns={columns}
          data={mockLogs}
          loading={false}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          clientSidePagination={false}
          noDataMessage={
            <div className="text-center py-8">
              <p className="text-gray-500">No eligibility logs found</p>
            </div>
          }
        />
      </div>
    </div>
  )
}
