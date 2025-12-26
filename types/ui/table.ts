import { ReactNode } from 'react'

export interface TableColumn<T = Record<string, unknown>> {
  key: string
  label: string
  sortable?: boolean
  render?: (value: unknown, row: T) => ReactNode
  width?: string
  align?: 'left' | 'center' | 'right'
}

export interface DataTableProps<T = Record<string, unknown>> {
  columns: TableColumn<T>[]
  data: T[]
  loading?: boolean
  totalItems: number
  itemsPerPage?: number
  currentPage?: number
  onPageChange?: (page: number) => void
  clientSidePagination?: boolean
  noDataMessage?: ReactNode
  renderRow?: (row: T, index: number) => ReactNode
  onSort?: (key: string, direction: 'asc' | 'desc') => void
  className?: string
}

export interface TablePaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  onPageChange: (page: number) => void
  pageSize: number
}
