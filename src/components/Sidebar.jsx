import React from 'react'
import { NavLink } from 'react-router-dom'
import { useFinance } from '../context/FinanceContext'

export default function Sidebar() {
  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/transactions', label: 'Transactions', icon: '📝' },
    { path: '/insights', label: 'Insights', icon: '💡' },
  ]

  return (
    <div className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 dark:from-blue-950 dark:to-blue-900 text-white flex flex-col transition-all duration-300">
      <div className="p-6 border-b border-blue-700 dark:border-blue-800">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <img src="/FinPulse.png" alt="FinPulse Logo" className="h-10 w-auto" />
          FinPulse
        </h2>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block w-full text-left px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-500 dark:bg-blue-600 font-semibold'
                  : 'hover:bg-blue-700 dark:hover:bg-blue-800'
              }`
            }
          >
            <span className="mr-2">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-blue-700 dark:border-blue-800">
        <div className="text-sm text-blue-100 dark:text-blue-200">Version 1.0</div>
      </div>
    </div>
  )
}
