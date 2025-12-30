'use client'
import { Check } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { PageTransition } from '@/components/providers/page-transition-provider/PageTransitionProvider'
import DataTable from '@/components/ui/data-table/DataTable'
import ComponentLoader from '@/components/ui/loader/component-loader/ComponentLoader'
import {
  clearCurrentRole,
  clearRolesError,
  fetchRoleById,
} from '@/redux/slices/user-management/roles/actions'
import { AppDispatch, RootState } from '@/redux/store'
import { themeColors } from '@/theme'

import { userWithSameRoleColumns } from './components/columns'
import {
  getNormalizedPermissions,
  getnormalizedUsers,
  getPermissionsGrouped,
  getRoleInfo,
} from './helper/helper'

export default function RolesDetail() {
  const router = useRouter()
  const params = useParams()
  const roleId = params?.id as string | undefined
  const dispatch = useDispatch<AppDispatch>()
  const { currentRole, fetchRoleLoading, error } = useSelector((state: RootState) => state.roles)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

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
      <div
        className="flex flex-col justify-center p-6 space-y-6"
        style={{ backgroundColor: themeColors.gray[100] }}
      >
        <div className="w-full bg-white shadow-lg rounded-xl p-8">
          <div className="text-center py-8">
            <p style={{ color: themeColors.text.error }}>{error}</p>
            <button
              onClick={() => router.back()}
              className="mt-4 px-4 py-2 rounded-lg"
              style={{
                backgroundColor: themeColors.gray[300],
                color: themeColors.text.secondary,
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = themeColors.gray[400])}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = themeColors.gray[300])}
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
      <div
        className="flex flex-col justify-center p-6 space-y-6"
        style={{ backgroundColor: themeColors.gray[100] }}
      >
        <div className="w-full bg-white shadow-lg rounded-xl p-8">
          <div className="text-center py-8">
            <p style={{ color: themeColors.text.muted }}>Role not found</p>
            <button
              onClick={() => router.back()}
              className="mt-4 px-4 py-2 rounded-lg"
              style={{
                backgroundColor: themeColors.gray[300],
                color: themeColors.text.secondary,
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = themeColors.gray[400])}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = themeColors.gray[300])}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <PageTransition>
      <div
        className="flex flex-col justify-center p-6 space-y-6"
        style={{ backgroundColor: themeColors.gray[100] }}
      >
        <div className="w-full bg-white shadow-lg rounded-xl p-8">
          <h1 className="text-2xl font-bold mb-4 pb-3">Role Details</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6 mb-6">
            {ROLE_INFO.map((info: { title: string; value: any | string }, index) => (
              <div key={index}>
                <p className="font-semibold mb-1" style={{ color: themeColors.text.muted }}>
                  {info.title}
                </p>
                <p style={{ color: themeColors.text.secondary }}>{info.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-lg p-6 mb-6" style={{ backgroundColor: themeColors.gray[50] }}>
            <h2 className="text-xl font-bold mb-4">Permissions</h2>
            {PERMISSIONS_GROUPED.length > 0 ? (
              <div className="space-y-4">
                {PERMISSIONS_GROUPED.map(
                  (group: { title: string; permissions: string[] }, groupIndex: number) => (
                    <div key={groupIndex} className="mb-4">
                      <h3
                        className="text-lg font-semibold mb-3 capitalize"
                        style={{ color: themeColors.text.primary }}
                      >
                        {group.title}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {group.permissions.map((permission: string, permIndex: number) => (
                          <span
                            key={permIndex}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
                            style={{
                              backgroundColor: themeColors.blue[100],
                              color: themeColors.blue[700],
                            }}
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
                <p style={{ color: themeColors.text.muted }}>No permissions assigned</p>
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
                  <p style={{ color: themeColors.text.muted }}>No users found</p>
                </div>
              }
              className="shadow-none rounded-none"
            />
          </div>

          <div className="flex justify-end gap-2 mt-6 pt-6 border-t">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 rounded-lg shadow transition"
              style={{
                backgroundColor: themeColors.gray[300],
                color: themeColors.text.secondary,
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = themeColors.gray[400])}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = themeColors.gray[300])}
            >
              Go Back
            </button>
            <button
              onClick={() => router.push(`/user-management/roles/edit/${roleId}`)}
              className="text-white px-4 py-2 rounded-lg shadow transition"
              style={{ backgroundColor: themeColors.blue[700] }}
              onMouseEnter={e =>
                (e.currentTarget.style.backgroundColor = themeColors.blue[700] || '#1e40af')
              }
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = themeColors.blue[700])}
            >
              Edit Role
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
