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

import {
  fetchEligibilityHistory,
  retryEligibilitySubmission,
  setCurrentPage,
  setFilters,
  clearFilters,
} from '@/redux/slices/eligibility/history/actions'
import { PageTransition } from '@/components/providers/page-transition-provider/PageTransitionProvider'
import { toastManager } from '@/utils/toast'
import { getFilterFields } from './components/eligibility-history-list.config'

export default function EligibilityHistoryList() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { history, loading, error, totalItems, currentPage, itemsPerPage, filters } = useSelector(
    (state: RootState) => state.eligibilityHistory
  )
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  const hasPendingHistory = history.some((item: any) => {
    const status = (item.status || '').toLowerCase()
    const queueStatus = (item.queueStatus || item.queue_status || '').toLowerCase()
    return (
      status === 'pending' ||
      status === 'in_process' ||
      queueStatus === 'pending' ||
      queueStatus === 'in_process' ||
      queueStatus === 'processing'
    )
  })

  useEffect(() => {
    dispatch(fetchEligibilityHistory({ page: currentPage, filters, itemsPerPage }))
  }, [dispatch, currentPage])

  useEffect(() => {
    if (!hasPendingHistory || loading) return

    const intervalId = setInterval(() => {
      dispatch(fetchEligibilityHistory({ page: currentPage, filters, itemsPerPage }))
    }, 5000)
    return () => {
      clearInterval(intervalId)
    }
  }, [hasPendingHistory, currentPage, filters, itemsPerPage, loading, dispatch])

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    dispatch(setFilters({ [name]: value }))
  }

  const handleFilterSubmit = () => {
    dispatch(setCurrentPage(1))
    dispatch(fetchEligibilityHistory({ page: 1, filters, itemsPerPage }))
  }

  const handleFilterReset = () => {
    dispatch(clearFilters())
    dispatch(setCurrentPage(1))
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
        itemsPerPage,
      })
    )
  }

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleRetryClick = async (eligibilityId: string) => {
    if (confirm('Are you sure you want to retry this eligibility check?')) {
      try {
        const result = await dispatch(retryEligibilitySubmission(eligibilityId))
        if (retryEligibilitySubmission.fulfilled.match(result)) {
          toastManager.success('Eligibility submission retried successfully')
          dispatch(fetchEligibilityHistory({ page: currentPage, filters, itemsPerPage }))
        } else {
          const errorMessage =
            (result.payload as string) || 'Failed to retry eligibility submission'
          toastManager.error(errorMessage)
        }
      } catch (error: any) {
        toastManager.error(
          error?.message || 'An error occurred while retrying eligibility submission'
        )
      }
    }
  }

  const handleNewRequest = () => {
    router.push('/eligibility/indivitual')
  }

  const columns = EligibilityHistoryColumns({ onRetryClick: handleRetryClick })

  const filterFields = getFilterFields({ filters, handleFilterChange })

  return (
    <PageTransition>
      <div className="p-6">
        <div className="flex justify-between items-center max-w-auto rounded bg-white p-6 mb-[-5px]">
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
