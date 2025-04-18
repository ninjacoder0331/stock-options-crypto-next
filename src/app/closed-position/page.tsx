'use client'

import { useState, useRef, useEffect } from 'react'
import OptionsClosedPosition from "@/components/OptionsClosedPosition"
import StockClosedPosition from "@/components/stockClosedPosition"

const ClosedPositionPage = () => {
  const [selectedHistory, setSelectedHistory] = useState('options')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleOptionSelect = (value) => {
    setSelectedHistory(value)
    setIsDropdownOpen(false)
  }

  return (
    <div className="">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Closed Positions</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">View your completed trades and their performance</p>
      </div>

      <div className="mb-6" ref={dropdownRef}>
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="w-full sm:w-64 px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                     rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     text-left text-gray-700 dark:text-gray-200 flex items-center justify-between transition-all duration-200"
          >
            <span className="flex items-center">
              {selectedHistory === 'options' ? (
                <>
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Options History
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Stock History
                </>
              )}
            </span>
            <svg 
              className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full sm:w-64 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 overflow-hidden transition-all duration-200 ease-in-out">
              <div className="py-1">
                <button
                  onClick={() => handleOptionSelect('options')}
                  className={`w-full px-4 py-2.5 text-left flex items-center hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors duration-150
                           ${selectedHistory === 'options' ? 'bg-blue-50 dark:bg-gray-600 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'}`}
                >
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Options History
                </button>
                <button
                  onClick={() => handleOptionSelect('stocks')}
                  className={`w-full px-4 py-2.5 text-left flex items-center hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors duration-150
                           ${selectedHistory === 'stocks' ? 'bg-blue-50 dark:bg-gray-600 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'}`}
                >
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Stock History
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 transition-all duration-300">
        {selectedHistory === 'options' ? (
          <OptionsClosedPosition />
        ) : (
          <StockClosedPosition />
        )}
      </div>
    </div>
  )
}

export default ClosedPositionPage
