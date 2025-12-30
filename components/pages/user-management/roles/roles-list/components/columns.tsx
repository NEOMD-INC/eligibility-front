import Link from 'next/link'

import GridActionButtons from '@/components/ui/buttons/grid-action-buttons/GridActionButtons'
import { themeColors } from '@/theme'

interface RolesListColumnsProps {
  onDeleteClick?: (id: string, userName: string) => void
}

export default function RolesListColumns({ onDeleteClick }: RolesListColumnsProps = {}) {
  const rolesColumns = [
    {
      key: 'name',
      label: 'Role Name',
      width: '20%',
      align: 'left' as const,
      render: (role: any) => {
        const roleName = role.name || role.role_name || 'N/A'
        const roleId = role.id || role.uuid

        return (
          <Link href={`/user-management/roles/role-detail/${roleId}`} className="block">
            <div className="flex items-center">
              <div className="flex flex-col justify-start min-w-0">
                <div
                  className="font-semibold truncate"
                  style={{ color: themeColors.text.primary }}
                  onMouseEnter={e => (e.currentTarget.style.color = themeColors.text.link)}
                  onMouseLeave={e => (e.currentTarget.style.color = themeColors.text.primary)}
                >
                  {roleName}
                </div>
                {role.guard_name && (
                  <span className="text-sm truncate" style={{ color: themeColors.text.muted }}>
                    {role.guard_name}
                  </span>
                )}
              </div>
            </div>
          </Link>
        )
      },
    },
    {
      key: 'users',
      label: 'Users',
      width: '15%',
      align: 'center' as const,
      render: (role: any) => {
        const userCount = role.user_count || role.users_count || 0
        return (
          <div className="flex justify-center">
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
              style={{ backgroundColor: themeColors.green[100], color: themeColors.green[600] }}
            >
              {userCount} {userCount === 1 ? 'user' : 'users'}
            </span>
          </div>
        )
      },
    },
    {
      key: 'permissions',
      label: 'Permissions',
      width: '15%',
      align: 'center' as const,
      render: (role: any) => {
        const permissions = role.permissions || role.permission_names || []
        const permissionList = Array.isArray(permissions)
          ? permissions.map((perm: any) =>
              typeof perm === 'string' ? perm : perm.name || perm.permission_name || perm
            )
          : []

        return (
          <div className="flex justify-center">
            <div className="inline-flex items-center flex-wrap justify-center gap-1">
              {permissionList.length > 0 ? (
                permissionList.slice(0, 2).map((perm: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: themeColors.green[100],
                      color: themeColors.green[600],
                    }}
                  >
                    {perm}
                  </span>
                ))
              ) : (
                <span className="text-sm" style={{ color: themeColors.text.muted }}>
                  No permissions
                </span>
              )}
              {permissionList.length > 2 && (
                <span className="text-xs" style={{ color: themeColors.text.muted }}>
                  +{permissionList.length - 2} more
                </span>
              )}
            </div>
          </div>
        )
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '15%',
      align: 'center' as const,
      render: (role: any) => (
        <div className="flex justify-center items-center w-full">
          <GridActionButtons
            data={role}
            from="id"
            editBtnPath={`/user-management/roles/edit/${role.id || role.uuid}`}
            showBtnPath={`/user-management/roles/role-detail/${role.id || role.uuid}`}
            deleteResourceId={
              onDeleteClick
                ? (id: string) => {
                    const roleName: string = role.name || role.role_name || 'role'
                    onDeleteClick(id, roleName)
                  }
                : undefined
            }
            showIdDispatch={() => {}}
            editIdDispatch={() => {}}
            editDrawerId=""
            showDrawerId=""
            viewPermission={true}
            updatePermission={true}
            deletePermission={true}
            isUser={true}
          />
        </div>
      ),
    },
  ]

  return rolesColumns
}
