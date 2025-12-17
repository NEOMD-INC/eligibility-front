'use client'
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { Check } from 'lucide-react'
import ComponentLoader from '@/components/ui/loader/component-loader/ComponentLoader'
import DataTable from '@/components/ui/data-table/DataTable'
import {
  fetchRoleById,
  clearRolesError,
  clearCurrentRole,
} from '@/redux/slices/user-management/roles/actions'
import { AppDispatch, RootState } from '@/redux/store'
import { userWithSameRoleColumns } from './components/columns'
import {
  getnormalizedUsers,
  getRoleInfo,
  getNormalizedPermissions,
  getPermissionsGrouped,
} from './helper/helper'

export default function RolesDetail() {
  const router = useRouter()
  const params = useParams()
  const roleId = params?.id as string | undefined
  const dispatch = useDispatch<AppDispatch>()
  const { currentRole, fetchRoleLoading, error } = useSelector((state: RootState) => state.roles)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Fetch role data on component mount
  useEffect(() => {
    if (roleId) {
      dispatch(clearRolesError())
      dispatch(clearCurrentRole())
      dispatch(fetchRoleById(roleId))
    }

    return () => {
      if (roleId) {
        dispatch(clearCurrentRole())
      }
    }
  }, [dispatch, roleId])

  const usersWithRole = currentRole?.users || []

  const normalizedUsers = getnormalizedUsers(usersWithRole)

  const ROLE_INFO = getRoleInfo(currentRole, normalizedUsers)

  const permissions = currentRole?.permissions || []

  const normalizedPermissions = getNormalizedPermissions(permissions)

  const PERMISSIONS_GROUPED = getPermissionsGrouped(normalizedPermissions)

  const usersColumns = userWithSameRoleColumns()

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (fetchRoleLoading) {
    return <ComponentLoader component="role details" variant="card" />
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center bg-gray-100 p-6 space-y-6">
        <div className="w-full bg-white shadow-lg rounded-xl p-8">
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => router.back()}
              className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!currentRole) {
    return (
      <div className="flex flex-col justify-center bg-gray-100 p-6 space-y-6">
        <div className="w-full bg-white shadow-lg rounded-xl p-8">
          <div className="text-center py-8">
            <p className="text-gray-500">Role not found</p>
            <button
              onClick={() => router.back()}
              className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-center bg-gray-100 p-6 space-y-6">
      <div className="w-full bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-4 pb-3">Role Details</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6 mb-6">
          {ROLE_INFO.map((info: { title: string; value: any | string }, index) => (
            <div key={index}>
              <p className="text-gray-500 font-semibold mb-1">{info.title}</p>
              <p className="text-gray-800">{info.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Permissions</h2>
          {PERMISSIONS_GROUPED.length > 0 ? (
            <div className="space-y-4">
              {PERMISSIONS_GROUPED.map(
                (group: { title: string; permissions: string[] }, groupIndex: number) => (
                  <div key={groupIndex} className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 capitalize">
                      {group.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {group.permissions.map((permission: string, permIndex: number) => (
                        <span
                          key={permIndex}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700"
                        >
                          <Check className="w-3 h-3" />
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">No permissions assigned</p>
            </div>
          )}
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Users with the same role</h2>
          <DataTable
            columns={usersColumns}
            data={normalizedUsers}
            loading={fetchRoleLoading}
            totalItems={normalizedUsers.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            clientSidePagination={true}
            noDataMessage={
              <div className="text-center py-8">
                <p className="text-gray-500">No users found</p>
              </div>
            }
            className="shadow-none rounded-none"
          />
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-6 border-t">
          <button
            onClick={() => router.back()}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow transition"
          >
            Go Back
          </button>
          <button
            onClick={() => router.push(`/user-management/roles/edit/${roleId}`)}
            className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg shadow transition"
          >
            Edit Role
          </button>
        </div>
      </div>
    </div>
  )
}
