import { useEffect } from "react";


const OptionsChainComponent = ({data, current_Price, selectedDate, setStrikePrice } : {data: any, current_Price: string, selectedDate: Date, setStrikePrice: (strikePrice: string) => void}) => {

  useEffect(() => {
    console.log("data", data.snapshots);
  }, [data]);

  const selectOptionsStrike = (quote) =>{
    console.log("quote" , quote)
    const value = quote.symbol + " | $" + quote.strike_price
    setStrikePrice(value)
  }

    return (
        <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Options Chain</h1>
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                {data.length} Options
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-500 dark:text-gray-400">Current Price</span>
                <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  ${parseFloat(current_Price).toFixed(2)}
                </span>
              </div>
              <div className="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-500 dark:text-gray-400">Last Updated</span>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>

          {/* Table Container with fixed height */}
          <div className="h-[calc(75vh-8rem)] overflow-auto p-4" >
            {data ? (
              <table className="w-full table-auto border-collapse cursor-pointer">
                <thead className="sticky top-0 bg-white dark:bg-gray-800">
                  <tr>
                    <th className="border-b border-gray-200 bg-gray-100 px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:border-gray-700 dark:bg-gray-700 dark:text-white">
                      Strike Price
                    </th>
                    <th className="border-b border-gray-200 bg-gray-100 px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:border-gray-700 dark:bg-gray-700 dark:text-white">
                      Mid Price
                    </th>
                    <th className="border-b border-gray-200 bg-gray-100 px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:border-gray-700 dark:bg-gray-700 dark:text-white">
                      Bid Price
                    </th>
                    <th className="border-b border-gray-200 bg-gray-100 px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:border-gray-700 dark:bg-gray-700 dark:text-white">
                      Ask Price
                    </th>
                    <th className="border-b border-gray-200 bg-gray-100 px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:border-gray-700 dark:bg-gray-700 dark:text-white">
                      Symbol
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {data.snapshots && Object.entries(data.snapshots)
                    .sort(([, a], [, b]) => {
                      const strikeA = Number((a as { strike_price?: string })?.strike_price) || 0;
                      const strikeB = Number((b as { strike_price?: string })?.strike_price) || 0;
                      return strikeA - strikeB;
                    })
                    .map(([key, quote]: [string, any], index) => {
                      const strikePrice = Number(quote.strike_price) || 0;
                      // const isNearCurrentPrice = Math.abs(strikePrice - currentPrice) <= 5;
                      
                      return (
                        <tr 
                          key={key} 
                          onClick={() => selectOptionsStrike(quote)}
                          // ref={isNearCurrentPrice ? targetRowRef : null}
                          // className={`hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                          //   quote.askPrice > currentPrice ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          // }`}
                        >
                          <td className="px-6 py-4 text-sm text-emerald-500 dark:text-emerald-400 font-bold">
                            {quote.strike_price || '-'}
                          </td>
                          <td className="px-6 py-4 text-sm text-rose-500 dark:text-rose-400 font-bold">
                            {((quote.bidPrice + quote.askPrice)/2).toFixed(2) || '-'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                            {quote.bidPrice || '-'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                            {quote.askPrice || '-'}
                          </td>
                          
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                            {quote.root_symbol || '-'}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            ) : (
              <div className="py-4 text-center text-gray-500 dark:text-gray-400">
                No data available
              </div>
            )}
          </div>
        </div>

        // </div>
    )
}

export default OptionsChainComponent;
