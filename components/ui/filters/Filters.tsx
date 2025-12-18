import React from 'react'
import { Search } from 'lucide-react'

export interface FilterField {
  name: string
  label: string
  type: 'text' | 'select' | 'number' | 'email' | 'date'
  placeholder?: string
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  options?: Array<{ value: string | number; label: string }>
  className?: string
}

export interface FiltersProps {
  fields: FilterField[]
  onReset: () => void
  onSubmit: () => void
  columns?: number
  showSearchIcon?: boolean
  resetLabel?: string
  submitLabel?: string
  className?: string
}

export default function Filters({
  fields,
  onReset,
  onSubmit,
  columns = 4,
  showSearchIcon = true,
  resetLabel = 'Reset',
  submitLabel = 'Search',
  className = '',
}: FiltersProps) {
  const gridColsClassMap: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-6',
    7: 'grid grid-cols-7 gap-2',
    8: 'grid grid-cols-8 gap-2',
    9: 'grid grid-cols-9 gap-2',
    10: 'grid grid-cols-10 gap-2',
  }
  const gridColsClass = gridColsClassMap[columns] || 'grid-cols-1 md:grid-cols-4'

  const renderField = (field: FilterField) => {
    // When there are 4+ fields, use full width to fit in grid
    const widthClass = fields.length >= 4 ? 'w-full' : 'w-full max-w-xs'
    const baseInputClass = `${widthClass} px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm`
    const baseSelectClass = `${widthClass} px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold bg-white text-sm`

    switch (field.type) {
      case 'select':
        return (
          <select
            className={field.className || baseSelectClass}
            onChange={field.onChange}
            value={field.value}
            name={field.name}
          >
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'number':
        return (
          <input
            type="number"
            className={field.className || baseInputClass}
            placeholder={field.placeholder || ''}
            onChange={field.onChange}
            value={field.value}
            name={field.name}
          />
        )

      case 'email':
        return (
          <input
            type="email"
            className={field.className || baseInputClass}
            placeholder={field.placeholder || ''}
            onChange={field.onChange}
            value={field.value}
            name={field.name}
          />
        )

      case 'date':
        return (
          <input
            type="date"
            className={field.className || baseInputClass}
            placeholder={field.placeholder || ''}
            onChange={field.onChange}
            value={field.value}
            name={field.name}
          />
        )

      case 'text':
      default:
        return (
          <input
            type="text"
            className={field.className || baseInputClass}
            placeholder={field.placeholder || ''}
            onChange={field.onChange}
            value={field.value}
            name={field.name}
          />
        )
    }
  }

  // Determine layout based on number of fields
  // For 7+ fields, use flex with fields in one line, buttons can wrap
  const shouldUseGrid = fields.length >= 4 && fields.length < 7
  const shouldUseFlex = fields.length >= 7
  const containerClass = shouldUseFlex
    ? 'flex flex-wrap items-end gap-3'
    : shouldUseGrid
      ? `grid ${gridColsClass} gap-4 items-end`
      : 'flex flex-wrap items-end gap-4 justify-end'

  return (
    <div className={`px-6 py-4 bg-gray-50 border-b border-gray-200 ${className}`}>
      {shouldUseFlex ? (
        <>
          {/* Fields in one line */}
          <div className="flex flex-nowrap items-end gap-3 w-full">
            {fields.map(field => (
              <div key={field.name} className="flex-shrink-0 flex-1 min-w-0">
                <label className="block text-sm font-semibold text-gray-700 mb-2 whitespace-nowrap">
                  {field.label}
                </label>
                {renderField(field)}
              </div>
            ))}
          </div>
          
          {/* Buttons on next line if needed */}
          <div className="flex items-center gap-2 w-full justify-end mt-4">
            <button
              onClick={onReset}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 whitespace-nowrap"
            >
              {resetLabel}
            </button>
            <button
              type="button"
              onClick={e => {
                e.preventDefault()
                onSubmit()
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2 whitespace-nowrap"
            >
              {showSearchIcon && <Search size={14} />}
              {submitLabel}
            </button>
          </div>
        </>
      ) : shouldUseGrid ? (
        <div className={containerClass}>
          {fields.map(field => (
            <div key={field.name}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {field.label}
              </label>
              {renderField(field)}
            </div>
          ))}
          
          {/* Inline buttons - close to search fields */}
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 whitespace-nowrap"
            >
              {resetLabel}
            </button>
            <button
              type="button"
              onClick={e => {
                e.preventDefault()
                onSubmit()
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2 whitespace-nowrap"
            >
              {showSearchIcon && <Search size={14} />}
              {submitLabel}
            </button>
          </div>
        </div>
      ) : (
        <div className={containerClass}>
          {fields.map(field => (
            <div key={field.name} className="flex-shrink-0">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {field.label}
              </label>
              {renderField(field)}
            </div>
          ))}
          
          {/* Inline buttons - close to search fields */}
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 whitespace-nowrap"
            >
              {resetLabel}
            </button>
            <button
              type="button"
              onClick={e => {
                e.preventDefault()
                onSubmit()
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2 whitespace-nowrap"
            >
              {showSearchIcon && <Search size={14} />}
              {submitLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
