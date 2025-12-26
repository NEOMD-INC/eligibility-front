import { MouseEventHandler } from 'react'

export interface SubmitButtonProps {
  type?: 'button' | 'submit' | 'reset'
  title: string
  class_name?: string
  callback_event?: MouseEventHandler<HTMLButtonElement> | string | null
  btnLoading?: boolean
}

export interface GotoBackButtonProps {
  id?: string
  closeWithAnimation?: (() => void) | null
}

export interface DeleteBtnProps {
  checkData?: boolean
  selectedRowIds: string[] | number[]
  deleteBulkData: (ids: string[] | number[], selectedIds: string[] | number[]) => void
}
