'use client'
import React from 'react'
import { UserProfileImage } from '@/components/ui/image/Image'
import { useRouter } from 'next/navigation'

export default function UsersDetail() {
  const router = useRouter()

  const USER_DETAILS = [
    {
      title: 'Full Name',
      value: 'Super Admin',
    },
    {
      title: 'Email Address',
      value: 'superAdmin@gmail.com',
    },
    {
      title: 'Member Since',
      value: '13 jan 2023',
    },
    {
      title: 'Last Updated',
      value: '3 months ago',
    },
  ]
  const ROLE_DETAILS = [
    {
      title: 'superAdmin',
    },
    {
      title: 'Admin',
    },
  ]
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

  return (
    <div className="flex flex-col justify-center bg-gray-100 p-6 space-y-6">
      {/* Top Profile Card */}
      <div className="w-full bg-blue-600 text-white rounded-xl shadow-md p-6">
        {/* Row: Profile Info (left) + Go Back Button (right) */}
        <div className="flex items-center justify-between">
          {/* Left: Profile Info */}
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full overflow-hidden mr-3 border border-gray-200 flex-shrink-0">
              <UserProfileImage profileImagePath={null} width={80} />
            </div>

            <div>
              <h2 className="text-2xl font-semibold">superadmin</h2>
              <p className="text-blue-100">superadmin@gmail.com</p>
              <p className="text-sm mt-1 bg-blue-800 inline-block px-3 py-1 rounded-full">you</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Detail Card */}
      <div className="w-full bg-white shadow-lg rounded-xl p-8 ">
        <h1 className="text-2xl font-bold mb-4 pb-3">User Details</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-3">
          {USER_DETAILS.map((obj, index) => (
            <div key={index}>
              <p className="text-gray-500 font-semibold">{obj.title}</p>
              <p className="text-gray-800">{obj.value}</p>
            </div>
          ))}
        </div>

        <h1 className="text-2xl font-bold mb-4 pb-3 mt-5">Roles</h1>

        <div className=" border-b">
          {ROLE_DETAILS.map((obj, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 mb-5 rounded-full text-xs font-semibold bg-green-100 text-green-700 mr-2"
            >
              {obj.title}
            </span>
          ))}
        </div>

        <h1 className="text-2xl font-bold mb-4 pb-3 mt-5">Permissions</h1>

        <div className="border-b pb-6">
          {PERMISSIONS_GROUPED.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 capitalize">{group.title}</h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {group.permissions.map((permission, permIndex) => (
                  <span
                    key={permIndex}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-700"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <div>
            <button className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg shadow">
              Edit User
            </button>
          </div>
          <div>
            <button
              onClick={() => router.push('/user-management/users')}
              className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg shadow cursor-pointer"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
