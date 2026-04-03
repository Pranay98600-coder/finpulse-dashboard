import React, { useState } from 'react'
import { useFinance } from '../context/FinanceContext'
import Modal from './Modal'
import { formatCurrency } from '../utils/currencyFormat'
import { exportAsCSV, exportAsJSON } from '../utils/exportFunctions'

export default function TransactionsTable() {
  const {
    transactions,
    getFilteredTransactions,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    sortBy,
    setSortBy,
    role,
    deleteTransaction,
    addTransaction,
    editTransaction,
  } = useFinance()

  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    date: '',
    amount: '',
    category: '',
    type: 'expense',
  })

  const filteredTransactions = getFilteredTransactions()
  const hasNoTransactions = transactions.length === 0
  const hasNoFilteredResults = filteredTransactions.length === 0

  const handleAddClick = () => {
    setEditingId(null)
    setFormData({ date: '', amount: '', category: '', type: 'expense' })
    setShowModal(true)
  }

  const handleEditClick = (transaction) => {
    setEditingId(transaction.id)
    setFormData({
      date: transaction.date,
      amount: transaction.amount.toString(),
      category: transaction.category,
      type: transaction.type,
    })
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingId(null)
    setFormData({ date: '', amount: '', category: '', type: 'expense' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.date || !formData.amount || !formData.category) {
      alert('Please fill in all fields')
      return
    }

    if (editingId) {
      editTransaction(editingId, {
        ...formData,
        amount: parseFloat(formData.amount),
      })
    } else {
      addTransaction({
        ...formData,
        amount: parseFloat(formData.amount),
      })
    }

    handleCloseModal()
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id)
    }
  }

  const handleExportCSV = () => {
    const dataToExport = getFilteredTransactions()
    if (dataToExport.length === 0) {
      alert('No data to export. Please adjust your filters.')
      return
    }
    exportAsCSV(dataToExport)
  }

  const handleExportJSON = () => {
    const dataToExport = getFilteredTransactions()
    if (dataToExport.length === 0) {
      alert('No data to export. Please adjust your filters.')
      return
    }
    exportAsJSON(dataToExport)
  }

  return (
    <div className="p-6 space-y-4">
      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 space-y-4 transition-colors duration-300">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by category or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          />

          {/* Filter Buttons */}
          <div className="flex gap-2">
            {['all', 'income', 'expense'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg transition-all font-medium capitalize hover:opacity-90 ${
                  filterType === type
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Sorting and Add Button */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center md:justify-between">
          {/* Sort Buttons */}
          <div className="flex gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 self-center">Sort:</span>
            <button
              onClick={() => setSortBy(sortBy === 'date-newest' ? 'date-oldest' : 'date-newest')}
              className={`px-3 py-1 text-xs rounded transition-all hover:opacity-90 ${
                sortBy.includes('date')
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
              title={sortBy === 'date-newest' ? 'Latest first' : 'Oldest first'}
            >
              📅 Date {sortBy === 'date-newest' ? '↓' : '↑'}
            </button>
            <button
              onClick={() => setSortBy(sortBy === 'amount-high' ? 'amount-low' : 'amount-high')}
              className={`px-3 py-1 text-xs rounded transition-all hover:opacity-90 ${
                sortBy.includes('amount')
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
              title={sortBy === 'amount-high' ? 'High to low' : 'Low to high'}
            >
              💰 Amount {sortBy === 'amount-high' ? '↓' : '↑'}
            </button>
          </div>

          {/* Export and Add Buttons */}
          <div className="flex gap-2 flex-wrap w-full md:w-auto">
            {/* Export Buttons */}
            <button
              onClick={handleExportCSV}
              className="px-3 py-2 text-sm bg-blue-400 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-500 dark:hover:bg-blue-700 transition-all font-semibold hover:opacity-90 shadow-sm"
              title="Export filtered transactions as CSV"
            >
              📊 CSV
            </button>
            <button
              onClick={handleExportJSON}
              className="px-3 py-2 text-sm bg-indigo-400 dark:bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 dark:hover:bg-indigo-700 transition-all font-semibold hover:opacity-90 shadow-sm"
              title="Export filtered transactions as JSON"
            >
              📋 JSON
            </button>

            {/* Add Transaction Button */}
            {role === 'admin' && (
              <button
                onClick={handleAddClick}
                className="w-full md:w-auto px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-semibold hover:opacity-90 shadow-md"
              >
                + Add Transaction
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        title={editingId ? 'Edit Transaction' : 'Add New Transaction'}
        onClose={handleCloseModal}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Amount</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Category</label>
            <input
              type="text"
              placeholder="Enter category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              list="categories"
            />
            <datalist id="categories">
              <option value="Salary" />
              <option value="Freelance" />
              <option value="Groceries" />
              <option value="Utilities" />
              <option value="Entertainment" />
              <option value="Shopping" />
              <option value="Dining" />
              <option value="Transport" />
            </datalist>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-semibold hover:opacity-90"
            >
              {editingId ? 'Update' : 'Add'} Transaction
            </button>
            <button
              type="button"
              onClick={handleCloseModal}
              className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:opacity-90 transition-all font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto transition-colors duration-300">
        {hasNoTransactions ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              📭 No transactions yet. {role === 'admin' && 'Add one to get started!'}
            </p>
          </div>
        ) : hasNoFilteredResults ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              🔍 No matching transactions found.
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Type
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Amount
                </th>
                {role === 'admin' && (
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction, idx) => (
                <tr
                  key={transaction.id}
                  className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 ${
                    idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'
                  }`}
                >
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {new Date(transaction.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {transaction.category}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full font-semibold text-xs uppercase transition-colors ${
                        transaction.type === 'income'
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </td>
                  <td
                    className={`px-6 py-4 text-sm text-right font-semibold ${
                      transaction.type === 'income'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </td>
                  {role === 'admin' && (
                    <td className="px-6 py-4 text-center space-x-2">
                      <button
                        onClick={() => handleEditClick(transaction)}
                        className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-all hover:opacity-90"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-all hover:opacity-90"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

