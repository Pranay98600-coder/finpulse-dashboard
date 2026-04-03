import React from 'react'
import { useFinance } from '../context/FinanceContext'
import { formatCurrency } from '../utils/currencyFormat'

export default function SummaryCards() {
  const { transactions } = useFinance()

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalBalance = totalIncome - totalExpenses

  const cards = [
    {
      title: 'Total Balance',
      amount: totalBalance,
      color: 'blue',
      icon: '💵',
    },
    {
      title: 'Total Income',
      amount: totalIncome,
      color: 'green',
      icon: '📈',
    },
    {
      title: 'Total Expenses',
      amount: totalExpenses,
      color: 'red',
      icon: '📉',
    },
  ]

  const getCardClasses = (color) => {
    const baseClasses = 'rounded-lg p-6 shadow-md border transition-all duration-300 hover:scale-105 cursor-pointer'
    const colorMap = {
      'blue': 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 dark:border-blue-700 border-blue-200',
      'green': 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 dark:border-green-700 border-green-200',
      'red': 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-800 dark:border-red-700 border-red-200'
    }
    return `${baseClasses} ${colorMap[color]}`
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={getCardClasses(card.color)}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">{card.title}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {formatCurrency(card.amount)}
              </p>
            </div>
            <span className="text-4xl">{card.icon}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
