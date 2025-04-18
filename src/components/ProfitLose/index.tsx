'use client'
import { useEffect , useState } from "react";

type RowsPerPage = 5 | 10 | 15 | 20;

const ProfitLose = ({data}:{data:any}) => {

  const [rowsPerPage, setRowsPerPage] = useState<RowsPerPage>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Calculate total pages
  const totalRows = data.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  };
  
  
    return (
    <div className="overflow-x-auto p-6 rounded-xl bg-white shadow-1 dark:bg-gray-800 dark:shadow-card mt-3">
      <div className="mb-4.5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between items-center">
        <div className="flex px-3 items-center gap-3">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Show rows:
          </label>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value) as RowsPerPage);
              setCurrentPage(1); // Reset to first page when changing rows per page
            }}
            className="rounded-lg border border-stroke bg-transparent px-3 py-2 text-sm font-medium outline-none transition-all focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white [&>option]:dark:bg-dark-2"
          >
            <option value={5} className="dark:text-white dark:bg-gray-800">5 rows</option>
            <option value={10} className="dark:text-white dark:bg-gray-800">10 rows</option>
            <option value={15} className="dark:text-white dark:bg-gray-800">15 rows</option>
            <option value={20} className="dark:text-white dark:bg-gray-800">20 rows</option>
          </select>
        </div>

        <div className="flex flex-col items-center justify-center gap-1 mb-4">
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-[#4B70E2] bg-clip-text text-transparent">
            Stock Profit/Loss
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-[#4B70E2] rounded-full"></div>
        </div>

        {/* Pagination */}
        <div className="flex items-center gap-2 px-3">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex h-9 min-w-[36px] items-center justify-center rounded-md border border-stroke bg-gray-1 px-3 text-sm font-medium text-gray-6 transition-all hover:bg-gray-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-3 dark:bg-dark-2 dark:text-gray-4 dark:hover:bg-dark-1"
          >
            Previous
          </button>
          
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-gray-6 dark:text-gray-4">Page</span>
            <span className="flex min-w-[36px] items-center justify-center rounded-md bg-primary px-2 py-1 text-sm font-medium text-white">
              {currentPage}
            </span>
            <span className="text-sm font-medium text-gray-6 dark:text-gray-4">of {totalPages}</span>
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex h-9 min-w-[36px] items-center justify-center rounded-md border border-stroke bg-gray-1 px-3 text-sm font-medium text-gray-6 transition-all hover:bg-gray-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-3 dark:bg-dark-2 dark:text-gray-4 dark:hover:bg-dark-1"
          >
            Next
          </button>
        </div>
      </div>

      <div className="overflow-x-auto p-6 rounded-xl bg-white shadow-1 dark:bg-gray-800 dark:shadow-card mt-3">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-primary/10 dark:bg-primary/5">
              <th className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">
                No
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">
                Ticker
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">
                Order Type
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">
                Qty
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">
                Entry Price
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">
                Exit Price
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">
                Entry Date
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">
                Exit Date
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">
                P/L
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">
                Total P/L
              </th>
            </tr>
          </thead>

          <tbody>
            {getCurrentPageData().map((order: any, index: number) => (
              <tr key={order.id} className="border-b border-gray-200 text-center hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {(currentPage - 1) * rowsPerPage + index + 1}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {order.symbol}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {order.tradingType}
                </td>
                <td className={`px-4 py-3 text-sm ${
                  'text-green-600 dark:text-green-400' 
                }`}>
                  {order.quantity}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  ${Number(order.entryPrice).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  ${Number(order.exitPrice).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {order.entryTimestamp}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {order.exitTimestamp}
                </td>
                <td className={`px-4 py-3 text-sm ${
                  order.exitPrice - order.entryPrice >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {(order.exitPrice - order.entryPrice < 0 ? '-' : '')}${Math.abs(Number(order.exitPrice - order.entryPrice)).toFixed(2)}
                </td>
                <td className={`px-4 py-3 text-sm ${
                  (order.exitPrice - order.entryPrice) * order.quantity >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {((order.exitPrice - order.entryPrice) * order.quantity < 0 ? '-' : '')}${Math.abs(Number((order.exitPrice - order.entryPrice) * order.quantity)).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    )
}

export default ProfitLose