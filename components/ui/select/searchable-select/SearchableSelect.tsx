'use client'

import { useEffect, useRef, useState } from 'react'

export interface SearchableSelectOption {
  value: string
  label: string
}

interface SearchableSelectProps {
  name: string
  value: string
  options: SearchableSelectOption[]
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onBlur: (e: React.FocusEvent<HTMLSelectElement>) => void
  placeholder?: string
  className?: string
  error?: boolean
  disabled?: boolean
  maxVisibleItems?: number
}

export default function SearchableSelect({
  name,
  value,
  options,
  onChange,
  onBlur,
  placeholder = 'Select an option',
  className = '',
  error = false,
  disabled = false,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredOptions, setFilteredOptions] = useState(options)
  const selectRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Get selected option label
  const selectedOption = options.find(opt => opt.value === value)
  const displayValue = selectedOption ? selectedOption.label : placeholder

  // Filter options based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      // Show all options when not searching (they'll be scrollable)
      setFilteredOptions(options)
    } else {
      // When searching, show all matching results (they'll be scrollable)
      const filtered = options.filter(
        option =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          option.value.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredOptions(filtered)
    }
  }, [searchTerm, options])

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
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
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-gray-200">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={e => e.stopPropagation()}
            />
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
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">No options found</div>
            ) : (
              filteredOptions.map(option => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-blue-50 ${
                    value === option.value ? 'bg-blue-100 font-semibold' : ''
                  }`}
                >
                  {option.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
