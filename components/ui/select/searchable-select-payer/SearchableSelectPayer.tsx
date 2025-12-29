'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'

import {
  fetchAllAvailityPayers,
  searchAvailityPayers,
} from '@/redux/slices/settings/availity-payers/actions'
import { AppDispatch } from '@/redux/store'
import type { AvailityPayer } from '@/types'

export interface SearchableSelectPayerProps {
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onBlur: (e: React.FocusEvent<HTMLSelectElement>) => void
  placeholder?: string
  className?: string
  error?: boolean
  disabled?: boolean
  searchResults?: AvailityPayer[]
  loading?: boolean
}

export default function SearchableSelectPayer({
  name,
  value,
  onChange,
  onBlur,
  placeholder = 'Select Payer',
  className = '',
  error = false,
  disabled = false,
  searchResults = [],
  loading = false,
}: SearchableSelectPayerProps) {
  const dispatch = useDispatch<AppDispatch>()
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const selectRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Format payer options: "name - (id)"
  const formatPayerOption = (payer: AvailityPayer) => ({
    value: payer.payer_id || payer.id?.toString() || '',
    label: `${payer.payer_name || payer.payerName || ''} - (${payer.payer_id || payer.id || ''})`,
  })

  // Get options from search results
  const options = searchResults.map(formatPayerOption)

  // Get selected option label
  const selectedOption = options.find(opt => opt.value === value)
  const displayValue = selectedOption ? selectedOption.label : placeholder

  // Check if there are more than 6 items (for showing scroll indicator)
  // const hasMore = options.length > 6

  // Debounced API search
  const performSearch = useCallback(
    (term: string) => {
      if (term.length > 3) {
        dispatch(searchAvailityPayers(term))
      } else if (term.length === 0) {
        // If search is cleared, fetch original list
        dispatch(fetchAllAvailityPayers())
      }
    },
    [dispatch]
  )

  // Handle search input change with debouncing
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // If search term is more than 3 characters, debounce the API call
    if (term.length > 3) {
      debounceTimerRef.current = setTimeout(() => {
        performSearch(term)
      }, 300) // 300ms debounce - calls API after user stops typing for 300ms
    } else if (term.length === 0) {
      // If search is cleared, immediately fetch original list
      dispatch(fetchAllAvailityPayers())
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      // Focus search input when dropdown opens
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
      if (!isOpen) {
        setSearchTerm('')
      }
    }
  }

  const handleSelect = (optionValue: string) => {
    const syntheticEvent = {
      target: { name, value: optionValue },
    } as React.ChangeEvent<HTMLSelectElement>
    onChange(syntheticEvent)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div ref={selectRef} className="relative w-full">
      {/* Hidden select for form integration */}
      <select
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className="hidden"
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Custom dropdown */}
      <div
        onClick={handleToggle}
        className={`w-full px-4 py-2 rounded-md border bg-white text-gray-900 focus:outline-none focus:ring-2 cursor-pointer ${
          error ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-50' : ''} ${className}`}
      >
        <div className="flex items-center justify-between">
          <span className={`text-sm ${value ? 'text-gray-900' : 'text-gray-500'}`}>
            {displayValue}
          </span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>

      {/* Dropdown menu */}
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {/* Search input */}
          <div className="p-2 border-b border-gray-200">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Type at least 4 characters to search..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={e => e.stopPropagation()}
            />
            {searchTerm.length > 0 && searchTerm.length <= 3 && (
              <p className="text-xs text-gray-500 mt-1">
                Type {4 - searchTerm.length} more character{4 - searchTerm.length > 1 ? 's' : ''} to
                search
              </p>
            )}
          </div>

          {/* Options list - shows only 6 items, scrollable for the rest */}
          <div
            className="overflow-y-auto"
            style={{
              maxHeight: '192px', // Approximately 6 items (32px per item: py-2 = 8px top + 8px bottom + 16px text)
              scrollbarWidth: 'thin',
              scrollbarColor: '#cbd5e0 #f1f5f9',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {loading ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">Searching...</div>
            ) : options.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                {searchTerm.length > 3
                  ? 'No payers found'
                  : 'Type at least 4 characters to search...'}
              </div>
            ) : (
              <>
                {options.map(option => (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-blue-50 ${
                      value === option.value ? 'bg-blue-100 font-semibold' : ''
                    }`}
                  >
                    {option.label}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
