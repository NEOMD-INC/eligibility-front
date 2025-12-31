import { themeColors } from '@/theme'

export const userWithSameRoleColumns = () => [
  {
    key: 'name',
    label: 'Name',
    width: '50%',
    align: 'left' as const,
    render: (value: any, user: any) => (
      <div className="font-medium" style={{ color: themeColors.text.primary }}>
        {user.name || 'N/A'}
      </div>
    ),
  },
  {
    key: 'email',
    label: 'Email',
    width: '50%',
    align: 'left' as const,
    render: (value: any, user: any) => (
      <div style={{ color: themeColors.text.secondary }}>{user.email || 'N/A'}</div>
    ),
  },
]
