'use client'

import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Upload, File, X, CheckCircle2 } from 'lucide-react'
import { PageTransition } from '@/components/providers/page-transition-provider/PageTransitionProvider'

const validationSchema = Yup.object({
  file: Yup.mixed()
    .required('File is required')
    .test('fileType', 'Only CSV and Excel files are allowed', (value: any) => {
      if (!value) return false
      const file = value as File
      const allowedTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel.sheet.macroEnabled.12',
      ]
      const allowedExtensions = ['.csv', '.xls', '.xlsx', '.xlsm']
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()

      return allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension)
    })
    .test('fileSize', 'File size must be less than 10MB', (value: any) => {
      if (!value) return false
      const file = value as File
      return file.size <= 10 * 1024 * 1024 // 10MB
    }),
})

export default function BulkEligibilityForm() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const formik = useFormik({
    initialValues: {
      file: null as File | null,
    },
    validationSchema,
    onSubmit: async values => {
      try {
        // Handle file upload here
        console.log('File to upload:', values.file)
        // Add your API call here
        alert('File uploaded successfully!')
      } catch (error) {
        console.error('Upload error:', error)
        alert('Failed to upload file')
      }
    },
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      formik.setFieldValue('file', file)
      setUploadedFile(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
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

  const removeFile = () => {
    formik.setFieldValue('file', null)
    setUploadedFile(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    if (extension === 'csv') {
      return '📄'
    } else if (['xls', 'xlsx', 'xlsm'].includes(extension || '')) {
      return '📊'
    }
    return '📎'
  }

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Upload Eligibility File</h1>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* File Upload Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select File <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-gray-500 mb-4">
                Accepted formats: CSV, XLS, XLSX, XLSM (Max size: 10MB)
              </p>

              {!uploadedFile ? (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? 'border-blue-500 bg-blue-50'
                      : formik.touched.file && formik.errors.file
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="file"
                    id="file"
                    name="file"
                    accept=".csv,.xls,.xlsx,.xlsm,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
                    onChange={handleFileChange}
                    onBlur={formik.handleBlur}
                    className="hidden"
                  />
                  <label htmlFor="file" className="cursor-pointer">
                    <Upload
                      className={`mx-auto mb-4 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`}
                      size={48}
                    />
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Drag and drop your file here, or click to browse
                    </p>
                    <p className="text-sm text-gray-500">CSV, XLS, XLSX, or XLSM files only</p>
                  </label>
                </div>
              ) : (
                <div className="border-2 border-green-300 bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{getFileIcon(uploadedFile.name)}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <File className="text-green-600" size={20} />
                          <span className="font-medium text-gray-900">{uploadedFile.name}</span>
                          <CheckCircle2 className="text-green-600" size={18} />
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatFileSize(uploadedFile.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-md transition"
                      title="Remove file"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              )}

              {formik.touched.file && formik.errors.file && (
                <p className="mt-2 text-sm text-red-600">{formik.errors.file}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  formik.resetForm()
                  setUploadedFile(null)
                }}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!formik.values.file || formik.isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                {formik.isSubmitting ? 'Uploading...' : 'Upload File'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageTransition>
  )
}
