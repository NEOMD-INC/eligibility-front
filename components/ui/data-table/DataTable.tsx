'use client'

import React, { useEffect, useMemo, useState } from 'react'

import { DataTableProps, TablePaginationProps } from '@/types/ui/table'

type TableRow = Record<string, unknown>

const DataTable = <T extends TableRow = TableRow>({
  columns,
  data,
  loading = false,
  totalItems,
  itemsPerPage = 10,
  currentPage = 1,
  onPageChange,
  clientSidePagination = false,
  noDataMessage,
  renderRow,
  className = '',
}: DataTableProps<T>) => {
  const [internalPage, setInternalPage] = useState(1)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      console.log('DataTable received:', {
        columnsCount: columns.length,
        dataCount: data.length,
        data: data,
        loading,
        totalItems,
      })
    }
  }, [columns.length, data.length, loading, totalItems, isClient])

  const activePage = isClient ? currentPage || internalPage : 1
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const paginatedData = useMemo(() => {
    if (!clientSidePagination) return data

    const startIndex = (activePage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return data.slice(startIndex, endIndex)
  }, [data, activePage, itemsPerPage, clientSidePagination])

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page)
    } else {
      setInternalPage(page)
    }
  }

  const DefaultTableRow = ({ row }: { row: T; index: number }) => {
    const renderCellValue = (value: unknown): React.ReactNode => {
      if (value === null || value === undefined) return 'N/A'

      // Handle arrays
      if (Array.isArray(value)) {
        if (value.length === 0) return 'N/A'
        // If array contains objects, try to extract meaningful values
        return value
          .map(item => {
            if (typeof item === 'object' && item !== null) {
              return item.name || item.id || item.member_id || JSON.stringify(item)
            }
            return String(item)
          })
          .join(', ')
      }

      if (typeof value === 'object') {
        if (value.member_id) return String(value.member_id)
        if (value.name) {
          if (value.npi) return `${value.name} (${value.npi})`
          return String(value.name)
        }
        if (value.npi) return String(value.npi)
        if (value.id) return String(value.id)
        if (value.id_qualifier) return String(value.id_qualifier)
        if (value.provider_name) return String(value.provider_name)
        if (value.responseMessage) return String(value.responseMessage)
        if (value.response_message) return String(value.response_message)
        return '[Object]'
      }

      return String(value)
    }

    return (
      <tr className="hover:bg-gray-50 transition-colors">
        {columns.map(column => {
          const cellValue = row[column.key]
          let renderedContent: React.ReactNode

          if (column.render) {
            try {
              renderedContent = column.render(cellValue, row)
            } catch (error) {
              console.log(error)
              renderedContent = renderCellValue(cellValue)
            }
          } else {
            renderedContent = renderCellValue(cellValue)
          }

          return (
            <td
              key={column.key}
              className={`px-4 py-3 text-sm ${getAlignmentClass(column.align)}`}
              style={column.width ? { width: column.width } : {}}
            >
              {renderedContent}
            </td>
          )
        })}
      </tr>
    )
  }

  const getAlignmentClass = (align: 'left' | 'center' | 'right' = 'left') => {
    switch (align) {
      case 'center':
        return 'text-center'
      case 'right':
        return 'text-right'
      default:
        return 'text-left'
    }
  }

  const displayData = clientSidePagination ? paginatedData : data

  useEffect(() => {
    if (isClient) {
      console.log('Display data:', displayData)
    }
  }, [displayData, isClient])

  if (loading) {
    return (
      <div className={`bg-white shadow rounded-lg overflow-hidden ${className}`}>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white shadow rounded-lg overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table
          className="w-full border-collapse text-sm text-gray-700"
          style={{ tableLayout: 'fixed' }}
        >
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map(column => {
                const isCenter = column.align === 'center'
                const isRight = column.align === 'right'
                return (
                  <th
                    key={column.key}
                    className={`px-4 py-3 font-semibold text-gray-800 ${getAlignmentClass(column.align)}`}
                    style={column.width ? { width: column.width } : {}}
                  >
                    <div
                      className={`flex items-center ${
                        isCenter ? 'justify-center' : isRight ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {column.label}
                      {column.sortable && (
                        <button className="ml-1 text-gray-400 hover:text-gray-600">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {displayData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-gray-500">
                  {noDataMessage || 'No data found'}
                </td>
              </tr>
            ) : (
              displayData?.map((row, index) =>
                renderRow ? (
                  renderRow(row, index)
                ) : (
                  <DefaultTableRow key={index} row={row} index={index} />
                )
              )
            )}
          </tbody>
        </table>
      </div>

      {totalPages !== 0 && (
        <div className="border-t border-gray-200 px-6 py-4">
          <TablePagination
            currentPage={activePage}
            totalPages={totalPages}
            totalItems={totalItems}
            onPageChange={handlePageChange}
            pageSize={itemsPerPage}
          />
        </div>
      )}
    </div>
  )
}

const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  pageSize,
}) => {
  const getPageNumbers = () => {
    const pages = []
    const showPages = 5

    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2))
    const endPage = Math.min(totalPages, startPage + showPages - 1)

    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(1, endPage - showPages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
      <div className="text-sm text-gray-700">
        Showing {startItem} to {endItem} of {totalItems} entries
      </div>

      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {getPageNumbers().map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 text-sm border rounded ${
              currentPage === page
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default DataTable
