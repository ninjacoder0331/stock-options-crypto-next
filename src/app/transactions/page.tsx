'use client'

import OptionsClosedPosition from "@/components/OptionsClosedPosition";
import StockClosedPosition from "@/components/stockClosedPosition";
import TitleLine from "@/components/TitleLine";
import { useState } from "react";

const TransactionsPage = () => {
  const [selected, setSelected] = useState<string>("stock");

  return (
    <div>
      <TitleLine title="Closed Position" description="My options closed positions" />
      <div className="w-full flex flex-col items-end justify-end gap-4 pr-5">
        <div className="relative">
          <select 
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2.5 rounded-lg cursor-pointer transition-all duration-200
              bg-white dark:bg-gray-800 
              text-gray-800 dark:text-gray-100
              border border-gray-200 dark:border-gray-700
              hover:bg-gray-50 dark:hover:bg-gray-700/50
              hover:border-primary/50 dark:hover:border-primary/50
              focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/30
              focus:border-primary shadow-lg w-48 backdrop-blur-sm"
          >
            <option value="stock" className="bg-white dark:bg-gray-800">Stock</option>
            <option value="options" className="bg-white dark:bg-gray-800">Options</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>
      {selected === "stock" ? <StockClosedPosition /> : <OptionsClosedPosition />}
    </div>
  )
}

export default TransactionsPage;
