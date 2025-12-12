import GridActionButtons from '@/components/ui/buttons/grid-action-buttons/GridActionButtons'
import Link from 'next/link'

interface PermissionsListColumnsProps {
  onDeleteClick?: (id: string, permissionName: string) => void
}

export default function PermissionsListColumns({
  onDeleteClick,
}: PermissionsListColumnsProps = {}) {
  const permissionsColumns = [
    {
      key: 'name',
      label: 'Permission Name',
      width: '25%',
      align: 'left' as const,
      render: (value: any, permission: any) => {
        const permissionName = permission.name || 'N/A'
        return (
          <Link href={`#`} className="block">
            <div className="text-gray-900 font-semibold hover:text-blue-600 truncate">
              {permissionName}
            </div>
          </Link>
        )
      },
    },
    {
      key: 'roles',
      label: 'Roles',
      width: '15%',
      align: 'center' as const,
      render: (value: any, permission: any) => {
        const role = permission.role || permission.roles?.[0] || 'N/A'
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
      key: 'actions',
      label: 'Actions',
      width: '15%',
      align: 'center' as const,
      render: (value: any, permission: any) => (
        <div className="flex justify-center items-center w-full">
          <GridActionButtons
            data={permission}
            from="id"
            editBtnPath={`/user-management/permissions/edit/${permission.id || permission.uuid}`}
            showBtnPath={`/user-management/permissions/${permission.id || permission.uuid}`}
            deleteResourceId={
              onDeleteClick
                ? (id: string) => {
                    const permissionName: string =
                      permission.name || permission.slug || 'permission'
                    onDeleteClick(id, permissionName)
                  }
                : undefined
            }
            showIdDispatch={() => {}}
            editIdDispatch={() => {}}
            editDrawerId=""
            showDrawerId=""
            viewPermission={false}
            updatePermission={true}
            deletePermission={true}
            isUser={true}
          />
        </div>
      ),
    },
  ]

  return permissionsColumns
}
