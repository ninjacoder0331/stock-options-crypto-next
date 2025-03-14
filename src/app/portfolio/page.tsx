'use client'

import { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';
import PortfolioChart from '@/components/portfolioChart';


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
      <div className="mb-8 ">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-white">
            My Portfolio
          </h1>
          <div className="flex items-center gap-2">
            <span className="h-1 w-20 bg-primary rounded"></span>
            <span className="h-1 w-4 bg-primary/60 rounded"></span>
            <span className="h-1 w-2 bg-primary/40 rounded"></span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            My portfolio history
          </p>
        </div>
      </div>

      <div className='mb-4'>
        <PortfolioChart portfolioHistory={portfolioHistory}/>
      </div>


      {/* Table Controls */}
      <div className="mb-4.5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex px-3 items-center gap-3">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Show rows:
          </label>
          <select
            value={rowsPerPage}
            onChange={(e) => handleRowsPerPageChange(e.target.value)}
            className="rounded-lg border border-stroke bg-transparent px-3 py-2 text-sm font-medium outline-none transition-all focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white [&>option]:dark:bg-dark-2"
          >
            <option value={10} className='dark:text-white dark:bg-gray-dark '>10 rows</option>
            <option value={20} className='dark:text-white dark:bg-gray-dark '>20 rows</option>
            <option value="all" className='dark:text-white dark:bg-gray-dark '>All rows</option>
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
                Date
              </th>
              <th scope="col" className="px-6 py-4 text-sm font-semibold text-black dark:text-white">
                Equity
              </th>
              <th scope="col" className="px-6 py-4 text-sm font-semibold text-black dark:text-white">
                Profit/Loss
              </th>
              <th scope="col" className="px-6 py-4 text-sm font-semibold text-black dark:text-white last:pr-8">
                P/L %
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-dark-3">
            {getCurrentPageData().map((time, index) => {
              const reverseIndex = portfolioHistory?.timestamp.length - 1 - (
                rowsPerPage === 'all' ? index : (currentPage - 1) * (rowsPerPage as number) + index
              ) || 0;
              const isProfitPositive = portfolioHistory?.profit_loss[reverseIndex] >= 0;
              const isProfitPctPositive = portfolioHistory?.profit_loss_pct[reverseIndex] >= 0;
              
              return (
                <tr 
                  key={time}
                  className="transition-colors duration-200 hover:bg-gray-1 dark:hover:bg-dark-2"
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-black dark:text-white first:pl-8">
                    {(currentPage - 1) * (rowsPerPage === 'all' ? 1 : rowsPerPage) + index + 1}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-black dark:text-white">
                    {formatDate(time)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-black dark:text-white">
                    ${formatNumber(portfolioHistory?.equity[reverseIndex])}
                  </td>
                  <td className={`whitespace-nowrap px-6 py-4 text-sm font-medium ${
                    isProfitPositive ? 'text-success' : 'text-danger'
                  }`}>
                    <span className="flex items-center gap-1">
                      {isProfitPositive ? '+' : '-'}
                      ${formatNumber(Math.abs(portfolioHistory?.profit_loss[reverseIndex] || 0))}
                    </span>
                  </td>
                  <td className={`whitespace-nowrap px-6 py-4 text-sm font-medium last:pr-8 ${
                    isProfitPctPositive ? 'text-success' : 'text-danger'
                  }`}>
                    <span className="flex items-center gap-1">
                      {isProfitPctPositive ? '+' : '-'}
                      {formatPercentage(Math.abs(portfolioHistory?.profit_loss_pct[reverseIndex] || 0))}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-gray-2 dark:bg-dark-2">
              <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-black dark:text-white first:pl-8">
                
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-black dark:text-white">
                Base Value
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-black dark:text-white last:pr-8" colSpan={3}>
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

