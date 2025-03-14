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

const TransactionsPage = () => {

  const [historyOrders , setHistoryOrders] = useState<any>([]);
  const [isLoading , setIsLoading] = useState<boolean>(false);
  const [rowsPerPage, setRowsPerPage] = useState<RowsPerPage>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    setIsLoading(true);
    apiClient.get('/get_all_orders').then((res) => {
      console.log(res.data);

      setHistoryOrders(res.data);
      setIsLoading(false);
    })
    .catch((err) => {
      console.log(err);
      setIsLoading(false);
    })

  }, [])

  if(isLoading){
    return <div>Loading...</div>
  }

  // Calculate total pages
  const totalRows = historyOrders.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  // Get current page data
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return historyOrders.slice(startIndex, endIndex);
  };

  return (
    <div>
      <div className="mb-8 ">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-white">
            My Transactions
          </h1>
          <div className="flex items-center gap-2">
            <span className="h-1 w-20 bg-primary rounded"></span>
            <span className="h-1 w-4 bg-primary/60 rounded"></span>
            <span className="h-1 w-2 bg-primary/40 rounded"></span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            My transactions history
          </p>
        </div>
      </div>

      {/* Table Controls */}
      <div className="mb-4.5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr className="bg-gray-2 dark:bg-dark-2">
              <th scope="col" className="px-6 py-4 text-sm font-semibold text-black dark:text-white first:pl-8">
                No
              </th>
              <th scope="col" className="px-6 py-4 text-sm font-semibold text-black dark:text-white">
                Asset
              </th>
              <th scope="col" className="px-6 py-4 text-sm font-semibold text-black dark:text-white">
                Order Type
              </th>
              <th scope="col" className="px-6 py-4 text-sm font-semibold text-black dark:text-white">
                Side
              </th>
              <th scope="col" className="px-6 py-4 text-sm font-semibold text-black dark:text-white">
                Status
              </th>
              <th scope="col" className="px-6 py-4 text-sm font-semibold text-black dark:text-white">
                Qty
              </th>
              <th scope="col" className="px-6 py-4 text-sm font-semibold text-black dark:text-white">
                Filled Qty
              </th>
              <th scope="col" className="px-6 py-4 text-sm font-semibold text-black dark:text-white">
                Submitted At
              </th>
              <th scope="col" className="px-6 py-4 text-sm font-semibold text-black dark:text-white last:pr-8">
                Filled At
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-dark-3">
            {getCurrentPageData().map((order: any, index: number) => (
              <tr key={order.id} className="transition-colors duration-200 hover:bg-gray-1 dark:hover:bg-dark-2">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-black dark:text-white first:pl-8">
                  {(currentPage - 1) * rowsPerPage + index + 1}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-black dark:text-white">
                  {order.symbol}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-black dark:text-white">
                  {order.order_type}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-black dark:text-white">
                  {order.side}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-black dark:text-white">
                  {order.status}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-black dark:text-white">
                  {order.qty}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-black dark:text-white">
                  {order.filled_qty}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-black dark:text-white">
                  {formatDateTime(order.submitted_at)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-black dark:text-white last:pr-8">
                  {formatDateTime(order.filled_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsPage;
