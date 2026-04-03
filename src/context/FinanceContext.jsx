import React, { createContext, useState, useCallback, useEffect } from 'react'
import { mockTransactions } from '../data'

export const FinanceContext = createContext()

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions')
    return saved ? JSON.parse(saved) : mockTransactions
  })

  const [role, setRole] = useState(() => {
    const saved = localStorage.getItem('userRole')
    return saved || 'viewer'
  })

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  // Apply dark mode class on mount and when darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('date-newest') // 'date-newest', 'date-oldest', 'amount-high', 'amount-low'
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  // Save transactions to localStorage
  const updateTransactions = useCallback((newTransactions) => {
    setTransactions(newTransactions)
    localStorage.setItem('transactions', JSON.stringify(newTransactions))
  }, [])

  // Update role
  const updateRole = useCallback((newRole) => {
    setRole(newRole)
    localStorage.setItem('userRole', newRole)
  }, [])

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const newMode = !prev
      localStorage.setItem('darkMode', JSON.stringify(newMode))
      return newMode
    })
  }, [])

  // Add transaction
  const addTransaction = useCallback((transaction) => {
    const newTransaction = {
      ...transaction,
      id: Math.max(...transactions.map((t) => t.id || 0), 0) + 1,
    }
    updateTransactions([...transactions, newTransaction])
  }, [transactions, updateTransactions])

  // Edit transaction
  const editTransaction = useCallback(
    (id, updates) => {
      updateTransactions(
        transactions.map((t) => (t.id === id ? { ...t, ...updates } : t))
      )
    },
    [transactions, updateTransactions]
  )

  // Delete transaction
  const deleteTransaction = useCallback(
    (id) => {
      updateTransactions(transactions.filter((t) => t.id !== id))
    },
    [transactions, updateTransactions]
  )

  // Get filtered and sorted transactions
  const getFilteredTransactions = useCallback(() => {
    let filtered = transactions.filter((t) => {
      const matchesSearch =
        t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.type.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter =
        filterType === 'all' || t.type === filterType

      return matchesSearch && matchesFilter
    })

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'date-newest') {
        return new Date(b.date) - new Date(a.date)
      } else if (sortBy === 'date-oldest') {
        return new Date(a.date) - new Date(b.date)
      } else if (sortBy === 'amount-high') {
        return b.amount - a.amount
      } else if (sortBy === 'amount-low') {
        return a.amount - b.amount
      }
      return 0
    })

    return sorted
  }, [transactions, searchTerm, filterType, sortBy])

  const value = {
    transactions,
    role,
    darkMode,
    searchTerm,
    filterType,
    sortBy,
    isLoading,
    updateTransactions,
    updateRole,
    toggleDarkMode,
    addTransaction,
    editTransaction,
    deleteTransaction,
    getFilteredTransactions,
    setSearchTerm,
    setFilterType,
    setSortBy,
  }

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  )
}

export const useFinance = () => {
  const context = React.useContext(FinanceContext)
  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider')
  }
  return context
}
