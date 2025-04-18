'use client'
import { useState , useEffect } from "react"
import apiClient from "@/lib/axios"
import { toast } from "react-toastify"

const ProfitLossSetting = () => {

  const [isLoading, setIsLoading] = useState(true)
  const [profitLabel, setProfitLabel] = useState("")
  const [lossLabel, setLossLabel] = useState("")
  const [profit, setProfit] = useState("")
  const [loss, setLoss] = useState("")

  const bringSettingValue = async () => {
    setIsLoading(true)
    const response = apiClient.get("/getSettings").then((res) => {
      console.log(res)
      setProfitLabel(res.data.profitPercent)
      setLossLabel(res.data.lossPercent)
      setIsLoading(false)
    })
  }

  const saveSettings = async () => {
    if (profit === "" || loss === "") {
      toast.error("Please enter a valid amount")
      return
    }
    const response = apiClient.post("/saveProfitLossSettings", {
      profitPercent: profit,
      lossPercent: loss
    }).then((res) => {
      if (res.status === 200) { 
        bringSettingValue()
        toast.success("Settings saved successfully")
        console.log(res)
      }
    })
  }
  useEffect(() => {
    bringSettingValue()
  }, [])


    return (
      <div className='flex flex-col w-full gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800'>
      <div className='flex flex-col gap-4'>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Profit/Loss Settings</h3>
        
        {/* Current Settings Display */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg'>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">Profit</span>
            <span className="text-sm font-medium text-green-500 dark:text-green-500">{profitLabel}%</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">Loss</span>
            <span className="text-sm font-medium text-green-500 dark:text-red-500">{lossLabel}%</span>
          </div>
        </div>
      </div>
      
      <div className='space-y-4'>
        {/* Stock Input */}
        <div className='flex flex-col sm:flex-row sm:items-center gap-3'>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 w-24">Profit</label>
          <div className="relative flex-1">
            <input 
              type="number" 
              value={profit} 
              onChange={(e) => setProfit(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       transition duration-200 ease-in-out
                       text-sm"
              placeholder="Enter profit limit"
            />
          </div>
        </div>

        {/* Options Input */}
        <div className='flex flex-col sm:flex-row sm:items-center gap-3'>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 w-24">Loss</label>
          <div className="relative flex-1">
            <input 
              type="number" 
              value={loss} 
              onChange={(e) => setLoss(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       transition duration-200 ease-in-out
                       text-sm"
              placeholder="Enter loss limit"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
        <button 
          className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-sm
                   transition-all duration-200 flex items-center justify-center gap-2'
          onClick={() => {
            setProfit("")
            setLoss("")
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Cancel
        </button>
        <button 
          className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md 
                   transition-all duration-200 flex items-center justify-center gap-2'
          onClick={saveSettings}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Save Changes
        </button>
      </div>
    </div>
    )
}

export default ProfitLossSetting;
