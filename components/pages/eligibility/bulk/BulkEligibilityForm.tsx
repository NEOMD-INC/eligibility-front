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
import { themeColors } from '@/theme'

import {
  formatFileSize,
  getFileIcon,
  handleDrag,
  handleDrop,
  handleFileChange,
  removeFile,
} from './helper/helper'

const validationSchema = Yup.object({
  file: Yup.mixed<File>()
    .required('File is required')
    .nullable()
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
          <h1 className="text-2xl font-semibold mb-6" style={{ color: themeColors.text.primary }}>
            Upload Eligibility File
          </h1>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: themeColors.gray[700] }}
              >
                Select File <span style={{ color: themeColors.text.error }}>*</span>
              </label>
              <p className="text-sm mb-4" style={{ color: themeColors.text.muted }}>
                Accepted formats: CSV (Max size: 10MB)
              </p>

              {!uploadedFile ? (
                <div
                  onDragEnter={e => handleDrag(e, setDragActive)}
                  onDragLeave={e => handleDrag(e, setDragActive)}
                  onDragOver={e => handleDrag(e, setDragActive)}
                  onDrop={e => handleDrop(e, setDragActive, formik, setUploadedFile)}
                  className="border-2 border-dashed rounded-lg p-8 text-center transition-colors"
                  style={{
                    borderColor: dragActive
                      ? themeColors.blue[400]
                      : formik.touched.file && formik.errors.file
                        ? themeColors.red[400]
                        : themeColors.border.default,
                    backgroundColor: dragActive
                      ? themeColors.blue[100]
                      : formik.touched.file && formik.errors.file
                        ? themeColors.red[100]
                        : themeColors.gray[50],
                  }}
                  onMouseEnter={e => {
                    if (!dragActive && !(formik.touched.file && formik.errors.file)) {
                      e.currentTarget.style.borderColor = themeColors.gray[400]
                    }
                  }}
                  onMouseLeave={e => {
                    if (!dragActive && !(formik.touched.file && formik.errors.file)) {
                      e.currentTarget.style.borderColor = themeColors.border.default
                    }
                  }}
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
                      className="mx-auto mb-4"
                      size={48}
                      style={{ color: dragActive ? themeColors.blue[400] : themeColors.gray[400] }}
                    />
                    <p
                      className="text-lg font-medium mb-2"
                      style={{ color: themeColors.gray[700] }}
                    >
                      Drag and drop your file here, or click to browse
                    </p>
                    <p className="text-sm" style={{ color: themeColors.text.muted }}>
                      CSV files only
                    </p>
                  </label>
                </div>
              ) : (
                <div
                  className="border-2 rounded-lg p-4"
                  style={{
                    borderColor: themeColors.green[500],
                    backgroundColor: themeColors.green[100],
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{getFileIcon(uploadedFile.name)}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <File size={20} style={{ color: themeColors.green[600] }} />
                          <span className="font-medium" style={{ color: themeColors.text.primary }}>
                            {uploadedFile.name}
                          </span>
                          <CheckCircle2 size={18} style={{ color: themeColors.green[600] }} />
                        </div>
                        <p className="text-sm mt-1" style={{ color: themeColors.text.muted }}>
                          {formatFileSize(uploadedFile.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(formik, setUploadedFile)}
                      className="p-2 rounded-md transition"
                      style={{ color: themeColors.text.error }}
                      onMouseEnter={e =>
                        (e.currentTarget.style.backgroundColor = themeColors.red[100])
                      }
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                      title="Remove file"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              )}

              {formik.touched.file && formik.errors.file && (
                <p className="mt-2 text-sm" style={{ color: themeColors.text.error }}>
                  {formik.errors.file}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  formik.resetForm()
                  setUploadedFile(null)
                }}
                className="px-6 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 transition"
                style={{
                  borderColor: themeColors.border.default,
                  color: themeColors.gray[700],
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = themeColors.gray[50])}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = themeColors.white)}
                onFocus={e =>
                  (e.currentTarget.style.boxShadow = `0 0 0 2px ${themeColors.gray[300]}`)
                }
                onBlur={e => (e.currentTarget.style.boxShadow = '')}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!formik.values.file || submitLoading}
                className="px-6 py-2 text-white rounded-md focus:outline-none focus:ring-2 disabled:cursor-not-allowed transition"
                style={{
                  backgroundColor:
                    !formik.values.file || submitLoading
                      ? themeColors.gray[400]
                      : themeColors.blue[600],
                }}
                onMouseEnter={e => {
                  if (!e.currentTarget.disabled)
                    e.currentTarget.style.backgroundColor = themeColors.blue[700]
                }}
                onMouseLeave={e => {
                  if (!e.currentTarget.disabled)
                    e.currentTarget.style.backgroundColor = themeColors.blue[600]
                }}
                onFocus={e => {
                  if (!e.currentTarget.disabled)
                    e.currentTarget.style.boxShadow = `0 0 0 2px ${themeColors.blue[400]}`
                }}
                onBlur={e => (e.currentTarget.style.boxShadow = '')}
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
