import { FormikProps } from 'formik'
import { Dispatch, SetStateAction } from 'react'

export interface FileUploadFormValues {
  file: File | null
}

export interface FileUploadHelpers {
  formik: FormikProps<FileUploadFormValues>
  setUploadedFile: Dispatch<SetStateAction<File | null>>
  setDragActive: Dispatch<SetStateAction<boolean>>
}

export type FileChangeHandler = (
  event: React.ChangeEvent<HTMLInputElement>,
  formik: FormikProps<FileUploadFormValues>,
  setUploadedFile: Dispatch<SetStateAction<File | null>>
) => void

export type DragHandler = (
  e: React.DragEvent,
  setDragActive: Dispatch<SetStateAction<boolean>>
) => void

export type DropHandler = (
  e: React.DragEvent,
  setDragActive: Dispatch<SetStateAction<boolean>>,
  formik: FormikProps<FileUploadFormValues>,
  setUploadedFile: Dispatch<SetStateAction<File | null>>
) => void

export type RemoveFileHandler = (
  formik: FormikProps<FileUploadFormValues>,
  setUploadedFile: Dispatch<SetStateAction<File | null>>
) => void
