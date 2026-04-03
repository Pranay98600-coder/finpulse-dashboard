import React from 'react'
import { Routes, Route, useLocation, Link } from 'react-router-dom'
import { FinanceProvider, useFinance } from './context/FinanceContext'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import DashboardPage from './pages/DashboardPage'
import TransactionsPage from './pages/TransactionsPage'
import InsightsPage from './pages/InsightsPage'
import './index.css'

function DashboardLayout() {
  const location = useLocation()
  const { isLoading } = useFinance()

  // Get current route path for mobile nav highlighting
  const getRouteId = () => {
    switch (location.pathname) {
      case '/transactions':
        return 'transactions'
      case '/insights':
        return 'insights'
      default:
        return 'dashboard'
    }
  }

  const currentRoute = getRouteId()

  // Loading screen
  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="mb-4 animate-spin">
            <span className="text-6xl">💰</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">Loading your financial data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        {/* Mobile Navigation */}
        <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex gap-2 overflow-x-auto transition-colors duration-300">
          {[
            { id: 'dashboard', path: '/', label: 'Dashboard', icon: '📊' },
            { id: 'transactions', path: '/transactions', label: 'Transactions', icon: '📝' },
            { id: 'insights', path: '/insights', label: 'Insights', icon: '💡' },
          ].map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap hover:opacity-90 ${
                currentRoute === item.id
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <span className="mr-1">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="*" element={<DashboardPage />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <FinanceProvider>
      <DashboardLayout />
    </FinanceProvider>
  )
}
