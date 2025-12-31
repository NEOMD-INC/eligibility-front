'use client'

import { useEffect, useRef, useState } from 'react'

import { themeColors } from '@/theme'
import { SearchableSelectProps } from '@/types/ui/select'

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
        className={`w-full px-4 py-2 rounded-md border bg-white focus:outline-none focus:ring-2 cursor-pointer ${
          disabled ? 'cursor-not-allowed opacity-50' : ''
        } ${className}`}
        style={{
          color: themeColors.text.primary,
          borderColor: error ? themeColors.border.error : themeColors.border.default,
          backgroundColor: disabled ? themeColors.gray[100] : themeColors.white,
        }}
        onFocus={e => {
          if (!disabled) {
            e.currentTarget.style.boxShadow = `0 0 0 2px ${error ? themeColors.border.focusRing.red : themeColors.border.focusRing.blue}`
          }
        }}
        onBlur={e => {
          e.currentTarget.style.boxShadow = ''
        }}
      >
        <div className="flex items-center justify-between">
          <span
            className="text-sm"
            style={{ color: value ? themeColors.text.primary : themeColors.text.muted }}
          >
            {displayValue}
          </span>
          <svg
            className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
            style={{ color: themeColors.gray[400] }}
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
        <div
          className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-80 overflow-hidden"
          style={{ borderColor: themeColors.border.default }}
        >
          {/* Search input */}
          <div className="p-2 border-b" style={{ borderColor: themeColors.border.default }}>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2"
              style={{
                borderColor: themeColors.border.default,
              }}
              onFocus={e => {
                e.currentTarget.style.boxShadow = `0 0 0 2px ${themeColors.border.focusRing.blue}`
              }}
              onBlur={e => {
                e.currentTarget.style.boxShadow = ''
              }}
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
              <div
                className="px-4 py-3 text-sm text-center"
                style={{ color: themeColors.text.muted }}
              >
                No options found
              </div>
            ) : (
              filteredOptions.map(option => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className="px-4 py-2 text-sm cursor-pointer font-semibold"
                  style={{
                    backgroundColor: value === option.value ? themeColors.blue[100] : 'transparent',
                  }}
                  onMouseEnter={e => {
                    if (value !== option.value) {
                      e.currentTarget.style.backgroundColor = themeColors.blue[100] || '#eff6ff'
                    }
                  }}
                  onMouseLeave={e => {
                    if (value !== option.value) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }
                  }}
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
