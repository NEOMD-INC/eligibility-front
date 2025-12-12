import GridActionButtons from '@/components/ui/buttons/grid-action-buttons/GridActionButtons'
import Link from 'next/link'
import { UserProfileImage } from '@/components/ui/image/Image'

interface UsersListColumnsProps {
  onDeleteClick?: (id: string, userName: string) => void
}

export default function UsersListColumns({ onDeleteClick }: UsersListColumnsProps = {}) {
  const userColumns = [
    {
      key: 'user',
      label: 'User',
      width: '30%',
      align: 'left' as const,
      render: (value: any, user: any) => {
        const userImage = user.profile_image_path || user.image || user.profile_image
        const userName =
          user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User'

        return (
          <Link href={`#`} className="block">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border border-gray-200 flex-shrink-0">
                <UserProfileImage
                  profileImagePath={userImage}
                  gender={user.gender as 'male' | 'female' | undefined}
                  width={40}
                />
              </div>
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
      key: 'email',
      label: 'Email',
      width: '25%',
      align: 'left' as const,
      render: (value: any, user: any) => (
        <div className="text-gray-900 truncate">{user.email || 'N/A'}</div>
      ),
    },
    {
      key: 'roles',
      label: 'Roles',
      width: '15%',
      align: 'center' as const,
      render: (value: any, user: any) => {
        const role = user.role || user.roles?.[0] || 'N/A'
        return (
          <div className="flex justify-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
              {role}
            </span>
          </div>
        )
      },
    },
    {
      key: 'created',
      label: 'Created',
      width: '15%',
      align: 'left' as const,
      render: (value: any, user: any) => {
        const createdDate = user.created_at || user.created || user.createdAt
        if (!createdDate) return <span className="text-gray-500">N/A</span>

        const date = new Date(createdDate)
        const formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
        return <div className="text-gray-900">{formattedDate}</div>
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '15%',
      align: 'center' as const,
      render: (value: any, user: any) => (
        <div className="flex justify-center items-center w-full">
          <GridActionButtons
            data={user}
            from="id"
            editBtnPath={`/user-management/users/edit-user/${user.id || user.uuid}`}
            showBtnPath={`/user-management/users/users-detail/${user.id || user.uuid}`}
            deleteResourceId={
              onDeleteClick
                ? (id: string) => {
                    const userName: string =
                      user.full_name ||
                      `${user.first_name || ''} ${user.last_name || ''}`.trim() ||
                      user.email ||
                      'user'
                    onDeleteClick(id, userName)
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

  return userColumns
}
