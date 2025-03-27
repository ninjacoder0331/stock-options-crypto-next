import { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PortfolioChartProps {
  portfolioHistory: {
    timestamp: number[];
    equity: number[];
    profit_loss_pct: number[];
  };
}

const PortfolioChart = ({ portfolioHistory }: PortfolioChartProps) => {
  const [timeRange, setTimeRange] = useState<'1w' | '2w' | 'all'>('1w');
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);

  const chartData = useMemo(() => {
    if (!portfolioHistory?.timestamp || !portfolioHistory?.equity) {
      return { labels: [], data: [], pctData: [] };
    }

    // Create data pairs and sort by date
    const dataPairs = portfolioHistory.timestamp.map((timestamp, index) => ({
      date: new Date(timestamp * 1000),
      equity: portfolioHistory.equity[index],
      pct: portfolioHistory.profit_loss_pct[index]
    }));
    dataPairs.sort((a, b) => a.date.getTime() - b.date.getTime());

    // Filter based on selected time range
    const now = new Date();
    const filteredPairs = dataPairs.filter(pair => {
      if (timeRange === '1w') {
        return now.getTime() - pair.date.getTime() <= 7 * 24 * 60 * 60 * 1000;
      }
      if (timeRange === '2w') {
        return now.getTime() - pair.date.getTime() <= 14 * 24 * 60 * 60 * 1000;
      }
      return true;
    });

    return {
      labels: filteredPairs.map(pair => 
        pair.date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        })
      ),
      data: filteredPairs.map(pair => pair.equity),
      pctData: filteredPairs.map(pair => pair.pct)
    };
  }, [portfolioHistory, timeRange]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#64748B'
        }
      },
      y: {
        grid: {
          color: '#E2E8F0'
        },
        ticks: {
          callback: (value: number) => `$${value.toFixed(2)}`,
          color: '#64748B'
        }
      }
    },
    onClick: (event: any, elements: any) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        setSelectedPointIndex(index);
      } else {
        setSelectedPointIndex(null);
      }
    },
    onHover: (event: any, elements: any) => {
      event.native.target.style.cursor = elements.length ? 'pointer' : 'default';
    }
  };

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        data: chartData.data,
        borderColor: '#2563EB',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: (context: any) => {
          const index = context.dataIndex;
          return index === selectedPointIndex ? 8 : 4;
        },
        pointBackgroundColor: (context: any) => {
          const index = context.dataIndex;
          return index === selectedPointIndex ? '#2563EB' : '#fff';
        },
        pointBorderColor: '#2563EB',
        pointBorderWidth: (context: any) => {
          const index = context.dataIndex;
          return index === selectedPointIndex ? 3 : 2;
        },
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#2563EB',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 3,
        pointShadowBlur: 10,
        pointShadowColor: 'rgba(37, 99, 235, 0.5)'
      }
    ]
  };

  return (
    <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-dark-3 dark:bg-dark-2 shadow-1 dark:shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-black">
          Portfolio Value
        </h3>
        <select
          value={timeRange}
          onChange={(e) => {
            setTimeRange(e.target.value as '1w' | '2w' | 'all');
            setSelectedPointIndex(null);
          }}
          className="rounded-lg border border-stroke bg-transparent px-3 py-2 text-sm font-medium outline-none transition-all focus:border-primary dark:border-dark-3 text-black"
        >
          <option value="1w">Last Week</option>
          <option value="2w">Last 2 Weeks</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Added overflow container */}
      <div className="overflow-x-auto">
        <div className="min-w-[600px]"> {/* Minimum width to prevent squishing */}
          <div className="h-[400px] relative">
            <Line options={options} data={data} />
            
            {selectedPointIndex !== null && (
              <div 
                className="absolute bg-white dark:bg-dark-2 p-4 rounded-lg shadow-lg border border-stroke dark:border-dark-3 z-10 animate-fadeIn"
                style={{
                  left: `${selectedPointIndex / (chartData.labels.length - 1) * 100}%`,
                  top: '30%',
                  transform: 'translate(-50%, -120%)'
                }}
              >
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {chartData.labels[selectedPointIndex]}
                </div>
                <div className="text-base font-semibold text-black dark:text-white">
                  ${chartData.data[selectedPointIndex].toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </div>
                <div className={`text-sm font-medium ${
                  chartData.pctData[selectedPointIndex] >= 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'
                }`}>
                  {chartData.pctData[selectedPointIndex] >= 0 ? '+' : ''}
                  {(chartData.pctData[selectedPointIndex] * 100).toFixed(2)}%
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioChart;
