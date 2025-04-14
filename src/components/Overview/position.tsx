const Position = ({positions}: {positions: any}) => {
  return(
    <div className="overflow-x-auto md:w-1/2 w-full p-6 rounded-xl bg-white shadow-1 dark:bg-gray-800 dark:shadow-card">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">My Assets</h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-primary/10 dark:bg-primary/5">
            <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-200">
              Asset Class
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-200">
              Symbol
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-200">
              Quantity
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-200">
              Average Price
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-200">
              Current Price
            </th>
          </tr>
        </thead>
        <tbody>
          {positions.map((position: any) => (
            <tr 
              key={position.symbol} 
              className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                {position.asset_class}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                {position.symbol}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                {position.qty}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                ${new Intl.NumberFormat('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }).format(position.avg_entry_price)}
              </td>
              <td className="px-4 py-3 text-sm">
                <span className={`${
                  position.current_price >= position.avg_entry_price 
                    ? 'text-green-500 dark:text-green-400' 
                    : 'text-red-500 dark:text-red-400'
                }`}>
                  ${new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }).format(position.current_price)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
};

export default Position;


