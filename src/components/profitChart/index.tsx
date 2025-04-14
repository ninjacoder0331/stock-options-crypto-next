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

  const maxValue = Math.max(...weeklyData.map(d => Math.abs(d.profit)));

  return (
    <div className="rounded-sm border-stroke bg-white p-4 shadow-default shadow-default shadow-1 dark:bg-gray-800 dark:shadow-card">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-black dark:text-white">
          Weekly Profit/Loss
        </h3>
        <select
          value={selectedWeeks}
          onChange={(e) => setSelectedWeeks(Number(e.target.value))}
          className="rounded-lg border border-stroke bg-transparent px-3 py-2 text-sm font-medium outline-none transition-all focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
        >
          <option value={1} className='dark:text-white dark:bg-gray-800 '>Current Week</option>
          <option value={2} className='dark:text-white dark:bg-gray-800 '>Last 2 Weeks</option>
          <option value={3} className='dark:text-white dark:bg-gray-800 '>Last 3 Weeks</option>
          <option value={100} className='dark:text-white dark:bg-gray-800 '>All Time</option>
        </select>
      </div>

      {/* Chart Container with Scroll */}
      <div className="overflow-x-auto">
        <div className="h-80 min-w-[640px]"> {/* Add minimum width */}
          <div className="flex h-full">
            {/* Y-axis labels */}
            <div className="flex flex-col justify-between pr-2 text-sm -mt-12">
              <span className="text-primary">${maxValue.toFixed(2)}</span>
              <span className="text-gray-5 dark:text-gray-4">$0</span>
              <span className="text-[#DC2626]">-${maxValue.toFixed(2)}</span>
            </div>

            {/* Chart Area */}
            <div className="relative flex-1">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between">
                <div className="h-[1px] w-full bg-gray-200 dark:bg-dark-3 opacity-50 "></div>
                <div className="h-[1px] w-full bg-gray-200 dark:bg-dark-3 -mt-16"></div>
                <div className="h-[1px] w-full bg-gray-200 dark:bg-dark-3 opacity-50"></div>
              </div>

              {/* Bars Container */}
              <div className="flex h-full items-center justify-between gap-4"> {/* Increased gap for better spacing */}
                {weeklyData.map((data, index) => (
                  <div 
                    key={index} 
                    className="flex h-full flex-col items-center justify-center gap-2"
                  >
                    {/* Bar Container */}
                    <div className="relative h-full w-12"> {/* Increased width for better visibility */}
                      {data.profit >= 0 ? (
                        // Positive Bar
                        <div
                          className="absolute bottom-1/2 w-full rounded-sm bg-primary transition-all duration-300"
                          style={{
                            height: `${(data.profit / maxValue) * 50}%`,
                          }}
                        >
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold py-1 text-primary">
                            +${data.profit.toFixed(2)}
                          </div>
                        </div>
                      ) : (
                        // Negative Bar
                        <div
                          className="absolute top-1/2 w-full rounded-sm bg-[#DC2626] transition-all duration-300"
                          style={{
                            height: `${(Math.abs(data.profit) / maxValue) * 50}%`,
                          }}
                        >
                          <div className="absolute top-full left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold py-1 text-[#DC2626]">
                            -${Math.abs(data.profit).toFixed(2)}
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Day and Date Labels */}
                    <div className="flex flex-col items-center gap-0.5 min-w-[60px] mt-4"> {/* Added minimum width */}
                      <span className={`text-sm font-medium ${
                        data.profit < 0 ? 'text-[#DC2626]' : 'text-gray-5 dark:text-gray-4'
                      }`}>
                        {data.dayName}
                      </span>
                      <span className={`text-xs ${
                        data.profit < 0 ? 'text-[#DC2626]' : 'text-gray-5 dark:text-gray-4'
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
