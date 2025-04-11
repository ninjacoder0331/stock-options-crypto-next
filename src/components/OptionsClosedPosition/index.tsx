'use client'

import TitleLine from '@/components/TitleLine';
import apiClient from '@/lib/axios';
import { useState , useEffect } from 'react';

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

const OptionsClosedPosition = () => {

  const [openPositions, setOpenPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Initialize with today's date
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [totalProfitLoss, setTotalProfitLoss] = useState(0);
  const [portfolioHistory, setPortfolioHistory] = useState([]);

  // Handle date changes with validation
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    // Only update if the new start date is not after the end date
    if (newStartDate <= endDate) {
      setStartDate(newStartDate);
      calculateTotalProfitLoss(newStartDate , endDate);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    // Only update if the new end date is not before the start date and not after today
    if (newEndDate >= startDate && newEndDate <= today) {
      setEndDate(newEndDate);
      calculateTotalProfitLoss(startDate , newEndDate);
    }
  };

  const calculateTotalProfitLoss = (startDate: string, endDate: string) => {
    // Filter positions based on filled_at date
    const filteredPositions = openPositions.filter((position: any) => {
      if (!position.filled_at) return false;
      
      const positionDate = new Date(position.filled_at);
      // Create dates with time set to local midnight
      const start = new Date(startDate + 'T00:00:00');
      const end = new Date(endDate + 'T23:59:59');
      
      return positionDate >= start && positionDate <= end;
    });

    console.log("startDate", new Date(startDate + 'T00:00:00'));
    console.log("endDate", new Date(endDate + 'T23:59:59'));
    console.log("Filtered positions:", filteredPositions);

    // Calculate total profit/loss
    const total = filteredPositions.reduce((acc: number, position: any) => {
      if (!position.filled_avg_price || !position.filled_qty) return acc;
      
      const value = position.side === 'buy' 
        ? -(position.filled_avg_price * position.filled_qty * 100) 
        : (position.filled_avg_price * position.filled_qty * 100);
      
      return acc + value;
    }, 0);

    setTotalProfitLoss(total);
    console.log("total", total);
  }

  useEffect(() => {
    const result = apiClient.get("/api/trader/closedpositions")
    .then((res) => {
      console.log(res.data);
      setOpenPositions(res.data.orders);
      setPortfolioHistory(res.data.portfolio_history);
      setIsLoading(false);
    })
    .catch((err) => {
      console.log(err);
      setIsLoading(false);
    })
  }, []);

  if (isLoading) {
    return <div>Loading...</div>
  }

    // Calculate total pages
    const totalRows = openPositions.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);

    // Get current page data
    const getCurrentPageData = () => {
      const startIndex = (currentPage - 1) * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      return openPositions.slice(startIndex, endIndex);
    };

    return (
        <div>
          
          {/* Table Controls */}
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
            <option value={5} className="dark:text-white dark:bg-gray-dark">5 rows</option>
            <option value={10} className="dark:text-white dark:bg-gray-dark">10 rows</option>
            <option value={15} className="dark:text-white dark:bg-gray-dark">15 rows</option>
            <option value={20} className="dark:text-white dark:bg-gray-dark">20 rows</option>
          </select>
        </div>

        <div className="flex flex-col items-center justify-center gap-1 mb-4">
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-[#4B70E2] bg-clip-text text-transparent">
            Options Closed Positions
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

      <div className='flex flex-col gap-4'>
        {/* Date Range Selector */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-xl shadow-1 dark:bg-gray-dark dark:shadow-card">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
            <div className="flex flex-col gap-1 w-full sm:w-auto">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
              <input 
                type="date" 
                value={startDate}
                max={endDate}
                onChange={handleStartDateChange}
                className="rounded-lg border border-stroke bg-transparent px-3 py-2 text-sm font-medium outline-none transition-all focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
            </div>
            <div className="flex flex-col gap-1 w-full sm:w-auto">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
              <input 
                type="date" 
                value={endDate}
                min={startDate}
                max={today}
                onChange={handleEndDateChange}
                className="rounded-lg border border-stroke bg-transparent px-3 py-2 text-sm font-medium outline-none transition-all focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
              />
            </div>
          </div>
          
          {/* Profit/Loss Summary */}
          <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800 w-full sm:w-auto">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Total&nbsp;&nbsp;P/L</h3>
            <p className={`text-xl font-bold ${totalProfitLoss >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {totalProfitLoss.toFixed(0)}
            </p>
          </div>
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
                Order Type
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">
                Side
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">
                Status
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">
                Qty
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">
                Filled Qty
              </th>
              <th className='whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-200'>
                Total Amount
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">
                Submitted At
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">
                Filled At
              </th>
            </tr>
          </thead>

          <tbody>
            {getCurrentPageData().map((order: any, index: number) => (
              order.asset_class === "us_option" ? (
              <tr key={order.id} className="border-b border-gray-200 text-center hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {(currentPage - 1) * rowsPerPage + index + 1}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {order.symbol}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {order.order_type}
                </td>
                <td className={`px-4 py-3 text-sm ${
                  order.side === 'buy' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {order.side}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {order.status}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {order.qty}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {order.filled_qty}
                </td>
                <td className={`px-4 py-3 text-sm ${
                  order.side === 'buy' 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-green-600 dark:text-green-400'
                }`}>
                  {order.side === 'buy' ? -(order.filled_avg_price * order.filled_qty * 100).toFixed(0) : (order.filled_avg_price * order.filled_qty * 100).toFixed(0)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {formatDateTime(order.submitted_at)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {order.filled_at ? formatDateTime(order.filled_at) : "-"}
                </td>
              </tr>):("")
            ))}
          </tbody>
        </table>
      </div>
        </div>
    )
}

export default OptionsClosedPosition;
