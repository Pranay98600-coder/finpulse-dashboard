import React from 'react'
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { getChartData, getCategoryBreakdown } from '../data'
import { useFinance } from '../context/FinanceContext'
import { formatCurrency } from '../utils/currencyFormat'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

export default function ChartsSection() {
  const { transactions, darkMode } = useFinance()

  const chartData = getChartData(transactions)
  const categoryData = getCategoryBreakdown(transactions)

  // Chart colors change based on dark mode
  const chartColors = {
    grid: darkMode ? '#374151' : '#e5e7eb',
    text: darkMode ? '#9ca3af' : '#6b7280',
    tooltip: darkMode ? '#1f2937' : '#f9fafb',
    tooltipBorder: darkMode ? '#374151' : '#e5e7eb',
  }

  if (!chartData.length || !categoryData.length) {
    return (
      <div className="p-6">
        <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-6 text-center transition-colors duration-300">
          <p className="text-blue-800 dark:text-blue-200 text-lg font-medium">
            📊 No data available to display charts
          </p>
          <p className="text-blue-700 dark:text-blue-300 text-sm mt-2">
            Add some transactions to see your financial overview
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Balance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis
                dataKey="date"
                tick={{ fill: chartColors.text, fontSize: 12 }}
              />
              <YAxis tick={{ fill: chartColors.text, fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: chartColors.tooltip,
                  border: `1px solid ${chartColors.tooltipBorder}`,
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Spending by Category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: chartColors.tooltip,
                  border: `1px solid ${chartColors.tooltipBorder}`,
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
