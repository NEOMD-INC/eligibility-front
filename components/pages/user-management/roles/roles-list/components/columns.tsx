import GridActionButtons from '@/components/ui/buttons/grid-action-buttons/GridActionButtons'
import Link from 'next/link'
import { UserProfileImage } from '@/components/ui/image/Image'

interface RolesListColumnsProps {
  onDeleteClick?: (id: string, userName: string) => void
}

export default function RolesListColumns({ onDeleteClick }: RolesListColumnsProps = {}) {
  const rolesColumns = [
    {
      key: 'roleName',
      label: 'Role Name',
      width: '20%',
      align: 'left' as const,
      render: (value: any, user: any) => {
        const userImage = user.profile_image_path || user.image || user.profile_image
        const userName =
          user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User'

        return (
          <Link href={`#`} className="block">
            <div className="flex items-center">
              <div className="flex flex-col justify-start min-w-0">
                <div className="text-gray-900 font-semibold hover:text-blue-600 truncate">
                  {userName || 'N/A'}
                </div>
                {user.username && (
                  <span className="text-gray-500 text-sm truncate">{user.username}</span>
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
      render: (value: any, role: any) => {
        const userCount = role.user_count || role.users_count || 0
        return (
          <div className="flex justify-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
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
      render: (value: any, role: any) => {
        const permissions = role.permissions || role.permission_names || []
        return (
          <div className="flex justify-center">
            <div className="inline-flex items-center flex-wrap justify-center gap-1">
              {permissions.length > 0 ? (
                permissions.slice(0, 2).map((perm: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700"
                  >
                    {perm}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 text-sm">No permissions</span>
              )}
              {permissions.length > 2 && (
                <span className="text-gray-500 text-xs">+{permissions.length - 2} more</span>
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
      render: (value: any, role: any) => (
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
