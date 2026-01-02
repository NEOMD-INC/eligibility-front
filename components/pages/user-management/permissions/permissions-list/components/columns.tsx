import Link from 'next/link'

import GridActionButtons from '@/components/ui/buttons/grid-action-buttons/GridActionButtons'
import { themeColors } from '@/theme'

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
            <div
              className="font-semibold truncate"
              style={{ color: themeColors.text.primary }}
              onMouseEnter={e => (e.currentTarget.style.color = themeColors.text.link)}
              onMouseLeave={e => (e.currentTarget.style.color = themeColors.text.primary)}
            >
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
        const role = permission.roles_count || 'N/A'
        return (
          <div className="flex justify-center">
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
              style={{ backgroundColor: themeColors.green[100], color: themeColors.green[600] }}
            >
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
                ? (id: string | number) => {
                    const permissionName: string =
                      permission.name || permission.slug || 'permission'
                    onDeleteClick(String(id), permissionName)
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
