'use client'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { PageTransition } from '@/components/providers/page-transition-provider/PageTransitionProvider'
import { UserProfileImage } from '@/components/ui/image/Image'
import ComponentLoader from '@/components/ui/loader/component-loader/ComponentLoader'
import {
  clearCurrentUser,
  clearUsersError,
  fetchUserById,
} from '@/redux/slices/user-management/users/actions'
import { AppDispatch, RootState } from '@/redux/store'
import { themeColors } from '@/theme'

import { getRoleDetails, getUserDetails, groupPermissionsByPrefix } from './helper/helper'

export default function UsersDetail() {
  const router = useRouter()
  const params = useParams()
  const userId = params?.id as string
  const dispatch = useDispatch<AppDispatch>()
  const { currentUser, fetchUserLoading, error } = useSelector((state: RootState) => state.users)

  useEffect(() => {
    if (userId) {
      dispatch(clearUsersError())
      dispatch(fetchUserById(userId))
    }
    return () => {
      dispatch(clearCurrentUser())
    }
  }, [dispatch, userId])

  const USER_DETAILS = getUserDetails(currentUser)

  const ROLE_DETAILS = getRoleDetails(currentUser)

  const allPermissions = currentUser?.roles?.flatMap((role: any) => role?.permissions || []) || []
  const PERMISSIONS_GROUPED = groupPermissionsByPrefix(allPermissions)

  if (fetchUserLoading) {
    return <ComponentLoader component="user details" />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="text-center">
          <p className="mb-4" style={{ color: themeColors.text.error }}>
            {error}
          </p>
          <button
            onClick={() => router.push('/user-management/users')}
            className="px-4 py-2 text-white rounded-md"
            style={{ backgroundColor: themeColors.blue[600] }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = themeColors.blue[700])}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = themeColors.blue[600])}
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="text-center">
          <p className="mb-4" style={{ color: themeColors.gray[600] }}>
            User not found
          </p>
          <button
            onClick={() => router.push('/user-management/users')}
            className="px-4 py-2 text-white rounded-md"
            style={{ backgroundColor: themeColors.blue[600] }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = themeColors.blue[700])}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = themeColors.blue[600])}
          >
            Go Back
          </button>
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
        <div
          className="w-full text-white rounded-xl shadow-md p-6"
          style={{ backgroundColor: themeColors.blue[600] }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div
                className="w-20 h-20 rounded-full overflow-hidden mr-3 border flex-shrink-0"
                style={{ borderColor: themeColors.border.default }}
              >
                <UserProfileImage profileImagePath={currentUser?.profile_image_path} width={80} />
              </div>

              <div>
                <h2 className="text-2xl font-semibold">
                  {currentUser?.username || currentUser?.full_name || 'User'}
                </h2>
                <p style={{ color: themeColors.blue[100] }}>{currentUser?.email || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full bg-white shadow-lg rounded-xl p-8 ">
          <h1 className="text-2xl font-bold mb-4 pb-3">User Details</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-3">
            {USER_DETAILS.map((obj, index) => (
              <div key={index}>
                <p className="font-semibold" style={{ color: themeColors.text.muted }}>
                  {obj.title}
                </p>
                <p style={{ color: themeColors.text.secondary }}>{obj.value}</p>
              </div>
            ))}
          </div>

          <h1 className="text-2xl font-bold mb-4 pb-3 mt-5">Roles</h1>

          <div className="border-b pb-6">
            {ROLE_DETAILS && ROLE_DETAILS.length > 0 ? (
              ROLE_DETAILS.map((obj: { title: string }, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 mb-5 rounded-full text-xs font-semibold mr-2"
                  style={{ backgroundColor: themeColors.green[100], color: themeColors.green[600] }}
                >
                  {obj.title}
                </span>
              ))
            ) : (
              <p className="text-sm mb-5" style={{ color: themeColors.text.muted }}>
                No roles assigned
              </p>
            )}
          </div>

          {PERMISSIONS_GROUPED.length > 0 && (
            <>
              <h1 className="text-2xl font-bold mb-4 pb-3 mt-5">Permissions</h1>

              <div className="border-b pb-6">
                {PERMISSIONS_GROUPED.map((group: any, groupIndex: number) => (
                  <div key={groupIndex} className="mb-4">
                    <h3
                      className="text-lg font-semibold mb-3 capitalize"
                      style={{ color: themeColors.text.primary }}
                    >
                      {group.name}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {group.permissions?.map((permission: string, permIndex: number) => (
                        <span
                          key={permIndex}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: themeColors.gray[100],
                            color: themeColors.gray[700],
                          }}
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 mt-5">
            <div>
              <button
                onClick={() => router.push(`/user-management/users/edit/${userId}`)}
                className="text-white px-4 py-2 rounded-lg shadow"
                style={{ backgroundColor: themeColors.blue[700] }}
                onMouseEnter={e =>
                  (e.currentTarget.style.backgroundColor = themeColors.blue[700] || '#1e40af')
                }
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = themeColors.blue[700])}
              >
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
    </PageTransition>
  )
}
