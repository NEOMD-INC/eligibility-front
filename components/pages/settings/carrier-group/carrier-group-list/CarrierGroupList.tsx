'use client'

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DataTable from '@/components/ui/data-table/DataTable'
import CarrierGroupListColumns from './components/columns'
import Filters, { FilterField } from '@/components/ui/filters/Filters'
import { themeColors } from '@/theme'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import {
  fetchAllCarrierGroups,
  deleteCarrierGroup,
  setCurrentPage,
  clearCarrierGroupsError,
} from '@/redux/slices/settings/carrier-groups/actions'
import { AppDispatch, RootState } from '@/redux/store'
import { PageTransition } from '@/components/providers/page-transition-provider/PageTransitionProvider'
import ConfirmationModal from '@/components/ui/modal/ConfirmationModal'

export default function CarrierGroupList() {
  const dispatch = useDispatch<AppDispatch>()
  const { carrierGroups, loading, error, totalItems, currentPage, itemsPerPage, deleteLoading } =
    useSelector((state: RootState) => state.carrierGroups)

  const [searchDescription, setSearchDescription] = useState('')
  const [searchCode, setSearchCode] = useState('')
  const [searchFillingIndicator, setSearchFillingIndicator] = useState('')
  const [searchStatus, setSearchStatus] = useState('all')
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    id: string | null
    carrierGroupName: string | null
  }>({
    isOpen: false,
    id: null,
    carrierGroupName: null,
  })

  const buildFilters = () => {
    const filters: {
      description?: string
      code?: string
      filling_indicator?: string
      status?: string
    } = {}

    if (searchDescription) {
      filters.description = searchDescription
    }
    if (searchCode) {
      filters.code = searchCode
    }
    if (searchFillingIndicator) {
      filters.filling_indicator = searchFillingIndicator
    }
    if (searchStatus && searchStatus !== 'all') {
      filters.status = searchStatus
    }

    return filters
  }

  useEffect(() => {
    dispatch(clearCarrierGroupsError())
    const filters = buildFilters()
    dispatch(fetchAllCarrierGroups({ page: currentPage, filters }))
  }, [dispatch, currentPage])

  const handleDeleteClick = (id: string, carrierGroupName: string) => {
    setDeleteModal({
      isOpen: true,
      id,
      carrierGroupName,
    })
  }

  const handleDeleteConfirm = () => {
    if (!deleteModal.id) return

    dispatch(deleteCarrierGroup(deleteModal.id)).then(() => {
      const filters = buildFilters()
      dispatch(fetchAllCarrierGroups({ page: currentPage, filters }))
      setDeleteModal({ isOpen: false, id: null, carrierGroupName: null })
    })
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSearchDescription(e.target.value)
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSearchCode(e.target.value)
  }

  const handleFillingIndicatorChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setSearchFillingIndicator(e.target.value)
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSearchStatus(e.target.value)
  }

  const handleSubmit = () => {
    dispatch(clearCarrierGroupsError())
    dispatch(setCurrentPage(1))
    const filters = buildFilters()
    dispatch(fetchAllCarrierGroups({ page: 1, filters }))
  }

  const handleReset = () => {
    setSearchDescription('')
    setSearchCode('')
    setSearchFillingIndicator('')
    setSearchStatus('all')
    dispatch(clearCarrierGroupsError())
    dispatch(setCurrentPage(1))
    dispatch(fetchAllCarrierGroups({ page: 1, filters: {} }))
  }

  const filterFields: FilterField[] = [
    {
      name: 'description',
      label: 'Search by Description',
      type: 'text',
      placeholder: 'Enter description...',
      value: searchDescription,
      onChange: handleDescriptionChange,
    },
    {
      name: 'code',
      label: 'Search by Code',
      type: 'text',
      placeholder: 'Enter code...',
      value: searchCode,
      onChange: handleCodeChange,
    },
    {
      name: 'fillingIndicator',
      label: 'Search by Filling Indicator',
      type: 'text',
      placeholder: 'Enter filling indicator...',
      value: searchFillingIndicator,
      onChange: handleFillingIndicatorChange,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      value: searchStatus,
      onChange: handleStatusChange,
      options: [
        { value: 'all', label: 'All Status' },
        { value: '1', label: 'Active' },
        { value: '0', label: 'Inactive' },
      ],
    },
  ]

  const columns = CarrierGroupListColumns({ onDeleteClick: handleDeleteClick })

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page))
  }

  return (
    <PageTransition>
      <div className="p-6 relative">
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
          <Filters
            fields={filterFields}
            onReset={handleReset}
            onSubmit={handleSubmit}
            columns={4}
          />

          {error && (
            <div className="px-6 py-4 bg-red-100 text-red-700 border-b border-red-200">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <DataTable
            columns={columns}
            data={carrierGroups}
            loading={loading || deleteLoading}
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

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, id: null, carrierGroupName: null })}
          onConfirm={handleDeleteConfirm}
          title="Delete Carrier Group"
          message={`Are you sure you want to delete carrier group "${deleteModal.carrierGroupName}"?`}
          confirmText="Delete"
          cancelText="Cancel"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
          isLoading={deleteLoading}
        />
      </div>
    </PageTransition>
  )
}
