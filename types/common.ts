/**
 * Common base types used across the application
 */

// Base entity interface with common fields
export interface BaseEntity {
  id: number | string
  uuid?: string
  created_at?: string
  updated_at?: string
  createdAt?: string
}

// Base Redux state interface for list-based entities
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

// Base props for list column components
export interface BaseListColumnsProps {
  onDeleteClick?: (id: string, name: string) => void
  onEditClick?: (id: string) => void
  onViewClick?: (id: string) => void
}

// Generic list columns props with customizable delete handler
export interface ListColumnsProps<TName extends string = string> {
  onDeleteClick?: (id: string, name: TName) => void
}

// API response structure
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

// Pagination parameters
export interface PaginationParams {
  page: number
  itemsPerPage?: number
}

// Filter parameters (generic)
export interface FilterParams {
  [key: string]: string | number | boolean | undefined
}

