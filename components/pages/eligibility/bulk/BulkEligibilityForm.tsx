'use client'

import { useFormik } from 'formik'
import { CheckCircle2, File, Upload, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'

import { PageTransition } from '@/components/providers/page-transition-provider/PageTransitionProvider'
import {
  clearBulkData,
  clearBulkError,
  submitBulkEligibility,
} from '@/redux/slices/eligibility/bulk/actions'
import { AppDispatch, RootState } from '@/redux/store'

import {
  formatFileSize,
  getFileIcon,
  handleDrag,
  handleDrop,
  handleFileChange,
  removeFile,
} from './helper/helper'

const validationSchema = Yup.object({
  file: Yup.mixed<File | null>()
    .required('File is required')
    .test('fileType', 'Only CSV files are allowed', value => {
      if (!value) return false
      const file = value as File
      const allowedTypes = ['text/csv']
      const allowedExtensions = ['.csv']
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()

      return allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension)
    })
    .test('fileSize', 'File size must be less than 10MB', value => {
      if (!value) return false
      const file = value as File
      return file.size <= 10 * 1024 * 1024
    }),
})

export default function BulkEligibilityForm() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const { submitLoading, error, bulkData } = useSelector(
    (state: RootState) => state.eligibilityBulk
  )

  const formik = useFormik({
    initialValues: {
      file: null as File | null,
    },
    validationSchema,
    onSubmit: async values => {
      if (!values.file) return

      dispatch(clearBulkError())
      dispatch(clearBulkData())

      try {
        await dispatch(submitBulkEligibility(values.file)).unwrap()
        router.push('/eligibility/history')
      } catch (error) {
        console.log(error, 'Submission failed')
      }
    },
  })

  useEffect(() => {
    if (bulkData && !submitLoading) {
      formik.resetForm()
      setUploadedFile(null)
      dispatch(clearBulkData())
    }
  }, [bulkData, submitLoading, dispatch])

  useEffect(() => {
    if (error && !submitLoading) {
      dispatch(clearBulkError())
    }
  }, [error, submitLoading, dispatch])

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Upload Eligibility File</h1>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select File <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-gray-500 mb-4">Accepted formats: CSV (Max size: 10MB)</p>

              {!uploadedFile ? (
                <div
                  onDragEnter={e => handleDrag(e, setDragActive)}
                  onDragLeave={e => handleDrag(e, setDragActive)}
                  onDragOver={e => handleDrag(e, setDragActive)}
                  onDrop={e => handleDrop(e, setDragActive, formik, setUploadedFile)}
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
                    accept=".csv,text/csv"
                    onChange={e => handleFileChange(e, formik, setUploadedFile)}
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
                    <p className="text-sm text-gray-500">CSV files only</p>
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
                      onClick={() => removeFile(formik, setUploadedFile)}
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
                disabled={!formik.values.file || submitLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                {submitLoading ? 'Uploading...' : 'Upload File'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageTransition>
  )
}
