export const userWithSameRoleColumns = () => [
  {
    key: 'name',
    label: 'Name',
    width: '50%',
    align: 'left' as const,
    render: (value: any, user: any) => (
      <div className="text-gray-900 font-medium">{user.name || 'N/A'}</div>
    ),
  },
  {
    key: 'email',
    label: 'Email',
    width: '50%',
    align: 'left' as const,
    render: (value: any, user: any) => <div className="text-gray-800">{user.email || 'N/A'}</div>,
  },
]
