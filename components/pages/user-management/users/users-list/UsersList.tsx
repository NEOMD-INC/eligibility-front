'use client'

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DataTable from '@/components/ui/data-table/DataTable'
import UsersListColumns from './components/columns'
import Filters, { FilterField } from '@/components/ui/filters/Filters'
import { themeColors } from '@/theme'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import {
  fetchAllUsers,
  deleteUser,
  setCurrentPage,
  clearUsersError,
} from '@/redux/slices/user-management/users/actions'
import { AppDispatch, RootState } from '@/redux/store'
import { PageTransition } from '@/components/providers/page-transition-provider/PageTransitionProvider'
import { getFilterOptions } from './components/users-list.config'

export default function UsersList() {
  const dispatch = useDispatch<AppDispatch>()
  const { users, loading, totalItems, currentPage, deleteLoading, error } = useSelector(
    (state: RootState) => state.users
  )
  const [searchText, setSearchText] = useState('')
  const [roleFilter, setRoleFilter] = useState('allrole')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [appliedRole, setAppliedRole] = useState('allrole')
  const itemsPerPage = 8

  useEffect(() => {
    const filters: { search?: string; role?: string } = {}
    if (appliedSearch.trim()) {
      filters.search = appliedSearch.trim()
    }
    if (appliedRole && appliedRole !== 'allrole') {
      filters.role = appliedRole
    }
    dispatch(fetchAllUsers({ page: currentPage, filters }))
  }, [dispatch, currentPage, appliedSearch, appliedRole])

  const handleDeleteClick = async (id: string, userName: string) => {
    if (confirm(`Are you sure you want to delete user "${userName}"?`)) {
      dispatch(clearUsersError())
      const result = await dispatch(deleteUser(id))
      if (deleteUser.fulfilled.match(result)) {
        const filters: { search?: string; role?: string } = {}
        if (appliedSearch.trim()) {
          filters.search = appliedSearch.trim()
        }
        if (appliedRole && appliedRole !== 'allrole') {
          filters.role = appliedRole
        }
        dispatch(fetchAllUsers({ page: currentPage, filters }))
      }
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

  const filterFields: any[] = getFilterOptions({
    searchText,
    roleFilter,
    handleSearchChange,
    handleRoleChange,
  })

  const columns = UsersListColumns({ onDeleteClick: handleDeleteClick })

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page))
  }

  return (
    <PageTransition>
      <div className="p-6">
        <div className="flex justify-between max-w-auto rounded bg-white p-6">
          <div>
            <h1
              className="text-2xl font-bold text-gray-900"
              style={{ color: themeColors.text.primary }}
            >
              Users
            </h1>
            <p className="mt-1 text-sm text-gray-500" style={{ color: themeColors.text.muted }}>
              Manage system users and their permissions
            </p>
          </div>
          <div>
            <div className="flex flex-wrap">
              <Link
                href="/user-management/users/add-new-user"
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
              >
                <Plus size={16} />
                Add New User
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
            data={Array.isArray(users) ? users : []}
            loading={loading || deleteLoading}
            totalItems={totalItems || 0}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            clientSidePagination={false}
            noDataMessage={
              <div className="text-center py-8">
                <p className="text-gray-500">No users found</p>
              </div>
            }
            className="shadow-none rounded-none"
          />
          {error && (
            <div className="px-6 py-4 bg-red-50 border-t border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
