import React from "react";
import Card from "components/card";
import { MdSearch, MdPayments, MdPendingActions, MdVisibility, MdChevronLeft, MdChevronRight } from "react-icons/md";

const PendingPayments = ({ 
  transactions, 
  searchQuery, 
  onSearch, 
  currentPage, 
  pageSize, 
  onPageSizeChange, 
  onPageChange, 
  totalPages 
}) => {
  return (
    <Card className="bg-white dark:bg-navy-800 shadow-lg">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0">
          <div>
            <h4 className="text-lg font-bold text-navy-700 dark:text-white">
              Daily Collections
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Total: GH₵ {transactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search payments..."
              value={searchQuery}
              onChange={onSearch}
              className="w-full pl-10 pr-4 py-2 text-sm font-medium text-navy-700 dark:text-white bg-white dark:bg-navy-800 border border-gray-300 dark:border-navy-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 transition-colors"
            />
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-navy-700 dark:text-white" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-navy-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-navy-700 dark:text-white">Class</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-navy-700 dark:text-white">Terminal</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-navy-700 dark:text-white">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-navy-700 dark:text-white">Payment Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-navy-700 dark:text-white">Approval Date</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-navy-700 dark:text-white">Status</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-navy-700 dark:text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr 
                  key={transaction.id} 
                  className="border-b border-gray-100 dark:border-navy-700 hover:bg-gray-50 dark:hover:bg-navy-700/50 transition-colors"
                >
                  <td className="py-3 px-4 text-sm text-navy-700 dark:text-white">
                    {transaction.class}
                  </td>
                  <td className="py-3 px-4 text-sm text-navy-700 dark:text-white">
                    {transaction.terminal}
                  </td>
                  <td className="py-3 px-4 text-sm text-right">
                    <span className="font-medium text-navy-700 dark:text-white">
                      GH₵ {transaction.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-navy-700 dark:text-white">
                    {transaction.date}
                  </td>
                  <td className="py-3 px-4 text-sm text-navy-700 dark:text-white">
                    {transaction.approvalDate || '-'}
                  </td>
                  <td className="py-3 px-4 text-sm text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      Pending
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-center">
                    <div className="flex justify-center space-x-2">
                      <button 
                        className="p-1 text-green-500 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                        title="Process Payment"
                      >
                        <MdPayments className="h-5 w-5" />
                      </button>
                      <button 
                        className="p-1 text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title="View Details"
                      >
                        <MdPendingActions className="h-5 w-5" />
                      </button>
                      <button 
                        className="p-1 text-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        title="View"
                      >
                        <MdVisibility className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-navy-700 dark:text-white">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(e.target.value)}
              className="text-sm border border-gray-300 dark:border-navy-600 rounded-lg px-2 py-1 bg-white dark:bg-navy-800 text-navy-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-navy-700 dark:text-white">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex space-x-1">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1 rounded-lg text-navy-700 dark:text-white hover:bg-gray-100 dark:hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <MdChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1 rounded-lg text-navy-700 dark:text-white hover:bg-gray-100 dark:hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <MdChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PendingPayments; 