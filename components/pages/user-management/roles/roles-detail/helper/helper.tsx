export const getnormalizedUsers = (usersWithRole: any[]) =>
  usersWithRole.map((user: any) => {
    const userName =
      user.full_name ||
      (user.first_name && user.last_name
        ? `${user.first_name} ${user.last_name}`.trim()
        : user.first_name || user.last_name || user.name || 'N/A')

    return {
      id: user.id || user.uuid || '',
      name: userName,
      email: user.email || 'N/A',
    }
  })

export const getRoleInfo = (currentRole: any, normalizedUsers: any[]) => [
  { title: 'System Name', value: currentRole?.system_name || 'N/A' },
  { title: 'Role Name', value: currentRole?.name || 'N/A' },
  { title: 'Users with Role', value: normalizedUsers.length || currentRole?.users_count || 0 },
  { title: 'Permissions', value: currentRole?.permissions?.length || 'No role Permission' },
]

export const getNormalizedPermissions = (permissions: any[]) =>
  permissions
    .map((perm: any) => {
      if (typeof perm === 'string') {
        return perm
      } else if (perm && typeof perm === 'object') {
        return perm.name || perm.permission_name || perm.permission || String(perm)
      }
      return String(perm)
    })
    .filter((perm: string) => perm && perm.trim() !== '')

export const getPermissionsGrouped = (normalizedPermissions: string[]) =>
  normalizedPermissions.reduce((acc: any[], perm: string) => {
    if (typeof perm !== 'string') return acc

    const prefix = perm.split('_')[0] || 'other'
    const existingGroup = acc.find(g => g.title === prefix)
    if (existingGroup) {
      existingGroup.permissions.push(perm)
    } else {
      acc.push({
        title: prefix,
        permissions: [perm],
      })
    }
    return acc
  }, [])
