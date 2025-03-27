'use client'
import { useState , useEffect } from "react";
import apiClient from "@/lib/axios";

const formatDateTime = (dateTimeString: string) => {
  const date = new Date(dateTimeString);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours() % 12 || 12;
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
  
  return `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`;
};

type RowsPerPage = 5 | 10 | 15 | 20;


const OpenOptionsPositions = ({ openPositions }: { openPositions: any[] }) => {

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  // Calculate total pages
  const totalRows = openPositions.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return openPositions.slice(startIndex, endIndex);
  };

  const handleCloseClick = (order: any) => {
    setSelectedOrder(order);
    setShowConfirmModal(true);
  };

  const handleConfirmClose = () => {
    // Add your close position logic here
    console.log('Closing position:', selectedOrder);

    const payload = {
      symbol: selectedOrder.symbol,
      side  : selectedOrder.side,
      qty   : selectedOrder.qty,
    }

    const result = apiClient.post("/api/trader/sellOptionsOrder", payload).then((res) => {
      console.log(res.data);
      setShowConfirmModal(false);
      setSelectedOrder(null);
    }).catch((err) => {
      console.log(err);
    })
  };

  return (
    <div>

      

      <div className="mb-4.5 flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
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
            <option value={5} className="dark:text-white dark:bg-gray-dark">5 rows</option>
            <option value={10} className="dark:text-white dark:bg-gray-dark">10 rows</option>
            <option value={15} className="dark:text-white dark:bg-gray-dark">15 rows</option>
            <option value={20} className="dark:text-white dark:bg-gray-dark">20 rows</option>
          </select>
        </div>

        <div className="flex flex-col items-center justify-center gap-1 mb-4">
        <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-[#4B70E2] bg-clip-text text-transparent">
          Options Open Positions
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

      

      <div className="overflow-x-auto p-6 rounded-xl bg-white shadow-1 dark:bg-gray-dark dark:shadow-card mt-3">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-primary/10 dark:bg-primary/5">
              <th className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">
                No
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">
                Asset
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">
                Side
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">
                Qty
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">
                Price
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">
                Avg Entry
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">
                Today's P/L(%)
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">
                Today's P/L($)
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">
                Total P/L(%)
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">
                Total P/L($)
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {getCurrentPageData().map((order: any, index: number) => (
              order.asset_class === "us_option" ? (
              <tr key={index} className="border-b border-gray-200 text-center hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {(currentPage - 1) * rowsPerPage + index + 1}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {order.symbol}
                </td>
                <td className={`px-4 py-3 text-sm ${
                  order.side === 'long' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {order.side}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {order.qty}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {order.current_price}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {order.avg_entry_price}
                </td>
                <td className={`px-4 py-3 text-sm ${
                  order.unrealized_intraday_plpc >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {(order.unrealized_intraday_plpc >= 0 ? '+' : '')}{Number(order.unrealized_intraday_plpc * 100 || 0).toFixed(2)}%
                </td>
                <td className={`px-4 py-3 text-sm ${
                  order.unrealized_intraday_pl >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {(order.unrealized_intraday_pl >= 0 ? '+' : '-')}${Number(Math.abs(order.unrealized_pl || 0)).toFixed(2)}
                </td>
                <td className={`px-4 py-3 text-sm ${
                  order.unrealized_plpc >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {(order.unrealized_plpc >= 0 ? '+' : '')}{Number(order.unrealized_plpc * 100 || 0).toFixed(2)}%
                </td>
                <td className={`px-4 py-3 text-sm ${
                  order.unrealized_pl >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {(order.unrealized_pl >= 0 ? '+' : '-')}${Number(Math.abs(order.unrealized_pl || 0)).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  <button 
                    onClick={() => handleCloseClick(order)}
                    className="bg-gradient-to-r from-[#FF4D4D] to-[#FF6B6B] hover:from-[#FF3333] hover:to-[#FF4D4D] text-white px-4 py-2 rounded-lg transition-all duration-300"
                  >
                    Close
                  </button>
                </td>
              </tr>):("")
            ))}
          </tbody>
        </table>
      </div>
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
              Confirm Close Position
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to close this position?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleConfirmClose}
                className="flex-1 rounded-lg bg-gradient-to-r from-[#FF4D4D] to-[#FF6B6B] py-2.5 font-medium text-white hover:from-[#FF3333] hover:to-[#FF4D4D] transition-all duration-300"
              >
                OK
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedOrder(null);
                }}
                className="flex-1 rounded-lg py-2.5 font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-slate-500 hover:bg-gray-200 dark:hover:bg-dark transition-all duration-300"
              >
                Cancel
              </button>
          </div>
        </div>
        </div>
      )}
    </div>
  )
}

export default OpenOptionsPositions;
