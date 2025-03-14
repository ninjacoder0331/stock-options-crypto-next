'use client'

const AccountInfor = ({accountInfo}: {accountInfo: any}) => {
  return (
    <div className="overflow-x-auto w-full md:w-1/2 p-6 rounded-xl bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Account Information</h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-primary/10 dark:bg-primary/5">
            <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-200">
              Account Details
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold text-gray-800 dark:text-gray-200">
              Values
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
              Account Status
            </td>
            <td className="px-4 py-3 text-sm">
              <span className={`${
                accountInfo.status === 'ACTIVE' 
                  ? 'text-green-500 dark:text-green-400' 
                  : 'text-red-500 dark:text-red-400'
              }`}>
                {accountInfo.status}
              </span>
            </td>
          </tr>
          <tr className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
              Buying Power
            </td>
            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
              ${new Intl.NumberFormat('en-US').format(accountInfo.buying_power)}
            </td>
          </tr>
          <tr className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
              Equity
            </td>
            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
              ${new Intl.NumberFormat('en-US').format(accountInfo.equity)}
            </td>
          </tr>
          <tr className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
              Cash
            </td>
            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
              ${new Intl.NumberFormat('en-US').format(accountInfo.cash)}
            </td>
          </tr>
          <tr className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
              Options Approved Level
            </td>
            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
              {accountInfo.options_approved_level}
            </td>
          </tr>
          <tr className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
              Options Buying Power
            </td>
            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
              ${new Intl.NumberFormat('en-US').format(accountInfo.options_buying_power)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
};

export default AccountInfor;


