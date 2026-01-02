'use client'

import React, { useEffect, useMemo, useState } from 'react'

import { themeColors } from '@/theme'
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
        const obj = value as any
        if (obj.member_id) return String(obj.member_id)
        if (obj.name) {
          if (obj.npi) return `${obj.name} (${obj.npi})`
          return String(obj.name)
        }
        if (obj.npi) return String(obj.npi)
        if (obj.id) return String(obj.id)
        if (obj.id_qualifier) return String(obj.id_qualifier)
        if (obj.provider_name) return String(obj.provider_name)
        if (obj.responseMessage) return String(obj.responseMessage)
        if (obj.response_message) return String(obj.response_message)
        return '[Object]'
      }

      return String(value)
    }

    return (
      <tr
        className="transition-colors"
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = themeColors.gray[50])}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
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
          <div
            className="animate-spin rounded-full h-8 w-8 border-b-2"
            style={{ borderColor: themeColors.blue[600] }}
          ></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white shadow rounded-lg overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table
          className="w-full border-collapse text-sm"
          style={{ color: themeColors.gray[700], tableLayout: 'fixed' }}
        >
          <thead>
            <tr
              className="border-b"
              style={{
                backgroundColor: themeColors.gray[50],
                borderColor: themeColors.border.default,
              }}
            >
              {columns.map(column => {
                const isCenter = column.align === 'center'
                const isRight = column.align === 'right'
                return (
                  <th
                    key={column.key}
                    className={`px-4 py-3 font-semibold ${getAlignmentClass(column.align)}`}
                    style={
                      column.width
                        ? { width: column.width, color: themeColors.text.secondary }
                        : { color: themeColors.text.secondary }
                    }
                  >
                    <div
                      className={`flex items-center ${
                        isCenter ? 'justify-center' : isRight ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {column.label}
                      {column.sortable && (
                        <button
                          className="ml-1"
                          style={{ color: themeColors.gray[400] }}
                          onMouseEnter={e => (e.currentTarget.style.color = themeColors.gray[600])}
                          onMouseLeave={e => (e.currentTarget.style.color = themeColors.gray[400])}
                        >
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
                <td
                  colSpan={columns.length}
                  className="text-center py-8"
                  style={{ color: themeColors.text.muted }}
                >
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
        <div className="border-t px-6 py-4" style={{ borderColor: themeColors.border.default }}>
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
      <div className="text-sm" style={{ color: themeColors.gray[700] }}>
        Showing {startItem} to {endItem} of {totalItems} entries
      </div>

      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm bg-white border rounded disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            borderColor: themeColors.border.default,
          }}
          onMouseEnter={e => {
            if (!e.currentTarget.disabled)
              e.currentTarget.style.backgroundColor = themeColors.gray[50]
          }}
          onMouseLeave={e => {
            if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = themeColors.white
          }}
        >
          Previous
        </button>

        {getPageNumbers().map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className="px-3 py-1 text-sm border rounded"
            style={{
              backgroundColor: currentPage === page ? themeColors.blue[600] : themeColors.white,
              color: currentPage === page ? themeColors.white : themeColors.text.primary,
              borderColor:
                currentPage === page ? themeColors.blue[600] : themeColors.border.default,
            }}
            onMouseEnter={e => {
              if (currentPage !== page) {
                e.currentTarget.style.backgroundColor = themeColors.gray[50]
              }
            }}
            onMouseLeave={e => {
              if (currentPage !== page) {
                e.currentTarget.style.backgroundColor = themeColors.white
              }
            }}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm bg-white border rounded disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            borderColor: themeColors.border.default,
          }}
          onMouseEnter={e => {
            if (!e.currentTarget.disabled)
              e.currentTarget.style.backgroundColor = themeColors.gray[50]
          }}
          onMouseLeave={e => {
            if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = themeColors.white
          }}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default DataTable
