'use client'

import { Plus } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { PageTransition } from '@/components/providers/page-transition-provider/PageTransitionProvider'
import DataTable from '@/components/ui/data-table/DataTable'
import Filters from '@/components/ui/filters/Filters'
import ConfirmationModal from '@/components/ui/modal/ConfirmationModal'
import {
  clearRolesError,
  deleteRole,
  fetchAllRoles,
  setCurrentPage,
} from '@/redux/slices/user-management/roles/actions'
import { AppDispatch, RootState } from '@/redux/store'
import { themeColors } from '@/theme'
import type { FilterField } from '@/types/ui'

import RolesListColumns from './components/columns'

export default function RolesList() {
  const dispatch = useDispatch<AppDispatch>()
  const { roles, loading, totalItems, currentPage, deleteLoading, error } = useSelector(
    (state: RootState) => state.roles
  )
  const [searchText, setSearchText] = useState('')
  const [roleFilter, setRoleFilter] = useState('allrole')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [appliedRole, setAppliedRole] = useState('allrole')
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    id: string | null
    roleName: string | null
  }>({
    isOpen: false,
    id: null,
    roleName: null,
  })
  const itemsPerPage = 8

  useEffect(() => {
    const filters: { search?: string; name?: string } = {}
    if (appliedSearch.trim()) {
      filters.search = appliedSearch.trim()
    }
    if (appliedRole && appliedRole !== 'allrole') {
      filters.name = appliedRole
    }
    dispatch(fetchAllRoles({ page: currentPage, filters }))
  }, [dispatch, currentPage, appliedSearch, appliedRole])

  const handleDeleteClick = (id: string, roleName: string) => {
    setDeleteModal({
      isOpen: true,
      id,
      roleName,
    })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteModal.id) return

    dispatch(clearRolesError())
    const result = await dispatch(deleteRole(deleteModal.id))
    if (deleteRole.fulfilled.match(result)) {
      const filters: { search?: string; role?: string } = {}
      if (appliedSearch.trim()) {
        filters.search = appliedSearch.trim()
      }
      if (appliedRole && appliedRole !== 'allrole') {
        filters.role = appliedRole
      }
      dispatch(fetchAllRoles({ page: currentPage, filters }))
      setDeleteModal({ isOpen: false, id: null, roleName: null })
    } else {
      setDeleteModal({ isOpen: false, id: null, roleName: null })
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(e.target.value)
  }

  const handleSubmit = () => {
    setAppliedSearch(searchText)
    setAppliedRole(roleFilter)
    dispatch(setCurrentPage(1))
  }

  const handleReset = () => {
    setSearchText('')
    setRoleFilter('allrole')
    setAppliedSearch('')
    setAppliedRole('allrole')
    dispatch(setCurrentPage(1))
  }

  const filterFields: FilterField[] = [
    {
      name: 'search',
      label: 'Search',
      type: 'text',
      placeholder: 'Quick Role search...',
      value: searchText,
      onChange: handleSearchChange as () => void,
    },
    {
      name: 'role',
      label: 'Search by Role',
      type: 'select',
      value: roleFilter,
      onChange: handleRoleChange as () => void,
      options: [
        { value: 'allrole', label: 'All Role' },
        { value: 'super_admin', label: 'Super Admin' },
        { value: 'employee', label: 'Employee' },
        { value: 'manager', label: 'Manager' },
        { value: 'team_lead', label: 'Team Lead' },
      ],
    },
  ]

  const columns = RolesListColumns({ onDeleteClick: handleDeleteClick })

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page))
  }

  return (
    <PageTransition>
      <div className="p-6 relative">
        <div className="flex justify-between max-w-auto rounded bg-white p-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: themeColors.text.primary }}>
              Roles
            </h1>
            <p className="mt-1 text-sm" style={{ color: themeColors.text.muted }}>
              Manage Roles
            </p>
          </div>
          <div>
            <div className="flex flex-wrap">
              <Link
                href="/user-management/roles/add-new-role"
                className="px-4 py-2 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 flex items-center gap-2"
                style={{ backgroundColor: themeColors.blue[600] }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = themeColors.blue[700])}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = themeColors.blue[600])}
                onFocus={e =>
                  (e.currentTarget.style.boxShadow = `0 0 0 2px ${themeColors.blue[400]}`)
                }
              >
                <Plus size={16} />
                Add New Role
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <Filters
            fields={filterFields}
            onReset={handleReset}
            onSubmit={handleSubmit}
            columns={2}
          />

          <DataTable
            columns={columns}
            data={Array.isArray(roles) ? roles : []}
            loading={loading || deleteLoading}
            totalItems={totalItems || 0}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            clientSidePagination={false}
            noDataMessage={
              <div className="text-center py-8">
                <p style={{ color: themeColors.text.muted }}>No Roles found</p>
              </div>
            }
            className="shadow-none rounded-none"
          />
          {error && (
            <div
              className="px-6 py-4 border-t"
              style={{ backgroundColor: themeColors.red[100], borderColor: themeColors.red[400] }}
            >
              <p className="text-sm" style={{ color: themeColors.text.error }}>
                {error}
              </p>
            </div>
          )}
        </div>

        <ConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, id: null, roleName: null })}
          onConfirm={handleDeleteConfirm}
          title="Delete Role"
          message={`Are you sure you want to delete role "${deleteModal.roleName}"?`}
          confirmText="Delete"
          cancelText="Cancel"
          confirmButtonClass=""
          isLoading={deleteLoading}
        />
      </div>
    </PageTransition>
  )
}
