'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

export default function CarrierAddressDetail() {
  const router = useRouter()

  // TODO: Fetch carrier address data from API using ID from route params
  const CARRIER_ADDRESS_DETAILS = [
    {
      title: 'Carrier Code',
      value: 'CAR001',
    },
    {
      title: 'Actual Name',
      value: 'ABC Insurance Company',
    },
    {
      title: 'Address ID',
      value: 'ADD001',
    },
    {
      title: 'Address Line 1',
      value: '123 Main Street',
    },
    {
      title: 'City',
      value: 'New York',
    },
    {
      title: 'State',
      value: 'NY',
    },
    {
      title: 'Zip Code',
      value: '10001',
    },
    {
      title: 'Phone Type',
      value: 'Office',
    },
    {
      title: 'Phone Number',
      value: '555-1234',
    },
    {
      title: 'Insurance Department',
      value: 'Health Insurance',
    },
  ]

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this carrier address?')) {
      // TODO: Implement delete logic
      console.log('Delete carrier address')
      router.push('/settings/carrier-address')
    }
  }

  const handleEdit = () => {
    // TODO: Get ID from route params
    router.push('/settings/carrier-address/edit/1')
  }

  return (
    <div className="flex flex-col justify-center bg-gray-100 p-6 space-y-6">
      {/* Main Detail Card */}
      <div className="w-full bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-4 pb-3">Carrier Address Details</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6 mb-3">
          {CARRIER_ADDRESS_DETAILS.map((detail, index) => (
            <div key={index}>
              <p className="text-gray-500 font-semibold mb-1">{detail.title}</p>
              <p className="text-gray-800">{detail.value}</p>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-3 pt-6">
          <button
            onClick={() => router.back()}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow transition"
          >
            Go Back
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            Delete
          </button>
          <button
            onClick={handleEdit}
            className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg shadow transition"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  )
}
