'use client'

import React, { useEffect, useState, useMemo } from 'react'
import CoverageAndBenefits from './components/tabs/coverage-and-benefits/CoverageAndBenefits'
import Copay from './components/tabs/copay/Copay'
import Deductible from './components/tabs/deductible/Deductible'
import Coinsurance from './components/tabs/coinsurance/Coinsurance'
import OutOfPocket from './components/tabs/out-of-pocket/OutOfPocket'
import { AppDispatch, RootState } from '@/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPatientDashboard } from '@/redux/slices/patient-dashboard/actions'
import { PageTransition } from '@/components/providers/page-transition-provider/PageTransitionProvider'
import { TabTransition } from '@/components/providers/tab-transition-provider/TabTransitionProvider'
import ComponentLoader from '@/components/ui/loader/component-loader/ComponentLoader'
import { TitleTransitionButton } from '@/components/providers/title-transition-provider/TittleTransitionProvider'

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const { patientData, loading, error } = useSelector((state: RootState) => state.patientDashboard)
  const [activeTab, setActiveTab] = useState('Coverage and Benefits')
  const patientInformation = patientData?.patient || {}
  const subscriber = patientData?.subscriber || {}
  const managedCareOrganization = patientData?.mco || {}
  const coverages = patientData?.coverage || []
  const provider = patientData?.provider || {}
  const dates = patientData?.dates || {}
  const benefits = patientData?.benefits || {}
  const primaryCareProvider = patientData?.primary_care_provider || {}
  const payer = patientData?.payer || {}

  // Extract all benefits from all network types
  const allBenefits = useMemo(() => {
    const inNetwork = benefits?.in_network || []
    const outOfNetwork = benefits?.out_of_network || []
    const bothNetworks = benefits?.both_networks || []
    return [...inNetwork, ...outOfNetwork, ...bothNetworks]
  }, [benefits])

  // Extract copays with benefit information
  const copaysData = useMemo(() => {
    const copays: Array<{
      benefit_type: string
      service_type_code: string
      coverage_level: string
      copay_type: string
      copay_value: number | string
      network?: string
      messages?: string[]
    }> = []

    allBenefits.forEach((benefit: any) => {
      if (benefit.copays && typeof benefit.copays === 'object') {
        Object.entries(benefit.copays).forEach(([copayType, copayValue]) => {
          if (copayValue !== null && copayValue !== undefined) {
            copays.push({
              benefit_type: benefit.benefit_type || 'N/A',
              service_type_code: benefit.service_type_code || '',
              coverage_level: benefit.coverage_level || benefit.coverage_level_code || '',
              copay_type: copayType,
              copay_value: copayValue as number | string,
              network: benefit.network || null,
              messages: benefit.messages && Array.isArray(benefit.messages) ? benefit.messages : [],
            })
          }
        })
      }
    })

    return copays
  }, [allBenefits])

  // Extract deductibles with benefit information
  const deductiblesData = useMemo(() => {
    const deductibles: Array<{
      benefit_type: string
      service_type_code: string
      coverage_level: string
      deductible: any
      network?: string
      messages?: string[]
    }> = []

    allBenefits.forEach((benefit: any) => {
      if (benefit.deductible && typeof benefit.deductible === 'object') {
        deductibles.push({
          benefit_type: benefit.benefit_type || 'N/A',
          service_type_code: benefit.service_type_code || '',
          coverage_level: benefit.coverage_level || benefit.coverage_level_code || '',
          deductible: benefit.deductible,
          network: benefit.network || null,
          messages: benefit.messages && Array.isArray(benefit.messages) ? benefit.messages : [],
        })
      }
    })

    return deductibles
  }, [allBenefits])

  // Extract coinsurance with benefit information
  const coinsuranceData = useMemo(() => {
    const coinsurance: Array<{
      benefit_type: string
      service_type_code: string
      coverage_level: string
      coinsurance_value: any
      network?: string
      messages?: string[]
    }> = []

    allBenefits.forEach((benefit: any) => {
      if (benefit.coinsurance !== null && benefit.coinsurance !== undefined) {
        coinsurance.push({
          benefit_type: benefit.benefit_type || 'N/A',
          service_type_code: benefit.service_type_code || '',
          coverage_level: benefit.coverage_level || benefit.coverage_level_code || '',
          coinsurance_value: benefit.coinsurance,
          network: benefit.network || null,
          messages: benefit.messages && Array.isArray(benefit.messages) ? benefit.messages : [],
        })
      }
    })

    return coinsurance
  }, [allBenefits])

  // Extract out of pocket with benefit information
  const outOfPocketData = useMemo(() => {
    const outOfPocket: Array<{
      benefit_type: string
      service_type_code: string
      coverage_level: string
      out_of_pocket: any
      network?: string
      messages?: string[]
    }> = []

    allBenefits.forEach((benefit: any) => {
      if (benefit.out_of_pocket && typeof benefit.out_of_pocket === 'object') {
        outOfPocket.push({
          benefit_type: benefit.benefit_type || 'N/A',
          service_type_code: benefit.service_type_code || '',
          coverage_level: benefit.coverage_level || benefit.coverage_level_code || '',
          out_of_pocket: benefit.out_of_pocket,
          network: benefit.network || null,
          messages: benefit.messages && Array.isArray(benefit.messages) ? benefit.messages : [],
        })
      }
    })

    return outOfPocket
  }, [allBenefits])

  useEffect(() => {
    dispatch(fetchPatientDashboard(''))
  }, [dispatch])

  const tabs = ['Coverage and Benefits', 'Copay', 'Deductible', 'Coinsurance', 'Out of Pocket']

  const formatAddress = (address: any, city?: string, state?: string, zip?: string) => {
    if (!address) {
      return city && state && zip ? `${city}, ${state} ${zip}` : ''
    }

    if (typeof address === 'string') {
      return city && state && zip ? `${address}, ${city}, ${state} ${zip}` : address
    }

    const line1 = address.line1 || ''
    const line2 = address.line2 || ''
    const addrCity = address.city || city || ''
    const addrState = address.state || state || ''
    const addrZip = address.zip || zip || ''

    const addressParts = [line1, line2].filter(Boolean).join(' ')
    const locationParts = [addrCity, addrState, addrZip].filter(Boolean).join(' ')

    return [addressParts, locationParts].filter(Boolean).join(', ')
  }

  if (loading) {
    return <ComponentLoader component="Patient Dashboard" />
  }

  return (
    <PageTransition>
      <div className="w-full bg-gray-50 p-6 space-y-6">
        <div className="bg-white shadow rounded-lg p-6 flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-green-700 flex items-center gap-2">
              {patientInformation.name || 'Jane Doe'}
              <span className="text-green-600">☂️</span>
            </h1>

            <p className="text-sm text-gray-600">
              {patientInformation.gender} . {patientInformation.age}Yrs . {patientInformation.dob} ·
              <span className="font-medium"> Relationship to Subscriber</span>{' '}
              <b>{patientInformation.relationship_name}</b>
            </p>

            <p className="text-sm text-gray-600">
              <span className="font-medium">Policy No.</span> <b>{coverages.plan_number}</b>
              <span className="mx-2">|</span>
              <span className="font-medium">Group No.</span> <b>{coverages.group_number}</b>
              <br />
              <span className="mr-2">|</span>
              <span className="font-medium">Group Name</span> <b>{coverages.group_name}</b> -
              Florida
            </p>
          </div>

          <div className="text-left space-y-2">
            <div className="flex justify-start">
              <span className="text-purple-600 text-3xl font-bold">{payer.name}</span>
            </div>

            <p className="text-sm text-gray-600">
              <span className="font-medium">Insurance</span> {payer.name}
            </p>

            <p className="text-sm text-gray-600">
              <span className="font-medium">Insurance Active From</span>
              <br />
              {dates?.eligibility_begin_date} to {dates?.eligibility_end_date}
            </p>
          </div>

          <div className="text-right space-y-2">
            <p className="text-sm text-gray-600">verified on {dates?.transaction_date}</p>

            <p className="text-sm text-gray-600">
              Benefit effective from {dates?.eligibility_begin_date} - {dates?.eligibility_end_date}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-6 space-y-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">👤 Subscriber</h2>

            <p className="text-sm">
              <span className="font-medium">Name</span> {subscriber.name || 'John Doe'}
            </p>

            <p className="text-sm text-gray-600">
              DOB {subscriber.dob} · {subscriber.gender ? subscriber.gender : 'Other'}{' '}
              {subscriber.age}Yrs
            </p>

            <p className="text-sm text-gray-600">
              {formatAddress(
                subscriber.address,
                subscriber.city,
                subscriber.state,
                subscriber.zip
              ) || '486 Grove Street Apartment #20, New York, NY 10014-1203'}
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-6 space-y-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              🩺 Primary Care Provider
            </h2>

            <p className="text-sm">
              <span className="font-medium">{provider.name}</span>
              <br />
              <span className="text-gray-500">NPI {provider.npi}</span>
            </p>

            <p className="text-sm text-gray-600">
              {formatAddress(provider.address, provider.city, provider.state, provider.zip) ||
                '486 Grove Street Apartment #20, New York, NY 10014-4444'}
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-6 space-y-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              🩺 Managed Care Organization
            </h2>

            <p className="text-sm">
              <span className="font-medium">Name</span>
              <span className="ml-2 text-gray-500">{managedCareOrganization.name}</span>
            </p>

            <p className="text-sm text-gray-600">
              {formatAddress(
                managedCareOrganization.address,
                managedCareOrganization.city,
                managedCareOrganization.state,
                managedCareOrganization.zip
              ) || 'Address not available'}
            </p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab, index) => (
              <TitleTransitionButton
                key={index}
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
              </TitleTransitionButton>
            ))}
          </div>
          <div>
            <TabTransition>
              {activeTab === 'Coverage and Benefits' ? (
                <CoverageAndBenefits benefits={benefits} />
              ) : activeTab === 'Copay' ? (
                <Copay copaysData={copaysData} />
              ) : activeTab === 'Deductible' ? (
                <Deductible deductiblesData={deductiblesData} />
              ) : activeTab === 'Coinsurance' ? (
                <Coinsurance coinsuranceData={coinsuranceData} />
              ) : activeTab === 'Out of Pocket' ? (
                <OutOfPocket outOfPocketData={outOfPocketData} />
              ) : (
                <div className="p-12 text-center">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2">{activeTab}</h2>
                  <p className="text-gray-500 text-lg">Coming Soon</p>
                </div>
              )}
            </TabTransition>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
