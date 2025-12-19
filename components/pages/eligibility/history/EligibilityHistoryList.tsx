'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import DataTable from '@/components/ui/data-table/DataTable'
import Filters from '@/components/ui/filters/Filters'
import EligibilityHistoryColumns from './components/columns'
import { themeColors } from '@/theme'
import { Filter, ChevronDown, Plus } from 'lucide-react'
import type { FilterField } from '@/components/ui/filters/Filters'
import { SERVICE_TYPES } from '@/utils/constants/service-types'
import { RELATIONSHIP_CODES } from '@/utils/constants/relationship-codes'
import {
  fetchEligibilityHistory,
  setCurrentPage,
  setFilters,
  clearFilters,
} from '@/redux/slices/eligibility/history/actions'
import { PageTransition } from '@/components/providers/page-transition-provider/PageTransitionProvider'

export default function EligibilityHistoryList() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { history, loading, error, totalItems, currentPage, itemsPerPage, filters } = useSelector(
    (state: RootState) => state.eligibilityHistory
  )
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  // Fetch data on component mount and when page changes
  useEffect(() => {
    dispatch(fetchEligibilityHistory({ page: currentPage, filters }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, currentPage])

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    dispatch(setFilters({ [name]: value }))
  }

  const handleFilterSubmit = () => {
    dispatch(setCurrentPage(1))
    dispatch(fetchEligibilityHistory({ page: 1, filters }))
  }

  const handleFilterReset = () => {
    dispatch(clearFilters())
    dispatch(setCurrentPage(1))
    // Fetch with empty filters
    dispatch(
      fetchEligibilityHistory({
        page: 1,
        filters: {
          serviceType: '',
          relationshipCode: '',
          subscriberId: '',
          dateFrom: '',
          dateTo: '',
        },
      })
    )
  }

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page))
    // Scroll to top of table when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleRetryClick = (id: string) => {
    if (confirm('Are you sure you want to retry this eligibility check?')) {
      // Handle retry - will be connected to Redux later
      console.log('Retrying eligibility check:', id)
    }
  }

  const handleNewRequest = () => {
    router.push('/eligibility/indivitual')
  }

  const columns = EligibilityHistoryColumns({ onRetryClick: handleRetryClick })

  const filterFields: FilterField[] = [
    {
      name: 'serviceType',
      label: 'Service Type',
      type: 'select',
      value: filters.serviceType || '',
      onChange: handleFilterChange,
      options: [
        { value: '', label: 'All Service Types' },
        ...SERVICE_TYPES.map(st => ({
          value: st.value,
          label: `${st.value} - ${st.label}`,
        })),
      ],
    },
    {
      name: 'relationshipCode',
      label: 'Relationship Code',
      type: 'select',
      value: filters.relationshipCode || '',
      onChange: handleFilterChange,
      options: [
        { value: '', label: 'All Relationships' },
        ...RELATIONSHIP_CODES.map(rc => ({
          value: rc.value,
          label: `${rc.value} - ${rc.label}`,
        })),
      ],
    },
    {
      name: 'subscriberId',
      label: 'Subscriber ID',
      type: 'text',
      value: filters.subscriberId || '',
      onChange: handleFilterChange,
      placeholder: 'Enter Subscriber ID',
    },
    {
      name: 'dateFrom',
      label: 'Date From',
      type: 'date',
      value: filters.dateFrom || '',
      onChange: handleFilterChange,
    },
    {
      name: 'dateTo',
      label: 'Date To',
      type: 'date',
      value: filters.dateTo || '',
      onChange: handleFilterChange,
    },
  ]

  return (
    <PageTransition>
      <div className="p-6">
        <div className="flex justify-between items-center max-w-auto rounded bg-white p-6 mb-6">
          <div>
            <h1
              className="text-2xl font-bold text-gray-900"
              style={{ color: themeColors.text.primary }}
            >
              Eligibility History
            </h1>
            <p className="mt-1 text-sm text-gray-500" style={{ color: themeColors.text.muted }}>
              View and manage eligibility check history
            </p>
          </div>
          <button
            onClick={handleNewRequest}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <Plus size={18} />
            <span>New Request</span>
          </button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
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
            data={history}
            loading={loading}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            clientSidePagination={false}
            noDataMessage={
              <div className="text-center py-8">
                <p className="text-gray-500">{error || 'No eligibility history found'}</p>
              </div>
            }
          />
        </div>
      </div>
    </PageTransition>
  )
}
