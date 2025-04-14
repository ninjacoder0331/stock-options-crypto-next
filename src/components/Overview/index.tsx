'use client'

import { useState , useEffect } from "react";
import apiClient from "@/lib/axios";
import AccountInfor from "../Stocktable/accountInfor";
import Position from "./position";
import { BuySellOrder, ProfitLoss, TotalTransaction, TotalView, ViewIcon } from 'public/index';
import ProfitChat from "../profitChart";
import { toast } from "react-toastify";
const Overview = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [accountInfo, setAccountInfo] = useState<any>(null);
  const [positions , setPositions] = useState<any>(null);
  const [portfolioHistory, setPortfolioHistory] = useState<any>(null);
  const [orders , setOrders] = useState<any>(null);

  const [buyOrders , setBuyOrders] = useState<any>(null);
  const [sellOrders , setSellOrders] = useState<any>(null);
  const [totalBuyNumber , setTotalBuyNumber] = useState<number>(0);
  const [totalSellNumber , setTotalSellNumber] = useState<number>(0);

  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [orderType, setOrderType] = useState<'buy' | 'sell' | null>(null);

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
    setBuyOrders(0);
    setSellOrders(0);
    setTotalBuyNumber(0);
    setTotalSellNumber(0);
    apiClient.get('/account').then((res) => {
      setAccountInfo(res.data.account_info);
      setPortfolioHistory(res.data.portfolio_history);
      setPositions(res.data.positions);
      setOrders(res.data.orders);
      setBuyOrders(res.data.buyOrders)
      setSellOrders(res.data.sellOrders)
      setTotalBuyNumber(res.data.buyAmount)
      setTotalSellNumber(res.data.sellAmount)
      setIsLoading(false);
      console.log(res.data);
    })
    
  }, [])

  const handleOrderClick = (type: 'buy' | 'sell') => {
    if (symbol === '' || quantity === '') {
      toast.error('Please enter a symbol and quantity');
      return;
    }
    setOrderType(type);
    setShowConfirm(true);
  };

  const buySellOrder = () => {
    apiClient.post('/buySellOrder', {
      symbol: symbol,
      quantity: quantity,
      type: orderType
    }).then((res) => {
      console.log(res.data);
      toast.success('Order placed successfully');
      // Reset form
      setSymbol('');
      setQuantity('');
    }).catch((err) => {
      toast.error('Error placing order');
    }).finally(() => {
      setShowConfirm(false);
      setOrderType(null);
    });
  };

  const handleReload = () => {
    window.location.reload();
  };

  if (isLoading) {
    return <div>Loading...</div>
  }

    return (
      <div>
        <div className="mb-8">
          <div className="flex flex-col gap-2 align-middle">
            <h1 className="text-2xl md:text-3xl flex flex-row gap-3 font-bold text-black dark:text-white">
              Overview
              {/* <button
              onClick={handleReload}
              className="flex h-6 items-center justify-center rounded-md border border-stroke bg-gray-1 px-3 text-gray-6 transition-all hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-gray-4 dark:hover:bg-dark-1"
              title="Reload data"
              >
              <IoReload className="h-5 w-5" />
            </button> */}
            </h1>

      
            
            <div className="flex items-center gap-2">
              <span className="h-1 w-20 bg-primary rounded"></span>
              <span className="h-1 w-4 bg-primary/60 rounded"></span>
              <span className="h-1 w-2 bg-primary/40 rounded"></span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your Stock trading portfolio and trading activity at a glance
            </p>
          </div>
        </div>
        <div className="">
              
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 pb-4'>

            {/* <div>
              <TotalView />
            </div> */}
            {/* Profit/Loss Card */}
            <div className='flex flex-col gap-4 rounded-sm  border-stroke bg-white p-5 shadow-default shadow-1 dark:bg-gray-800 dark:shadow-card'>
              {/* Chart */}
              <div className='flex-grow'>
                <ProfitLoss/>
              </div>
              
              {/* P/L Stats */}
              <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-3'>
                  {/* Icon Circle */}
                  
                  <div className='flex h-11.5 w-11.5 items-center justify-center rounded-full bg-[#F7931A] bg-opacity-10'>
                    <span className='text-xl text-[#F7931A]'>$</span>
                  </div>
                  
                  {/* Amount */}
                  <div className='flex flex-col gap-2'>
                  <span className='text-sm font-medium text-gray-5 dark:text-gray-4'>
                    Total Profit/Loss
                  </span>
                    <span className='text-2xl font-bold text-black dark:text-white'>
                      ${formatNumber(portfolioHistory?.equity[portfolioHistory?.equity.length - 1] - portfolioHistory?.base_value)}
                    </span>
                    {/* Calculate sum of profit_loss_pct */}
                    {(() => {
                      const totalProfitLossPct = portfolioHistory?.profit_loss_pct.reduce((sum, pct) => sum + pct, 0);
                      return (
                        <span className={`flex items-center gap-1 text-sm font-medium ${
                          totalProfitLossPct >= 0 
                            ? 'text-[#16A34A]'
                            : 'text-[#DC2626]'
                        }`}>
                          {totalProfitLossPct >= 0 ? '↑' : '↓'}
                          {(Math.abs(totalProfitLossPct || 0) * 100).toFixed(2)}%
                        </span>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>

            {/* Transactions Card */}
            <div className='flex flex-col gap-4 rounded-sm border-stroke bg-white p-5 shadow-default shadow-1 dark:bg-gray-800 dark:shadow-card'>
              {/* Chart */}
              <div className='flex-grow'>
                <TotalTransaction/>
              </div>
              
              {/* Transaction Stats */}
              <div className='flex flex-col gap-3'>
                {/* Buy/Sell Summary */}
                <div className='flex items-center justify-between'>
                  <div className='flex flex-col'>
                    <span className='text-sm font-medium text-gray-5 dark:text-gray-4'>
                      Total Buy Orders
                    </span>
                    <span className='text-lg font-semibold text-success'>
                      {buyOrders} orders
                    </span>
                    <span className='text-sm text-gray-5 dark:text-gray-4'>
                      total buy: <span className="text-[#16A34A] font-medium">{totalBuyNumber.toFixed(2)}</span>
                    </span>
                  </div>
                  <div className='flex flex-col items-end'>
                    <span className='text-sm font-medium text-gray-5 dark:text-gray-4'>
                      Total Sell Orders
                    </span>
                    <span className='text-lg font-semibold text-danger'>
                      {sellOrders} orders
                    </span>
                    <span className='text-sm text-gray-5 dark:text-gray-4'>
                      total sell: <span className="text-[#DC2626] font-medium">{totalSellNumber.toFixed(2)}</span>
                    </span>
                  </div>
                </div>
              </div>

            </div>

            <div className='flex flex-col gap-4 rounded-sm border-stroke bg-white p-5 shadow-default shadow-1 dark:bg-gray-800 dark:shadow-card'>
              {/* Title */}
              <span className='text-lg font-semibold text-black dark:text-white'>
                <BuySellOrder />
                Manual Buy and Sell Order
              </span>

              {/* Input Fields and Buttons */}
              <div className='flex flex-col gap-3'>
                {/* Input Fields */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 w-full'>
                  <input 
                    type="text" 
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    placeholder="Enter the stock symbol" 
                    className='w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2'
                  />
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Enter the quantity" 
                    className='w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2'
                  />
                </div>

                {/* Action Buttons */}
                <div className='flex gap-3'>
                  <button 
                    onClick={() => handleOrderClick('buy')}
                    className='flex-1 rounded-lg bg-gradient-to-r from-[#2563EB] to-[#3B82F6] py-2.5 font-medium text-white hover:from-[#1D4ED8] hover:to-[#2563EB] transition-all duration-300 shadow-sm hover:shadow-md'
                  >
                    Buy
                  </button>
                  <button 
                    onClick={() => handleOrderClick('sell')}
                    className='flex-1 rounded-lg bg-gradient-to-r from-[#DC2626] to-[#EF4444] py-2.5 font-medium text-white hover:from-[#B91C1C] hover:to-[#DC2626] transition-all duration-300 shadow-sm hover:shadow-md'
                  >
                    Sell
                  </button>
                </div>

                {/* Order Summary */}
                <div className='flex items-center justify-between mt-2'>
                  <div className='flex flex-col'>
                    <span className='text-sm font-medium text-gray-5 dark:text-gray-4'>
                      Symbol
                    </span>
                    <span className='text-lg font-semibold text-black dark:text-white'>
                      {symbol || '-'}
                    </span>
                  </div>
                  <div className='flex flex-col items-end'>
                    <span className='text-sm font-medium text-gray-5 dark:text-gray-4'>
                      Quantity
                    </span>
                    <span className='text-lg font-semibold text-black dark:text-white'>
                      {quantity || '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

         

          </div>

          

          <div>
            <ProfitChat portfolioHistory={portfolioHistory} />
          </div>
        
          <div className="flex flex-col justify-between gap-10 md:flex-row mt-4">
            <AccountInfor accountInfo={accountInfo} />

            <Position positions={positions} />
          </div>

          
        </div>

        {/* Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-dark-2 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                Confirm Order
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to {orderType} {quantity} shares of {symbol}?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={buySellOrder}
                  className={`flex-1 rounded-lg py-2.5 font-medium text-white transition-all duration-300 ${
                    orderType === 'buy' 
                      ? 'bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB]'
                      : 'bg-gradient-to-r from-[#DC2626] to-[#EF4444] hover:from-[#B91C1C] hover:to-[#DC2626]'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    setOrderType(null);
                  }}
                  className="flex-1 rounded-lg py-2.5 font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-dark-3 hover:bg-gray-200 dark:hover:bg-dark-4 transition-all duration-300"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
}

export default Overview;
