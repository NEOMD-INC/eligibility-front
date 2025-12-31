import { MouseEventHandler } from 'react'

export interface SubmitButtonProps {
  type?: 'button' | 'submit' | 'reset'
  title: string
  class_name?: string
  callback_event?: MouseEventHandler<HTMLButtonElement> | string | null
  btnLoading?: boolean
}

export interface DeleteBtnProps {
  checkData?: boolean
  selectedRowIds: string[] | number[]
  deleteBulkData: (ids: string[] | number[], selectedIds: string[] | number[]) => void
}

export interface GridActionButtonsProps {
  data: Record<string, any>
  from?: string
  editBtnPath?: string
  showBtnPath?: string
  deleteResourceId?: (id: string | number) => void
  retryResourceId?: (id: string | number) => void
  showIdDispatch?: (id: string | number | null) => void
  editIdDispatch?: (id: string | number | null) => void
  editDrawerId?: string
  showDrawerId?: string
  viewPermission?: boolean
  updatePermission?: boolean
  deletePermission?: boolean
  retryPermission?: boolean
  isUser?: boolean
  isPending?: boolean
}
