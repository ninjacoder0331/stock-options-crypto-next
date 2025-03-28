'use client'

import { useState, useRef, useEffect } from 'react';
import apiClient from '@/lib/axios';
import TitleLine from '@/components/TitleLine';
import { stockTickers } from '@/assets/data';
import OptionsChainComponent from './optionsChainComponent';
import { toast } from 'react-toastify';

interface OptionChainData {
  snapshots: any; // Replace 'any' with proper type based on your API response
}

const OptionsTradingPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [symbol, setSymbol] = useState('');
  const [optionType, setOptionType] = useState<string>('call');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredTickers, setFilteredTickers] = useState<string[]>([]);
  const [optionChain, setOptionChain] = useState<OptionChainData | null>(null);
  const [current_Price, setCurrent_Price] = useState<string>('');
  const [strikePrice, setStrikePrice] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>('');
  const searchRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
    console.log(selectedDate);
  };

  const handleSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^A-Za-z]/g, '').toUpperCase();
    setSymbol(value);
    
    if (value.length > 0) {
      const filtered = stockTickers
        .filter(ticker => ticker.startsWith(value))
        .slice(0, 5); // Show only first 5 matches
      setFilteredTickers(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredTickers([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (ticker: string) => {
    setSymbol(ticker);
    setShowSuggestions(false);
  };

  const viewOptionChain = async () => {
    try {
      if(symbol === ""){
        toast.error("Please enter a symbol");
        return;
      }
      if(optionType === ""){
        toast.error("Please select an option type");
        return;
      }

      const formattedDate = selectedDate.toISOString().split('T')[0];
      const payload = {
        symbol,
        optionType,
        date: formattedDate
      };
      console.log(
        "payload", payload
      )

      const response = await apiClient.post("/api/brokerage/getOptionsChain", payload)
      .then((res) => {
        console.log("res", res);
        toast.success("Option chain fetched successfully");
        setOptionChain({
          snapshots: res.data.options_data
        });
        setCurrent_Price(res.data.current_price);

      }).catch((err) => {
        toast.error("Error fetching option chain");
        console.log("err", err);
        return;
      });
      
    } catch (err: any) {
      console.error('Error fetching option chain:', err);
      setError(err.response?.data?.message || 'Failed to fetch option chain');
    }
  };

  const buyOptions = async () => {
    console.log("buyOptions");
    const strikePrice_main = strikePrice.split(" | ")[0]
    if(strikePrice_main === ""){
      toast.error("Please select a strike price");
      return;
    }
    if(amount === ""){
      toast.error("Please enter an amount");
      return;
    }

    const payload = {
      symbol: strikePrice_main,
      amount: amount
    }

    const response = await apiClient.post("/api/brokerage/buyOptions", payload)
    .then((res) => {
      toast.success("Options bought successfully");
      console.log("res", res);
    })
    .catch((err) => {
      toast.error("Error buying options");
      console.log("err", err);
    })
  }

  useEffect(() => {
    // console.log("optionChain0", optionChain["snapshot"]);
    // console.log("optionChain[0]", optionChain[0]);
    console.log("optionChain[0].snapshots", optionChain);
  }, [optionChain]);

  return (
    <div>
      <TitleLine title="Options Trading" description="Options Trading Dashboard" />

      <div className='flex flex-col lg:flex-row gap-6 p-4'>
        <div className='lg:w-1/4 w-full flex flex-col gap-5'>
          {/* Trading Form */}
          <div className='w-full flex flex-col gap-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4'>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white ">Trading Form</h3>
            
            {/* Search Bar */}
            <div className="relative" ref={searchRef}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                id="symbol"
                value={symbol}
                onChange={handleSymbolChange}
                onFocus={() => symbol.length > 0 && setShowSuggestions(true)}
                placeholder='Enter Stock Symbol'
                maxLength={5}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition duration-200 ease-in-out
                         text-sm font-mono tracking-wider"
              />
              
              {/* Suggestions Dropdown */}
              {showSuggestions && filteredTickers.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
                  {filteredTickers.map((ticker) => (
                    <button
                      key={ticker}
                      onClick={() => handleSuggestionClick(ticker)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 
                               transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {ticker}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Option Type Selection */}
            <div className='grid grid-cols-2 gap-3'>
              <button 
                onClick={() => setOptionType('call')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg transition-all duration-200
                          ${optionType === 'call' 
                            ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                CALL
              </button>
              <button 
                onClick={() => setOptionType('put')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg transition-all duration-200
                          ${optionType === 'put' 
                            ? 'bg-red-600 text-white shadow-md hover:bg-red-700' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                </svg>
                PUT
              </button>
            </div>

            {/* View Chain Button */}
            <button 
              className='w-full bg-green-500 hover:bg-green-600 text-white py-2.5 px-4 rounded-lg shadow-md 
                       transition-all duration-200 flex items-center justify-center gap-2'
              onClick={() => {viewOptionChain()}}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              View Chain
            </button>

            {/* Amount Input */}
            <div className='w-full'>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400">$</span>
                </div>
                <input 
                  type="number"
                  value={amount}
                  onChange={(e) => {setAmount(e.target.value)}}
                  className='w-full pl-8 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition duration-200 ease-in-out
                           text-sm font-mono'
                  placeholder='Enter Amount'
                />
              </div>
            </div>

            {/* Strike Price Input */}
            <div className='w-full'>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400">$</span>
                </div>
                <input 
                  type="text"
                  value={strikePrice}
                  onDoubleClick={() => {setStrikePrice("")}}
                  className='w-full pl-8 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition duration-200 ease-in-out
                           text-sm font-mono'
                  placeholder='Strike Price'
                  readOnly
                />
              </div>
            </div>

            {/* Buy Options Button */}
            <button 
              className='w-full bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-4 rounded-lg shadow-md 
                       transition-all duration-200 flex items-center justify-center gap-2'
              onClick={() => {buyOptions()}}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Buy Options
            </button>
          </div>

          <div className='w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3'>
            <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-1">Select Date</h3>
            <div className="flex justify-between items-center mb-1">
              <button 
                onClick={handlePrevMonth}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-sm font-semibold text-gray-800 dark:text-white">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button 
                onClick={handleNextMonth}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-7 gap-0.5 mb-0.5">
              {dayNames.map(day => (
                <div key={day} className="text-center text-xs text-gray-500 dark:text-gray-400">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-0.5">
              {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square h-6" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const isSelected = selectedDate?.getDate() === day && 
                                selectedDate?.getMonth() === currentDate.getMonth() &&
                                selectedDate?.getFullYear() === currentDate.getFullYear();
                const isToday = day === new Date().getDate() && 
                              currentDate.getMonth() === new Date().getMonth() &&
                              currentDate.getFullYear() === new Date().getFullYear();

                return (
                  <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`
                      aspect-square h-6 flex items-center justify-center rounded text-xs
                      transition-all duration-200 shadow-sm
                      ${isSelected 
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' 
                        : isToday
                          ? 'bg-green-300 dark:bg-green-500 text-gray-900 dark:text-white'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className='lg:w-3/4 w-full'>
          {optionChain && <OptionsChainComponent data={optionChain.snapshots} current_Price={current_Price} selectedDate={selectedDate} setStrikePrice={setStrikePrice} />}
        </div>
      </div>
    </div>
  );
};

export default OptionsTradingPage;


