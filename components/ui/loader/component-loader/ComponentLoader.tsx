import React from 'react'

export interface ComponentLoaderProps {
  component?: string
  message?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'fullscreen' | 'inline' | 'card'
  className?: string
}

export default function ComponentLoader({
  component,
  message,
  size = 'md',
  variant = 'default',
  className = '',
}: ComponentLoaderProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-b-2',
    md: 'h-8 w-8 border-b-2',
    lg: 'h-12 w-12 border-b-2',
  }

  const displayMessage = message || (component ? `Loading ${component}...` : 'Loading...')

  if (variant === 'fullscreen') {
    return (
      <div
        className={`flex flex-col justify-center items-center min-h-screen bg-gray-100 ${className}`}
      >
        <div className={`animate-spin rounded-full border-blue-600 ${sizeClasses[size]}`}></div>
        <p className="mt-4 text-gray-600">{displayMessage}</p>
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className={`flex flex-col justify-center bg-gray-100 p-6 space-y-6 ${className}`}>
        <div className="w-full bg-white shadow-lg rounded-xl p-8">
          <div className="flex flex-col justify-center items-center py-12">
            <div className={`animate-spin rounded-full border-blue-600 ${sizeClasses[size]}`}></div>
            <p className="mt-4 text-gray-600">{displayMessage}</p>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <div className={`flex items-center justify-center gap-2 py-2 ${className}`}>
        <div className={`animate-spin rounded-full border-blue-600 ${sizeClasses[size]}`}></div>
        <p className="text-gray-600 text-sm">{displayMessage}</p>
      </div>
    )
  }

  return (
    <div className={`flex items-center justify-center p-6 ${className}`}>
      <div className="text-center">
        <div
          className={`animate-spin rounded-full border-blue-600 mx-auto ${sizeClasses[size]}`}
        ></div>
        <p className="mt-4 text-gray-600">{displayMessage}</p>
      </div>
    </div>
  )
}
