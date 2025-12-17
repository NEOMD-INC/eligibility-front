const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const getUserDetails = (currentUser: any) => [
  {
    title: 'Full Name',
    value: currentUser?.name || 'N/A',
  },
  {
    title: 'Email Address',
    value: currentUser?.email || 'N/A',
  },
  {
    title: 'Member Since',
    value: formatDate(currentUser?.created_at),
  },
  {
    title: 'Last Updated',
    value: currentUser?.updated_at ? formatDate(currentUser.updated_at) : 'N/A',
  },
]

export const getRoleDetails = (currentUser: any) =>
  currentUser?.roles
    ? currentUser.roles.map((role: any) => ({
        title: typeof role === 'string' ? role : role?.name || 'N/A',
      }))
    : currentUser?.role
      ? [
          {
            title:
              typeof currentUser.role === 'string'
                ? currentUser.role
                : currentUser.role?.name || 'N/A',
          },
        ]
      : []

export const groupPermissionsByPrefix = (permissions: any[]) => {
  if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
    return []
  }

  const grouped: { [key: string]: string[] } = {}

  permissions.forEach((permission: any) => {
    const permissionName = typeof permission === 'string' ? permission : permission?.name || ''

    if (permissionName) {
      const prefix = permissionName.split('_')[0] || permissionName

      if (!grouped[prefix]) {
        grouped[prefix] = []
      }

      grouped[prefix].push(permissionName)
    }
  })

  return Object.keys(grouped)
    .sort()
    .map(prefix => ({
      name: prefix,
      permissions: grouped[prefix],
    }))
}
