/**
 * Convert transactions array to CSV format
 * @param {Array} transactions - Array of transaction objects
 * @returns {string} CSV formatted string
 */
export const convertToCSV = (transactions) => {
  if (!transactions || transactions.length === 0) {
    return 'date,category,amount,type'
  }

  // CSV header
  const headers = ['date', 'category', 'amount', 'type']

  // Convert to CSV rows
  const rows = transactions.map((transaction) => {
    const date = new Date(transaction.date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })

    return [
      `"${date}"`,
      `"${transaction.category}"`,
      transaction.amount.toFixed(2),
      transaction.type,
    ].join(',')
  })

  return [headers.join(','), ...rows].join('\n')
}

/**
 * Convert transactions array to JSON format
 * @param {Array} transactions - Array of transaction objects
 * @returns {string} JSON formatted string
 */
export const convertToJSON = (transactions) => {
  if (!transactions || transactions.length === 0) {
    return JSON.stringify([], null, 2)
  }

  const formattedTransactions = transactions.map((transaction) => ({
    date: new Date(transaction.date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }),
    category: transaction.category,
    amount: parseFloat(transaction.amount.toFixed(2)),
    type: transaction.type,
  }))

  return JSON.stringify(formattedTransactions, null, 2)
}

/**
 * Trigger file download using Blob
 * @param {string} content - File content
 * @param {string} filename - Filename for download
 * @param {string} mimeType - MIME type of file
 */
export const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Clean up the URL object
  URL.revokeObjectURL(url)
}

/**
 * Export transactions as CSV
 * @param {Array} transactions - Array of transaction objects
 */
export const exportAsCSV = (transactions) => {
  const csv = convertToCSV(transactions)
  const timestamp = new Date().toISOString().split('T')[0]
  downloadFile(csv, `transactions-${timestamp}.csv`, 'text/csv;charset=utf-8;')
}

/**
 * Export transactions as JSON
 * @param {Array} transactions - Array of transaction objects
 */
export const exportAsJSON = (transactions) => {
  const json = convertToJSON(transactions)
  const timestamp = new Date().toISOString().split('T')[0]
  downloadFile(json, `transactions-${timestamp}.json`, 'application/json;charset=utf-8;')
}
