import React from 'react'
import SummaryCards from '../components/SummaryCards'
import ChartsSection from '../components/ChartsSection'

export default function DashboardPage() {
  return (
    <div className="space-y-0">
      <SummaryCards />
      <ChartsSection />
    </div>
  )
}
