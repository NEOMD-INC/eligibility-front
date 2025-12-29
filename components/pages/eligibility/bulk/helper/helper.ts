import { DragHandler, DropHandler, FileChangeHandler, RemoveFileHandler } from '@/types/ui/form'

export const handleFileChange: FileChangeHandler = (event, formik, setUploadedFile) => {
  const file = event.target.files?.[0]
  if (file) {
    formik.setFieldValue('file', file)
    setUploadedFile(file)
  }
}

export const handleDrag: DragHandler = (e, setDragActive) => {
  e.preventDefault()
  e.stopPropagation()
  if (e.type === 'dragenter' || e.type === 'dragover') {
    setDragActive(true)
  } else if (e.type === 'dragleave') {
    setDragActive(false)
  }
}

export const handleDrop: DropHandler = (e, setDragActive, formik, setUploadedFile) => {
  e.preventDefault()
  e.stopPropagation()
  setDragActive(false)

  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    const file = e.dataTransfer.files[0]
    formik.setFieldValue('file', file)
    setUploadedFile(file)
    formik.setFieldTouched('file', true)
  }
}

export const removeFile: RemoveFileHandler = (formik, setUploadedFile) => {
  formik.setFieldValue('file', null)
  setUploadedFile(null)
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

export const getFileIcon = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase()
  if (extension === 'csv') {
    return '📄'
  }
  return '📎'
}
