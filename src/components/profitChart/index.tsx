import { useState, useMemo } from 'react';

const ProfitChat = ({ portfolioHistory }: { portfolioHistory: any }) => {
  const [selectedWeeks, setSelectedWeeks] = useState<number>(1);

  const weeklyData = useMemo(() => {
    if (!portfolioHistory?.timestamp || !portfolioHistory?.profit_loss) {
      return [];
    }

    const dataPairs = portfolioHistory.timestamp.map((timestamp: number, index: number) => {
      const date = new Date(timestamp * 1000);
      return {
        date,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        // Format date as MM/DD
        dateStr: date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
        profit: portfolioHistory.profit_loss[index]
      };
    });

    dataPairs.sort((a, b) => b.date.getTime() - a.date.getTime());

    const daysToShow = selectedWeeks * 7;
    return dataPairs.slice(0, daysToShow);
  }, [portfolioHistory, selectedWeeks]);

  // Add 10% padding to the max value to ensure bars don't touch the edges
  const maxValue = Math.max(...weeklyData.map(d => Math.abs(d.profit))) * 1.1;

  return (
    <div className="rounded-lg border border-stroke bg-white p-4 shadow-md dark:bg-gray-800 dark:border-gray-700">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-xl font-semibold text-black dark:text-white">
          Weekly Profit/Loss
        </h3>
        <select
          value={selectedWeeks}
          onChange={(e) => setSelectedWeeks(Number(e.target.value))}
          className="rounded-lg border border-stroke bg-transparent px-3 py-2 text-sm font-medium outline-none transition-all focus:border-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value={1} className='dark:text-white dark:bg-gray-800'>Current Week</option>
          <option value={2} className='dark:text-white dark:bg-gray-800'>Last 2 Weeks</option>
          <option value={3} className='dark:text-white dark:bg-gray-800'>Last 3 Weeks</option>
          <option value={100} className='dark:text-white dark:bg-gray-800'>All Time</option>
        </select>
      </div>

      {/* Chart Container with Scroll */}
      <div className="overflow-x-auto custom-scrollbar">
        <div className="h-80 min-w-[640px] md:min-w-full"> 
          <div className="flex h-full">
            {/* Y-axis labels */}
            <div className="flex flex-col justify-between pr-2 text-sm -mt-12">
              <span className="text-primary font-medium">${maxValue.toFixed(2)}</span>
              <span className="text-gray-500 dark:text-gray-400">$0</span>
              <span className="text-red-600 font-medium">-${maxValue.toFixed(2)}</span>
            </div>

            {/* Chart Area */}
            <div className="relative flex-1">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between">
                <div className="h-[1px] w-full bg-gray-200 dark:bg-gray-700 opacity-50"></div>
                <div className="h-[1px] w-full bg-gray-200 dark:bg-gray-700 -mt-16"></div>
                <div className="h-[1px] w-full bg-gray-200 dark:bg-gray-700 opacity-50"></div>
              </div>

              {/* Bars Container with padding */}
              <div className="flex h-full items-center justify-between gap-2 md:gap-4 py-4"> 
                {weeklyData.map((data, index) => (
                  <div 
                    key={index} 
                    className="flex h-full flex-col items-center justify-center gap-2"
                  >
                    {/* Bar Container */}
                    <div className="relative h-full w-8 md:w-12"> 
                      {data.profit >= 0 ? (
                        // Positive Bar
                        <div
                          className="absolute bottom-1/2 w-full rounded-md bg-primary transition-all duration-300"
                          style={{
                            height: `${(data.profit / maxValue) * 45}%`, // Reduced from 50% to 45% for padding
                          }}
                        >
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold py-1 text-primary">
                            +${data.profit.toFixed(2)}
                          </div>
                        </div>
                      ) : (
                        // Negative Bar
                        <div
                          className="absolute top-1/2 w-full rounded-md bg-red-600 transition-all duration-300"
                          style={{
                            height: `${(Math.abs(data.profit) / maxValue) * 45}%`, // Reduced from 50% to 45% for padding
                          }}
                        >
                          <div className="absolute top-full left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold py-1 text-red-600">
                            -${Math.abs(data.profit).toFixed(2)}
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Day and Date Labels */}
                    <div className="flex flex-col items-center gap-0.5 min-w-[50px] md:min-w-[60px] mt-4"> 
                      <span className={`text-xs md:text-sm font-medium ${
                        data.profit < 0 ? 'text-red-600' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {data.dayName}
                      </span>
                      <span className={`text-xs ${
                        data.profit < 0 ? 'text-red-600' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {data.dateStr}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default ProfitChat;
