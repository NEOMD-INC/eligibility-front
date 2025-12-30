'use client'

import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { PageTransition } from '@/components/providers/page-transition-provider/PageTransitionProvider'
import { TabTransition } from '@/components/providers/tab-transition-provider/TabTransitionProvider'
import { TitleTransitionButton } from '@/components/providers/title-transition-provider/TittleTransitionProvider'
import ComponentLoader from '@/components/ui/loader/component-loader/ComponentLoader'
import { fetchPatientDashboard } from '@/redux/slices/patient-dashboard/actions'
import { AppDispatch, RootState } from '@/redux/store'
import { themeColors } from '@/theme'

import Coinsurance from './components/tabs/coinsurance/Coinsurance'
import Copay from './components/tabs/copay/Copay'
import CoverageAndBenefits from './components/tabs/coverage-and-benefits/CoverageAndBenefits'
import Deductible from './components/tabs/deductible/Deductible'
import OutOfPocket from './components/tabs/out-of-pocket/OutOfPocket'

export default function Dashboard() {
  const searchParams = useSearchParams()
  const logId = searchParams?.get('logId')
  const dispatch = useDispatch<AppDispatch>()
  const { patientData, loading } = useSelector((state: RootState) => state.patientDashboard)
  const [activeTab, setActiveTab] = useState('Coverage and Benefits')
  const patientInformation: any = patientData?.patient || {}
  const subscriber: any = patientData?.subscriber || {}
  const coverages: any = patientData?.coverage || []
  const provider: any = patientData?.provider || {}
  const dates: any = patientData?.dates || {}
  const benefits: any = patientData?.benefits || {}
  const payer: any = patientData?.payer || {}

  const allBenefits = useMemo(() => {
    const inNetwork = benefits?.in_network || []
    const outOfNetwork = benefits?.out_of_network || []
    const bothNetworks = benefits?.both_networks || []
    return [...inNetwork, ...outOfNetwork, ...bothNetworks]
  }, [benefits])

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

  const coinsuranceData = useMemo(() => {
    const coinsurance: Array<{
      benefit_type: string
      service_type_code: string
      coverage_level: string
      coinsurance_value: number | string | null
      coinsurance_percent?: number
      coinsurance_time_period?: string
      network?: string
      messages?: string[]
    }> = []

    allBenefits.forEach((benefit: any) => {
      if (benefit.coinsurance !== null && benefit.coinsurance !== undefined) {
        let coinsuranceValue: number | string | null = null
        let coinsurancePercent: number | undefined
        let coinsuranceTimePeriod: string | undefined

        if (typeof benefit.coinsurance === 'object') {
          coinsurancePercent = benefit.coinsurance.percent
          coinsuranceTimePeriod = benefit.coinsurance.time_period
          coinsuranceValue = coinsurancePercent !== undefined ? coinsurancePercent : null
        } else {
          coinsuranceValue = benefit.coinsurance
        }

        coinsurance.push({
          benefit_type: benefit.benefit_type || 'N/A',
          service_type_code: benefit.service_type_code || '',
          coverage_level: benefit.coverage_level || benefit.coverage_level_code || '',
          coinsurance_value: coinsuranceValue,
          coinsurance_percent: coinsurancePercent,
          coinsurance_time_period: coinsuranceTimePeriod,
          network: benefit.network || null,
          messages: benefit.messages && Array.isArray(benefit.messages) ? benefit.messages : [],
        })
      }
    })

    return coinsurance
  }, [allBenefits])

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
    if (logId) {
      dispatch(fetchPatientDashboard(logId))
    }
  }, [dispatch, logId])

  if (!logId) {
    return (
      <PageTransition>
        <div className="w-full p-6" style={{ backgroundColor: themeColors.gray[50] }}>
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <h1 className="text-2xl font-semibold mb-4" style={{ color: themeColors.text.primary }}>
              Patient Dashboard
            </h1>
            <p style={{ color: themeColors.gray[600] }}>
              No log ID provided. Please select an eligibility check from the history.
            </p>
          </div>
        </div>
      </PageTransition>
    )
  }

  const tabs = ['Coverage and Benefits', 'Copay', 'Deductible', 'Coinsurance', 'Out of Pocket']

  const hasCoverageAndBenefitsData =
    (benefits?.in_network && benefits.in_network.length > 0) ||
    (benefits?.out_of_network && benefits.out_of_network.length > 0) ||
    (benefits?.both_networks && benefits.both_networks.length > 0)

  const hasCopayData = copaysData.length > 0
  const hasDeductibleData = deductiblesData.length > 0
  const hasCoinsuranceData = coinsuranceData.length > 0
  const hasOutOfPocketData = outOfPocketData.length > 0

  const allTabsEmpty =
    !hasCoverageAndBenefitsData &&
    !hasCopayData &&
    !hasDeductibleData &&
    !hasCoinsuranceData &&
    !hasOutOfPocketData

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
      <div className="w-full p-6 space-y-6" style={{ backgroundColor: themeColors.gray[50] }}>
        <div className="bg-white shadow rounded-lg p-6 flex justify-between items-start relative">
          <div
            className="absolute left-0 top-0 bottom-0 w-3"
            style={{
              backgroundColor:
                coverages.plan_status === 'active'
                  ? themeColors.green[600]
                  : themeColors.yellow[500] || '#eab308',
            }}
          />
          <div className="space-y-2 pl-2">
            <h1
              className="text-2xl font-semibold flex items-center gap-2"
              style={{ color: themeColors.green[700] }}
            >
              {patientInformation.name || 'Jane Doe'}
              {(() => {
                const status = coverages?.plan_status || ''
                if (!status) return null

                const statusLower = status.toLowerCase()
                const isActive = statusLower === 'active'
                const bgColor = isActive ? themeColors.green[100] : themeColors.red[100]
                const textColor = isActive ? themeColors.green[700] : themeColors.red[700]

                return (
                  <span
                    className="ml-3 px-2.5 py-0.5 rounded-full text-sm font-medium"
                    style={{ backgroundColor: bgColor, color: textColor }}
                  >
                    {status}
                  </span>
                )
              })()}
              <span style={{ color: themeColors.green[600] }}>☂️</span>
            </h1>

            <p className="text-sm" style={{ color: themeColors.gray[600] }}>
              {patientInformation.gender} . {patientInformation.age}Yrs . {patientInformation.dob} ·
              <span className="font-medium"> Relationship to Subscriber</span>{' '}
              <b>{patientInformation.relationship_name}</b>
            </p>

            <p className="text-sm" style={{ color: themeColors.gray[600] }}>
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
              <span className="text-3xl font-bold" style={{ color: '#9333ea' }}>
                {payer.name}
              </span>
            </div>

            {/* <p className="text-sm" style={{ color: themeColors.gray[600] }}>
              <span className="font-medium">Insurance</span> {payer.name}
            </p> */}

            <p className="text-sm" style={{ color: themeColors.gray[600] }}>
              <span className="font-medium">Insurance Active From</span>
              <br />
              {dates?.eligibility_begin_date} to {dates?.eligibility_end_date}
            </p>
          </div>

          <div className="text-right space-y-2">
            <div className="flex justify-end">
              <Image
                src="/images/aetna.png"
                alt="NeoMD Logo"
                width={150}
                height={60}
                priority
                unoptimized
                className="object-contain"
              />
            </div>
            <p className="text-sm" style={{ color: themeColors.gray[600] }}>
              verified on {dates?.transaction_date}
            </p>
            <p className="text-sm" style={{ color: themeColors.gray[600] }}>
              Benefit effective from {dates?.eligibility_begin_date} - {dates?.eligibility_end_date}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6 space-y-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">👤 Subscriber</h2>

            <p className="text-sm">
              <span className="font-medium">Name</span> {subscriber.name || 'John Doe'}
            </p>

            <p className="text-sm" style={{ color: themeColors.gray[600] }}>
              DOB {subscriber.dob} · {subscriber.gender ? subscriber.gender : 'Other'}{' '}
              {subscriber.age}Yrs
            </p>

            <p className="text-sm" style={{ color: themeColors.gray[600] }}>
              {formatAddress(
                subscriber.address,
                subscriber.city,
                subscriber.state,
                subscriber.zip
              ) || 'No Address found'}
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-6 space-y-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              🩺 Primary Care Provider
            </h2>

            <p className="text-sm">
              <span className="font-medium">{provider.name}</span>
              <br />
              <span style={{ color: themeColors.text.muted }}>NPI {provider.npi}</span>
            </p>

            <p className="text-sm" style={{ color: themeColors.gray[600] }}>
              {formatAddress(provider.address, provider.city, provider.state, provider.zip)}
            </p>
          </div>
        </div>

        {!allTabsEmpty && (
          <div className="bg-white shadow rounded-lg">
            <div className="flex border-b" style={{ borderColor: themeColors.border.default }}>
              {tabs.map((tab, index) => (
                <TitleTransitionButton
                  key={index}
                  onClick={() => setActiveTab(tab)}
                  className="px-6 py-3 text-sm font-medium relative transition-colors flex-1 cursor-pointer"
                  style={{
                    backgroundColor: activeTab === tab ? themeColors.blue[100] : themeColors.white,
                    color: activeTab === tab ? themeColors.gray[700] : themeColors.gray[600],
                  }}
                  onMouseEnter={(e: any) => {
                    if (activeTab !== tab) {
                      e.currentTarget.style.color = themeColors.text.primary
                    }
                  }}
                  onMouseLeave={(e: any) => {
                    if (activeTab !== tab) {
                      e.currentTarget.style.color = themeColors.gray[600]
                    }
                  }}
                >
                  {tab}
                  {activeTab === tab && (
                    <div
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ backgroundColor: themeColors.blue[600] }}
                    ></div>
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
                    <h2
                      className="text-2xl font-semibold mb-2"
                      style={{ color: themeColors.text.secondary }}
                    >
                      {activeTab}
                    </h2>
                    <p className="text-lg" style={{ color: themeColors.text.muted }}>
                      Coming Soon
                    </p>
                  </div>
                )}
              </TabTransition>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  )
}
