import React from 'react'
import { useFinance } from '../context/FinanceContext'

export default function Topbar() {
  const { role, updateRole, darkMode, toggleDarkMode } = useFinance()

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center transition-colors duration-300">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">FinPulse Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">Welcome back! Here's your financial overview.</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Toggle dark mode"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>

        {/* Role Selector */}
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg transition-colors">
          {['viewer', 'admin'].map((r) => (
            <button
              key={r}
              onClick={() => updateRole(r)}
              className={`px-4 py-2 rounded transition-colors capitalize font-medium ${
                role === r
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
