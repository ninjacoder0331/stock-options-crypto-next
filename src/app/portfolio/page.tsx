'use client'

import { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';
import PortfolioChart from '@/components/portfolioChart';
import TitleLine from '@/components/TitleLine';


type RowsPerPage = 10 | 20 | 'all';

interface PortfolioHistory {
  timestamp: number[];
  equity: number[];
  profit_loss: number[];
  profit_loss_pct: number[];
  base_value: number;
}

const MyPortfolio = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [accountInfo, setAccountInfo] = useState<any>(null);
  const [positions , setPositions] = useState<any>(null);
  const [portfolioHistory, setPortfolioHistory] = useState<PortfolioHistory | null>(null);

  const [rowsPerPage, setRowsPerPage] = useState<RowsPerPage>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const formatPercentage = (num: number) => {
    return (num * 100).toFixed(4) + '%';
  };

  useEffect(() => {
    setIsLoading(true);
    apiClient.get('/account').then((res) => {
      setAccountInfo(res.data.account_info);
      setPortfolioHistory(res.data.portfolio_history);
      setPositions(res.data.positions);
      
      setIsLoading(false);
      console.log(res.data);
    })
    
  }, [])

  // Calculate total pages
  const totalRows: number = portfolioHistory?.timestamp.length || 0;
  const totalPages: number = Math.ceil(totalRows / (rowsPerPage === 'all' ? totalRows : rowsPerPage));

  // Get current page data
  const getCurrentPageData = (): number[] => {
    const reversedData = portfolioHistory?.timestamp.slice().reverse() || [];
    if (rowsPerPage === 'all') return reversedData;
    
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return reversedData.slice(startIndex, endIndex);
  };

  const handleRowsPerPageChange = (value: string): void => {
    const newValue = value === 'all' ? 'all' : Number(value) as RowsPerPage;
    setRowsPerPage(newValue);
    setCurrentPage(1);
  };

  if (isLoading) {
    return <div>Loading...</div>
  }

  return(
    <div>
      <TitleLine title="My Portfolio" description="My portfolio history" />

      <div className='mb-4'>
        <PortfolioChart portfolioHistory={portfolioHistory}/>
      </div>


      {/* Table Controls */}
      <div className="mb-4.5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex px-3 items-center gap-3">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400 text-center">
            Show rows:
          </label>
          <select
            value={rowsPerPage}
            onChange={(e) => handleRowsPerPageChange(e.target.value)}
            className="rounded-lg border border-stroke bg-transparent px-3 py-2 text-sm font-medium outline-none transition-all focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white [&>option]:dark:bg-dark-2"
          >
            <option value={10} className='dark:text-white dark:bg-gray-800 '>10 rows</option>
            <option value={20} className='dark:text-white dark:bg-gray-800 '>20 rows</option>
            <option value="all" className='dark:text-white dark:bg-gray-800 '>All rows</option>
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

      <div className="overflow-x-auto p-6 rounded-xl bg-white shadow-1 dark:bg-gray-800 dark:shadow-card mt-3">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-primary/10 dark:bg-primary/5">
              <th className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">
                No
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">
                Date
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">
                Equity
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">
                Profit/Loss
              </th>
              <th className="whitespace-nowrap px-4 py-3 text-center text-sm font-semibold text-gray-800 dark:text-gray-200">
                P/L %
              </th>
            </tr>
          </thead>
          <tbody>
            {getCurrentPageData().map((time, index) => {
              const reverseIndex = portfolioHistory?.timestamp.length - 1 - (
                rowsPerPage === 'all' ? index : (currentPage - 1) * (rowsPerPage as number) + index
              ) || 0;
              const isProfitPositive = portfolioHistory?.profit_loss[reverseIndex] >= 0;
              const isProfitPctPositive = portfolioHistory?.profit_loss_pct[reverseIndex] >= 0;
              
              return (
                <tr 
                  key={time}
                  className="border-b border-gray-200 text-center hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {(currentPage - 1) * (rowsPerPage === 'all' ? 1 : rowsPerPage) + index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {formatDate(time)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    ${formatNumber(portfolioHistory?.equity[reverseIndex])}
                  </td>
                  <td className={`px-4 py-3 text-sm ${
                    isProfitPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    <span className="flex items-center justify-center gap-1">
                      {isProfitPositive ? '+' : '-'}
                      ${formatNumber(Math.abs(portfolioHistory?.profit_loss[reverseIndex] || 0))}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-sm ${
                    isProfitPctPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    <span className="flex items-center justify-center gap-1">
                      {isProfitPctPositive ? '+' : '-'}
                      {formatPercentage(Math.abs(portfolioHistory?.profit_loss_pct[reverseIndex] || 0))}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-primary/10 dark:bg-primary/5">
              <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-gray-200">
                Base Value
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-gray-200" colSpan={3}>
                ${formatNumber(portfolioHistory?.base_value)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
};

export default MyPortfolio;

