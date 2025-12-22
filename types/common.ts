export interface BaseEntity {
  id: number | string
  uuid?: string
  created_at?: string
  updated_at?: string
  createdAt?: string
}

export interface BaseListState<T> {
  items: T[]
  currentItem: T | null
  loading: boolean
  error: string | null
  totalItems: number
  currentPage: number
  itemsPerPage: number
  createLoading: boolean
  updateLoading: boolean
  deleteLoading: boolean
  fetchItemLoading: boolean
}

export interface BaseListColumnsProps {
  onDeleteClick?: (id: string, name: string) => void
  onEditClick?: (id: string) => void
  onViewClick?: (id: string) => void
}

export interface ListColumnsProps<TName extends string = string> {
  onDeleteClick?: (id: string, name: TName) => void
}

export interface ApiResponse<T> {
  data: T
  message?: string
  total?: number
  meta?: {
    total: number
    per_page?: number
    current_page?: number
  }
}

export interface PaginationParams {
  page: number
  itemsPerPage?: number
}

export interface FilterParams {
  [key: string]: string | number | boolean | undefined
}
