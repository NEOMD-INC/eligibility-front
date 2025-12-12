'use client'
import React, { useState } from 'react'
import { Check } from 'lucide-react'
import DataTable from '@/components/ui/data-table/DataTable'

export default function RolesDetail() {
  const ROLE_INFO = {
    systemName: 'cs',
    roleName: 'admin',
    usersWithRole: 3,
    description: 'Administrator role with full system access',
  }

  const PERMISSIONS_GROUPED = [
    {
      title: 'view',
      permissions: ['view role', 'view users'],
    },
    {
      title: 'create',
      permissions: ['create role'],
    },
    {
      title: 'edit',
      permissions: ['edit role', 'edit users', 'edit permissions'],
    },
    {
      title: 'delete',
      permissions: ['delete role', 'delete users', 'delete permissions'],
    },
    {
      title: 'import',
      permissions: ['import role'],
    },
    {
      title: 'retry',
      permissions: ['retry submission'],
    },
  ]

  const USERS_WITH_ROLE = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
    },
  ]

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const usersColumns = [
    {
      key: 'name',
      label: 'Name',
      width: '50%',
      align: 'left' as const,
      render: (value: any, user: any) => (
        <div className="text-gray-900 font-medium">{user.name}</div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      width: '50%',
      align: 'left' as const,
      render: (value: any, user: any) => (
        <div className="text-gray-800">{user.email}</div>
      ),
    },
  ]

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = USERS_WITH_ROLE.slice(startIndex, endIndex)

  return (
    <div className="flex flex-col justify-center bg-gray-100 p-6 space-y-6">
      {/* Main Detail Card */}
      <div className="w-full bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-4 pb-3">Role Details</h1>

        {/* Role Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6 mb-6">
          <div>
            <p className="text-gray-500 font-semibold mb-1">System Name</p>
            <p className="text-gray-800">{ROLE_INFO.systemName}</p>
          </div>
          <div>
            <p className="text-gray-500 font-semibold mb-1">Role Name</p>
            <p className="text-gray-800 capitalize">{ROLE_INFO.roleName}</p>
          </div>
          <div>
            <p className="text-gray-500 font-semibold mb-1">Users with this Role</p>
            <p className="text-gray-800">{ROLE_INFO.usersWithRole}</p>
          </div>
          <div>
            <p className="text-gray-500 font-semibold mb-1">Description</p>
            <p className="text-gray-800">{ROLE_INFO.description}</p>
          </div>
        </div>

        {/* Permissions Section - Separate Card */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Permissions</h2>
          <div className="space-y-4">
            {PERMISSIONS_GROUPED.map((group, groupIndex) => (
              <div key={groupIndex} className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 capitalize">{group.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.permissions.map((permission, permIndex) => (
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
            ))}
          </div>
        </div>

        {/* Users Table Section */}
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Users with the same role</h2>
          <DataTable
            columns={usersColumns}
            data={paginatedData}
            loading={false}
            totalItems={USERS_WITH_ROLE.length}
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

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-6 pt-6 border-t">
          <button
            onClick={() => window.history.back()}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow transition"
          >
            Go Back
          </button>
          <button className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg shadow transition">
            Edit Role
          </button>
        </div>
      </div>
    </div>
  )
}

