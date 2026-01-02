'use client'

import { ChevronDown, Filter, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { PageTransition } from '@/components/providers/page-transition-provider/PageTransitionProvider'
import DataTable from '@/components/ui/data-table/DataTable'
import Filters from '@/components/ui/filters/Filters'
import ConfirmationModal from '@/components/ui/modal/ConfirmationModal'
import {
  clearFilters,
  fetchEligibilityHistory,
  retryEligibilitySubmission,
  setCurrentPage,
  setFilters,
} from '@/redux/slices/eligibility/history/actions'
import { AppDispatch, RootState } from '@/redux/store'
import { themeColors } from '@/theme'
import { toastManager } from '@/utils/toast'

import EligibilityHistoryColumns from './components/columns'
import { getFilterFields } from './components/eligibility-history-list.config'

export default function EligibilityHistoryList() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { history, loading, error, totalItems, currentPage, itemsPerPage, filters } = useSelector(
    (state: RootState) => state.eligibilityHistory
  )
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [retryModal, setRetryModal] = useState<{
    isOpen: boolean
    eligibilityId: string | null
  }>({
    isOpen: false,
    eligibilityId: null,
  })

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

  const handleRetryClick = (eligibilityId: string) => {
    setRetryModal({
      isOpen: true,
      eligibilityId,
    })
  }

  const handleRetryConfirm = async () => {
    if (!retryModal.eligibilityId) return

    try {
      const result = await dispatch(retryEligibilitySubmission(retryModal.eligibilityId))
      if (retryEligibilitySubmission.fulfilled.match(result)) {
        toastManager.success('Eligibility submission retried successfully')
        dispatch(fetchEligibilityHistory({ page: currentPage, filters, itemsPerPage }))
        setRetryModal({ isOpen: false, eligibilityId: null })
      } else {
        const errorMessage = (result.payload as string) || 'Failed to retry eligibility submission'
        toastManager.error(errorMessage)
        setRetryModal({ isOpen: false, eligibilityId: null })
      }
    } catch (error: any) {
      toastManager.error(
        error?.message || 'An error occurred while retrying eligibility submission'
      )
      setRetryModal({ isOpen: false, eligibilityId: null })
    }
  }

  const handleNewRequest = () => {
    router.push('/eligibility/indivitual')
  }

  const columns = EligibilityHistoryColumns({ onRetryClick: handleRetryClick })

  const filterFields = getFilterFields({ filters, handleFilterChange })

  return (
    <PageTransition>
      <div className="p-6 relative">
        <div className="flex justify-between items-center max-w-auto rounded bg-white p-6 mb-[-5px]">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: themeColors.text.primary }}>
              Eligibility History
            </h1>
            <p className="mt-1 text-sm" style={{ color: themeColors.text.muted }}>
              View and manage eligibility check history
            </p>
          </div>
          <button
            onClick={handleNewRequest}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 transition"
            style={{ backgroundColor: themeColors.blue[600] }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = themeColors.blue[700])}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = themeColors.blue[600])}
            onFocus={e => (e.currentTarget.style.boxShadow = `0 0 0 2px ${themeColors.blue[400]}`)}
          >
            <Plus size={18} />
            <span>New Request</span>
          </button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div
            className="px-6 py-4 border-b flex justify-end"
            style={{ borderColor: themeColors.border.default }}
          >
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-md focus:outline-none focus:ring-2 transition"
              style={{
                color: themeColors.gray[700],
                backgroundColor: themeColors.gray[100],
                borderColor: themeColors.border.default,
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = themeColors.gray[100])}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = themeColors.gray[100])}
              onFocus={e =>
                (e.currentTarget.style.boxShadow = `0 0 0 2px ${themeColors.gray[300]}`)
              }
              onBlur={e => (e.currentTarget.style.boxShadow = '')}
            >
              <Filter size={18} />
              <span>Filters</span>
              <ChevronDown
                size={16}
                className={`transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {isFiltersOpen && (
            <div
              className="border-b"
              style={{
                borderColor: themeColors.border.default,
                backgroundColor: themeColors.gray[50],
              }}
            >
              <Filters
                fields={filterFields}
                onReset={handleFilterReset}
                onSubmit={handleFilterSubmit}
                columns={filterFields.length}
              />
            </div>
          )}

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
                <p style={{ color: themeColors.text.muted }}>
                  {error || 'No eligibility history found'}
                </p>
              </div>
            }
          />
        </div>

        <ConfirmationModal
          isOpen={retryModal.isOpen}
          onClose={() => setRetryModal({ isOpen: false, eligibilityId: null })}
          onConfirm={handleRetryConfirm}
          title="Retry Eligibility Check"
          message="Are you sure you want to retry this eligibility check?"
          confirmText="Retry"
          cancelText="Cancel"
          confirmButtonClass=""
        />
      </div>
    </PageTransition>
  )
}
