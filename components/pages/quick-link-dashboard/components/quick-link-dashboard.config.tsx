import {
  Building2,
  Cog,
  CreditCard,
  History,
  MapPin,
  Upload,
  UserCheck,
  Wrench,
} from 'lucide-react'

export const getCategories = () => [
  {
    title: 'Carrier',
    items: [
      {
        name: 'Carrier Group',
        path: '/settings/carrier-group',
        icon: <Building2 size={24} />,
        description: 'Manage carrier groups',
      },
      {
        name: 'Carrier Address',
        path: '/settings/carrier-address',
        icon: <MapPin size={24} />,
        description: 'Manage carrier addresses',
      },
      {
        name: 'Carrier Setup',
        path: '/settings/carrier-setup',
        icon: <Wrench size={24} />,
        description: 'Configure carrier setups',
      },
      {
        name: 'Availity Payer',
        path: '/settings/availity-payer',
        icon: <CreditCard size={24} />,
        description: 'Manage Availity payers',
      },
    ],
  },
  {
    title: 'Eligibility',
    items: [
      {
        name: 'Individual Eligibility',
        path: '/eligibility/indivitual',
        icon: <UserCheck size={24} />,
        description: 'Check individual eligibility',
      },
      {
        name: 'Bulk Eligibility',
        path: '/eligibility/bulk',
        icon: <Upload size={24} />,
        description: 'Upload bulk eligibility file',
      },
      {
        name: 'Eligibility History',
        path: '/eligibility/history',
        icon: <History size={24} />,
        description: 'View eligibility history',
      },
      {
        name: 'Eligibility Settings',
        // path: '/eligibility/settings',
        path: '#',
        icon: <Cog size={24} />,
        description: 'Configure eligibility settings',
      },
    ],
  },
]
