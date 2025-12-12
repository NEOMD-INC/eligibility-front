'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

export default function CarrierSetupDetail() {
  const router = useRouter()

  // TODO: Fetch carrier setup data from API using ID from route params
  const CARRIER_SETUP_DETAILS = [
    {
      title: 'Carrier Group Code',
      value: 'GRP001',
    },
    {
      title: 'Group Description',
      value: 'Health Insurance Group A',
    },
    {
      title: 'Carrier Code',
      value: 'CAR001',
    },
    {
      title: 'Carrier Description',
      value: 'ABC Insurance Company',
    },
    {
      title: 'State',
      value: 'NY',
    },
    {
      title: 'Batch Player ID',
      value: 'BP001',
    },
    {
      title: 'Is CLIA',
      value: 'Yes',
    },
    {
      title: 'COB',
      value: 'Primary',
    },
    {
      title: 'Corrected Claim',
      value: 'Yes',
    },
    {
      title: 'Enrollment Required',
      value: 'Required',
    },
  ]

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this carrier setup?')) {
      // TODO: Implement delete logic
      console.log('Delete carrier setup')
      router.push('/settings/carrier-setup')
    }
  }

  const handleEdit = () => {
    // TODO: Get ID from route params
    router.push('/settings/carrier-setup/edit/1')
  }

  return (
    <div className="flex flex-col justify-center bg-gray-100 p-6 space-y-6">
      {/* Main Detail Card */}
      <div className="w-full bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-4 pb-3">Carrier Setup Details</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6 mb-3">
          {CARRIER_SETUP_DETAILS.map((detail, index) => (
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

