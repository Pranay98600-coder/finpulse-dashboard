import React from 'react'

export const mockTransactions = [
  {
    id: 1,
    date: '2024-04-01',
    amount: 2500,
    category: 'Salary',
    type: 'income',
  },
  {
    id: 2,
    date: '2024-04-02',
    amount: 150,
    category: 'Groceries',
    type: 'expense',
  },
  {
    id: 3,
    date: '2024-04-03',
    amount: 75,
    category: 'Utilities',
    type: 'expense',
  },
  {
    id: 4,
    date: '2024-04-04',
    amount: 50,
    category: 'Entertainment',
    type: 'expense',
  },
  {
    id: 5,
    date: '2024-04-05',
    amount: 1500,
    category: 'Freelance',
    type: 'income',
  },
  {
    id: 6,
    date: '2024-04-06',
    amount: 200,
    category: 'Shopping',
    type: 'expense',
  },
  {
    id: 7,
    date: '2024-04-07',
    amount: 100,
    category: 'Dining',
    type: 'expense',
  },
  {
    id: 8,
    date: '2024-04-08',
    amount: 60,
    category: 'Transport',
    type: 'expense',
  },
  {
    id: 9,
    date: '2024-04-09',
    amount: 300,
    category: 'Shopping',
    type: 'expense',
  },
  {
    id: 10,
    date: '2024-04-10',
    amount: 2500,
    category: 'Salary',
    type: 'income',
  },
]

export const getChartData = (transactions) => {
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  )

  let balance = 0
  return sortedTransactions.map((transaction) => {
    balance += transaction.type === 'income' ? transaction.amount : -transaction.amount
    return {
      date: transaction.date,
      balance,
    }
  })
}

export const getCategoryBreakdown = (transactions) => {
  const expenses = transactions.filter((t) => t.type === 'expense')
  const breakdown = {}

  expenses.forEach((transaction) => {
    if (!breakdown[transaction.category]) {
      breakdown[transaction.category] = 0
    }
    breakdown[transaction.category] += transaction.amount
  })

  return Object.entries(breakdown).map(([name, value]) => ({
    name,
    value,
  }))
}
