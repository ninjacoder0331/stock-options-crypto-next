'use client'

import AmountSetting from '@/components/Setting/amountSetting'
import TradingStartStop from '@/components/Setting/tradingStartStop'

const SettingsPage = () => {

  

    return (
        <div>
          <div className="mb-8">
            <div className="flex flex-col gap-2 align-middle">
              <h1 className="text-2xl md:text-3xl flex flex-row gap-3 font-bold text-black dark:text-white">
                Setting
              </h1>
              <div className="flex items-center gap-2">
                <span className="h-1 w-20 bg-primary rounded"></span>
                <span className="h-1 w-4 bg-primary/60 rounded"></span>
                <span className="h-1 w-2 bg-primary/40 rounded"></span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Set the trading amount per trade for stocks and options.
              </p>
            </div>
          </div>
          
          <div className='flex flex-col gap-4'>
            
            <AmountSetting />

            <TradingStartStop />

          </div>
         
          
        </div>
    )
}

export default SettingsPage;