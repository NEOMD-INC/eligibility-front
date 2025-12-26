import { formatDate } from '@/utils/formatDate'

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
    value: formatDate(currentUser?.created_at, 'user'),
  },
  {
    title: 'Last Updated',
    value: currentUser?.updated_at ? formatDate(currentUser.updated_at, 'user') : 'N/A',
  },
]

export const getRoleDetails = (currentUser: any) => {
  if (!currentUser) return []

  // Check for roles array first
  if (currentUser.roles && Array.isArray(currentUser.roles) && currentUser.roles.length > 0) {
    return currentUser.roles.map((role: any) => ({
      title: typeof role === 'string' ? role : role?.name || role?.title || 'N/A',
    }))
  }

  // Check for single role object
  if (currentUser.role) {
    return [
      {
        title:
          typeof currentUser.role === 'string'
            ? currentUser.role
            : currentUser.role?.name || currentUser.role?.title || 'N/A',
      },
    ]
  }

  // Check for role_id and fetch role name if needed
  if (currentUser.role_id) {
    return [
      {
        title: String(currentUser.role_id),
      },
    ]
  }

  return []
}

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
