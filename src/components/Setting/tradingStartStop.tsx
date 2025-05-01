'use client'

import { useState , useEffect } from "react"
import apiClient from "@/lib/axios"
import { toast } from "react-toastify"

const TradingStartStop = () => {

  const [isLoading, setIsLoading] = useState(false)
  const [stockTradingStart, setStockTradingStart] = useState(false)
  const [optionsTradingStart, setOptionsTradingStart] = useState(false)

  const bringSettingValue = async () => {
    setIsLoading(true)
    const response = apiClient.get("/getStartStopSettings").then((res) => {
      console.log(res)
      setStockTradingStart(res.data.stockStart)
      setOptionsTradingStart(res.data.optionsStart)
      setIsLoading(false)
    })
  }

  const changeStockTradingStart = async () => {
    const response = apiClient.post("/changeStockTradingStart", {
      stockStart: !stockTradingStart
    }).then((res) => {
      setStockTradingStart(!stockTradingStart)
      toast.success("Stock Trading Start Changed")
    }).catch((err) => {
      toast.error("Stock Trading Start Change Failed")
    })
  }

  const changeOptionsTradingStart = async () => {
    const response = apiClient.post("/changeOptionsTradingStart", {
      optionsStart: !optionsTradingStart
    }).then((res) => {
      setOptionsTradingStart(!optionsTradingStart)
      toast.success("Options Trading Start Changed")
    }).catch((err) => {
      toast.error("Options Trading Start Change Failed")
    })
  }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Trading Controls</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">Manage your trading system status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stock Trading Card */}
        <div className="flex flex-col gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h4 className="text-lg font-medium text-gray-800 dark:text-white">Stock Trading</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Control stock trading system</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              stockTradingStart 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {stockTradingStart ? 'Active' : 'Inactive'}
            </div>
          </div>
          <button 
            className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
              stockTradingStart
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
            onClick={changeStockTradingStart}
          >
            {stockTradingStart ? 'Stop Trading' : 'Start Trading'}
          </button>
        </div>

        {/* Options Trading Card */}
        <div className="flex flex-col gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h4 className="text-lg font-medium text-gray-800 dark:text-white">Options Trading</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Control options trading system</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              optionsTradingStart 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {optionsTradingStart ? 'Active' : 'Inactive'}
            </div>
          </div>
          <button 
            className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
              optionsTradingStart
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
            onClick={changeOptionsTradingStart}
          >
            {optionsTradingStart ? 'Stop Trading' : 'Start Trading'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TradingStartStop;
