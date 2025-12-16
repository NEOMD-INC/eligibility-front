'use client'

import React, { useState } from 'react'
import CoverageAndBenefits from './components/tabs/coverage-and-benefits/CoverageAndBenefits'
import Copay from './components/tabs/copay/Copay'
import Deductible from './components/tabs/deductible/Deductible'
import Coinsurance from './components/tabs/coinsurance/Coinsurance'
import OutOfPocket from './components/tabs/out-of-pocket/OutOfPocket'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Coverage and Benefits')

  const tabs = ['Coverage and Benefits', 'Copay', 'Deductible', 'Coinsurance', 'Out of Pocket']

  return (
    <div className="w-full bg-gray-50 p-6 space-y-6">
      <div className="bg-white border rounded-lg p-6 flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-green-700 flex items-center gap-2">
            Jess Andrew
            <span className="text-green-600">☂️</span>
          </h1>

          <p className="text-sm text-gray-600">
            Female · 33Yrs · DOB 24 Aug, 1978 ·
            <span className="font-medium">Relationship to Subscriber</span> Spouse
          </p>

          <p className="text-sm text-gray-600">
            <span className="font-medium">Policy No.</span> 101482350800
            <span className="mx-2">|</span>
            <span className="font-medium">Group No.</span> 084287705000407
            <span className="mx-2">|</span>
            <span className="font-medium">Group Name</span> MA Individual - Florida
          </p>
        </div>

        <div className="text-left space-y-2">
          <div className="flex justify-start">
            <span className="text-purple-600 text-3xl font-bold">aetna</span>
          </div>

          <p className="text-sm text-gray-600">
            <span className="font-medium">Insurance</span> Aetna
          </p>

          <p className="text-sm text-gray-600">
            <span className="font-medium">Insurance Active From</span>
            <br />
            01/01/2023 to 12/31/2024
          </p>
        </div>

        <div className="text-right space-y-2">
          <p className="text-sm text-gray-600">verified on 12 May, 2025</p>

          <p className="text-sm text-gray-600">
            Benefit effective from 01 Jan, 2023 - 31 Dec, 2024
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border rounded-lg p-6 space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">👤 Subscriber</h2>

          <p className="text-sm">
            <span className="font-medium">Name</span> Medicare Richard Evas
          </p>

          <p className="text-sm text-gray-600">DOB 24 Aug, 1978 · Female 33Yrs</p>

          <p className="text-sm text-gray-600">
            486 Grove Street Apartment #20, New York, NY 10014-1203
          </p>
        </div>

        <div className="bg-white border rounded-lg p-6 space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            🩺 Primary Care Provider
          </h2>

          <p className="text-sm">
            <span className="font-medium">John Doe MD</span>
            <span className="ml-2 text-gray-500">NPI 1234567891</span>
          </p>

          <p className="text-sm text-gray-600">
            486 Grove Street Apartment #20, New York, NY 10014-4444
          </p>
        </div>

        <div className="bg-white border rounded-lg p-6 space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            🩺 Managed Care Organization (Hospital)
          </h2>

          <p className="text-sm text-gray-600">
            486 Grove Street Apartment #20, New York, NY 10014-4444
          </p>
        </div>
      </div>

      <div className="bg-white border rounded-lg">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium relative transition-colors flex-1 cursor-pointer ${
                activeTab === tab
                  ? 'bg-blue-50 text-gray-700'
                  : 'bg-white text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
          ))}
        </div>
        <div>
          {activeTab === 'Coverage and Benefits' ? (
            <CoverageAndBenefits />
          ) : activeTab === 'Copay' ? (
            <Copay />
          ) : activeTab === 'Deductible' ? (
            <Deductible />
          ) : activeTab === 'Coinsurance' ? (
            <Coinsurance />
          ) : activeTab === 'Out of Pocket' ? (
            <OutOfPocket />
          ) : (
            <div className="p-12 text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">{activeTab}</h2>
              <p className="text-gray-500 text-lg">Coming Soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
