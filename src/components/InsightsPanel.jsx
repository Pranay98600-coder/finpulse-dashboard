import React from 'react'
import { useFinance } from '../context/FinanceContext'
import { formatCurrency } from '../utils/currencyFormat'

export default function InsightsPanel() {
  const { transactions } = useFinance()

  // Get current and previous month
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const currentMonthTransactions = transactions.filter((t) => {
    const date = new Date(t.date)
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear
  })

  const previousMonthTransactions = transactions.filter((t) => {
    const date = new Date(t.date)
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear
    return date.getMonth() === prevMonth && date.getFullYear() === prevYear
  })

  // Calculations
  const currentMonthExpenses = currentMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const previousMonthExpenses = previousMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const currentMonthIncome = currentMonthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const previousMonthIncome = previousMonthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  // Highest spending category
  const categorySpending = {}
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount
    })

  const highestCategory = Object.entries(categorySpending).length
    ? Object.entries(categorySpending).sort((a, b) => b[1] - a[1])[0]
    : null

  const expenseDifference = currentMonthExpenses - previousMonthExpenses
  const incomeDifference = currentMonthIncome - previousMonthIncome

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Comparison */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-300 hover:scale-105 cursor-pointer">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            📊 Monthly Comparison
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">This Month Expenses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(currentMonthExpenses)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Previous: {formatCurrency(previousMonthExpenses)}
              </p>
            </div>
            <div className={`p-3 rounded-lg transition-colors ${
              expenseDifference > 0 ? 'bg-red-50 dark:bg-red-900' : 'bg-green-50 dark:bg-green-900'
            }`}>
              <p className={`text-sm font-semibold ${
                expenseDifference > 0 ? 'text-red-700 dark:text-red-200' : 'text-green-700 dark:text-green-200'
              }`}>
                {expenseDifference > 0 ? '📈' : '📉'} {formatCurrency(Math.abs(expenseDifference))} {expenseDifference > 0 ? 'more' : 'less'} than last month
              </p>
            </div>
          </div>
        </div>

        {/* Income Comparison */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-300 hover:scale-105 cursor-pointer">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            💰 Income Comparison
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">This Month Income</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(currentMonthIncome)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Previous: {formatCurrency(previousMonthIncome)}
              </p>
            </div>
            <div className={`p-3 rounded-lg transition-colors ${
              incomeDifference > 0 ? 'bg-green-50 dark:bg-green-900' : 'bg-orange-50 dark:bg-orange-900'
            }`}>
              <p className={`text-sm font-semibold ${
                incomeDifference > 0 ? 'text-green-700 dark:text-green-200' : 'text-orange-700 dark:text-orange-200'
              }`}>
                {incomeDifference > 0 ? '📈' : '📉'} {formatCurrency(Math.abs(incomeDifference))} {incomeDifference > 0 ? 'more' : 'less'} than last month
              </p>
            </div>
          </div>
        </div>

        {/* Highest Spending Category */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-300 hover:scale-105 cursor-pointer">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            🎯 Highest Spending Category
          </h3>
          {highestCategory ? (
            <div className="space-y-3">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {highestCategory[0]}
                  </p>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">
                    {formatCurrency(highestCategory[1])}
                  </p>
                </div>
                <span className="text-4xl">💸</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{
                    width: `${(highestCategory[1] / 
                      Math.max(...Object.values(categorySpending))) * 100}%`,
                  }}
                />
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No expense data available</p>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-300 hover:scale-105 cursor-pointer">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">📈 Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Total Transactions</span>
              <span className="font-bold text-lg text-gray-900 dark:text-white">
                {transactions.length}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Avg Transaction</span>
              <span className="font-bold text-lg text-gray-900 dark:text-white">
                {formatCurrency(
                  transactions.length > 0
                    ? transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length
                    : 0
                )}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Categories</span>
              <span className="font-bold text-lg text-gray-900 dark:text-white">
                {Object.keys(categorySpending).length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
