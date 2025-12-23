export const getFilterOptions = ({
  searchText,
  roleFilter,
  handleSearchChange,
  handleRoleChange,
}: any) => [
  {
    name: 'search',
    label: 'Search',
    type: 'text',
    placeholder: 'Quick user search...',
    value: searchText,
    onChange: handleSearchChange as () => void,
  },
  {
    name: 'role',
    label: 'Search by Role',
    type: 'select',
    value: roleFilter,
    onChange: handleRoleChange as () => void,
    options: [
      { value: 'allrole', label: 'All Role' },
      { value: 'super_admin', label: 'Super Admin' },
      { value: 'employee', label: 'Employee' },
      { value: 'manager', label: 'Manager' },
      { value: 'team_lead', label: 'Team Lead' },
    ],
  },
]
